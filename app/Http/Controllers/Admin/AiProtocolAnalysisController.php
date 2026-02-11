<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiProtocolAnalysis;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class AiProtocolAnalysisController extends Controller
{
    public function index()
    {
        $analyses = AiProtocolAnalysis::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/AiProtocol/Index', [
            'analyses' => $analyses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:docx,pdf,txt',
            'indication' => 'required|string',
        ]);

        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
        $path = $file->storeAs('ai_protocols', $filename, 'public');

        $analysis = AiProtocolAnalysis::create([
            'name' => $filename,
            'indication' => $request->indication,
            'status' => 'pending',
            'user_id' => auth()->id(),
        ]);

        // Path to the python script
        $scriptPath = base_path('resources/v0.96/main.py');
        $inputPath = storage_path('app/public/' . $path);
        $outputXlsx = storage_path('app/public/ai_protocols_output/' . $analysis->id . '_report.xlsx');
        
        // Ensure output directory exists
        if (!file_exists(dirname($outputXlsx))) {
            mkdir(dirname($outputXlsx), 0755, true);
        }

        // Run analysis in background or inline? Inline for now to see errors, but it might timeout.
        // Better to dispatch a Job. But the user asked for simple "Execute" button.
        // I'll make a separate 'analyze' method that is called via XHR.
        
        return redirect()->back()->with('success', 'File uploaded. Click analyze to start.');
    }

    public function analyze($id)
    {
        $analysis = AiProtocolAnalysis::findOrFail($id);
        $analysis->update(['status' => 'processing', 'log' => 'Starting analysis...']);

        // Define paths
        // Try to find a valid python executable
        $python = 'python3'; // Default system python
        // Check if venv exists and is valid for linux
        $venvPython = base_path('resources/v0.96/.venv_linux/bin/python');
        if (file_exists($venvPython)) {
            $python = $venvPython;
        } else {
            // Fallback but log warning
             \Log::warning("Venv python not found at $venvPython");
        }

        $scriptPath = base_path('resources/v0.96/main.py');
        // We need to find where the file was stored. In store() we did not save the path to DB! 
        // Wait, I should have saved the path.
        // I'll fix store() to save the path or re-use the name.
        
        $inputPath = storage_path('app/public/ai_protocols/' . $analysis->name);
        $outputXlsx = storage_path('app/public/ai_protocols_output/report_' . $analysis->id . '.xlsx');

        // Command: python main.py -i <input> -o <output> --indication <indication>
        // Use Process to run it
        
        try {
            // Ensure .env exists for the script
             if (!file_exists(base_path('resources/v0.96/.env'))) {
                throw new \Exception('.env file not found in resources/v0.96');
            }

            $command = [
                $python,
                $scriptPath,
                '-i', $inputPath,
                '-o', $outputXlsx,
                '--indication', $analysis->indication,
                '--lang', 'ru'
            ];
            
            // Set working directory to resources/v0.96 so it finds modules and .env
            $process = new Process($command, base_path('resources/v0.96'));
            $process->setTimeout(600); // 10 minutes
            $process->run();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            $output = $process->getOutput();
            $analysis->update([
                'status' => 'completed',
                'result_path' => 'ai_protocols_output/report_' . $analysis->id . '.xlsx',
                'log' => $output
            ]);

            return redirect()->back()->with('success', 'Analysis completed.');

        } catch (\Exception $e) {
            $analysis->update([
                'status' => 'error',
                'log' => $e->getMessage() . "\n" . ($process->getErrorOutput() ?? '')
            ]);
            
            return redirect()->back()->with('error', 'Analysis failed: ' . $e->getMessage());
        }
    }

    public function download($id, $type)
    {
        $analysis = AiProtocolAnalysis::findOrFail($id);
        
        if ($type == 'xlsx') {
            $path = storage_path('app/public/' . $analysis->result_path);
        } else {
             // Derive docx path from xlsx path
             $path = str_replace('.xlsx', '.docx', storage_path('app/public/' . $analysis->result_path));
        }

        if (file_exists($path)) {
            return response()->download($path);
        }

        return redirect()->back()->with('error', 'File not found.');
    }
    
    public function destroy($id)
    {
        $analysis = AiProtocolAnalysis::findOrFail($id);
        // Delete files...
        $analysis->delete();
        return redirect()->back();
    }
}
