<?php

namespace App\Jobs;

use App\Models\AiProtocolAnalysis;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Log;

class RunAiProtocolAnalysis implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 3600; // 1 hour

    protected $analysisId;

    /**
     * Create a new job instance.
     */
    public function __construct($analysisId)
    {
        $this->analysisId = $analysisId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $analysis = AiProtocolAnalysis::find($this->analysisId);
        if (!$analysis) {
            Log::error("AiProtocolAnalysis job failed: Analysis ID {$this->analysisId} not found");
            return;
        }

        $analysis->update(['status' => 'processing', 'progress' => 0, 'log' => 'Starting analysis via Job...']);

        // Define paths (logic copied from Controller)
        $python = base_path('resources/v0.96/.venv_linux/bin/python');
        
        if (!file_exists($python)) {
            $python = 'python3';
            Log::warning("Venv python not found at " . base_path('resources/v0.96/.venv_linux/bin/python') . ", using system python");
        }

        $scriptPath = 'main.py';
        $inputPath = storage_path('app/public/ai_protocols/' . $analysis->name);
        
        $outputDir = storage_path('app/public/ai_protocols_output');
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }
        
        $outputXlsx = $outputDir . '/report_' . $analysis->id . '.xlsx';

        try {
            if (!file_exists(base_path('resources/v0.96/.env'))) {
                throw new \Exception('.env file not found in resources/v0.96');
            }
            
            if (!file_exists($inputPath)) {
                throw new \Exception("Input file not found at: $inputPath");
            }

            $command = [
                $python,
                $scriptPath,
                '-i', $inputPath,
                '-o', $outputXlsx,
                '--indication', $analysis->indication,
                '--lang', 'ru',
                '--max-workers', '4'
            ];
            
            Log::info("Job Running command: " . implode(' ', $command));

            $process = new Process($command, base_path('resources/v0.96'));
            $process->setTimeout(3600); // 1 hour
            
            // Start the process and listen to output
            $process->start(function ($type, $buffer) use ($analysis) {
                // Check if the buffer contains our progress marker
                if (preg_match('/PROGRESS:\s*(\d+)/', $buffer, $matches)) {
                    $progress = min(100, max(0, (int)$matches[1]));
                    
                    // We shouldn't update the DB too frequently if the output is spammy, 
                    // but our PROGRESS prints are sparse enough.
                    // However, we need to be careful not to overwrite 'log' or 'status' if we were tracking them.
                    // Just update progress.
                    $analysis->update(['progress' => $progress]);
                }
            });

            // Wait for the process to finish
            $process->wait();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            // Verify output
            if (!file_exists($outputXlsx)) {
                throw new \Exception("Analysis finished but output file was not created.");
            }

            $analysis->update([
                'status' => 'completed',
                'progress' => 100,
                'result_path' => 'ai_protocols_output/report_' . $analysis->id . '.xlsx',
                'log' => $process->getOutput()
            ]);

            Log::info("AiProtocolAnalysis job completed for ID {$this->analysisId}");

        } catch (\Exception $e) {
            $errorLog = $e->getMessage();
            if (isset($process)) {
                 $errorLog .= "\n\nError Output:\n" . $process->getErrorOutput();
                 $errorLog .= "\n\nStandard Output:\n" . $process->getOutput();
            }
            
            $analysis->update([
                'status' => 'error',
                'progress' => 0,
                'log' => $errorLog
            ]);
            
            Log::error("AiProtocolAnalysis Job Failed: " . $e->getMessage());
            
            // Allow the job to fail so Laravel can handle retries if configured, 
            // but usually we don't want to retry analysis automatically if it crashed.
            // So we catch exception and mark analysis as error.
        }
    }
}
