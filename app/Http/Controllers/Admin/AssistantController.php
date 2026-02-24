<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HealthTechnology;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Log;

class AssistantController extends Controller
{
    public function index()
    {
        $technologies = HealthTechnology::select('id', 'name', 'registry_code', 'documents')->get();
        return Inertia::render('Admin/Assistant/Index', [
            'technologies' => $technologies
        ]);
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'tech_id' => 'required|exists:health_technologies,id',
            'history' => 'nullable|array'
        ]);

        $tech = HealthTechnology::findOrFail($request->tech_id);
        
        $python = base_path('resources/v0.96/.venv_linux/bin/python');
        $script = base_path('resources/v0.96/assistant_chat.py');

        if (!file_exists($python)) {
            $python = 'python3';
        }

        // Prepare context and documents
        $context = "Технология: " . $tech->name . "\n";
        $context .= "Регистрационный код: " . $tech->registry_code . "\n";
        
        $docPaths = [];
        if ($tech->documents && is_array($tech->documents)) {
            foreach ($tech->documents as $doc) {
                if (isset($doc['url'])) {
                    // Convert /storage/... to absolute path
                    $relative = str_replace('/storage/', '', $doc['url']);
                    $abs = storage_path('app/public/' . $relative);
                    if (file_exists($abs)) {
                        $docPaths[] = $abs;
                    }
                }
            }
        }
        
        $command = [
            $python,
            $script,
            '--message', $request->message,
            '--context', $context,
            '--history', json_encode($request->history ?? []),
            '--files', implode(',', $docPaths)
        ];

        try {
            $process = new Process($command, base_path('resources/v0.96'));
            $process->setTimeout(120); // Longer timeout for file parsing
            $process->run();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            $output = $process->getOutput();
            $response = json_decode($output, true);

            if (!$response) {
                Log::error('AI Assistant JSON Parse Error. Raw output: ' . $output);
                return response()->json([
                    'success' => false,
                    'reply' => 'Ошибка обработки ответа AI (неверный формат JSON).',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'reply' => $response['reply'] ?? 'Извините, возникла ошибка при генерации ответа.',
            ]);

        } catch (\Exception $e) {
            Log::error('AI Assistant Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Ошибка AI сервиса: ' . $e->getMessage(),
                'reply' => 'Произошла ошибка при обращении к AI.'
            ], 500);
        }
    }

    public function uploadDocument(Request $request, $techId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx,doc,txt|max:10240',
        ]);

        $tech = HealthTechnology::findOrFail($techId);
        
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Store in public disk
            $path = $file->storeAs('health_technologies', $filename, 'public');
            
            $newDoc = [
                'name' => $filename,
                'url' => '/storage/' . $path,
                'date' => now()->format('d.m.Y'),
                'type' => 'document'
            ];

            $docs = $tech->documents ?? [];
            $docs[] = $newDoc;
            
            $tech->update(['documents' => $docs]);

            return response()->json([
                'success' => true,
                'document' => $newDoc
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function deleteDocument(Request $request, $techId)
    {
        $request->validate([
            'doc_name' => 'required|string'
        ]);

        $tech = HealthTechnology::findOrFail($techId);
        $docs = $tech->documents ?? [];
        $docToDelete = null;

        $newDocs = array_filter($docs, function ($d) use ($request, &$docToDelete) {
            if ($d['name'] === $request->doc_name) {
                $docToDelete = $d;
                return false;
            }
            return true;
        });

        if ($docToDelete) {
            // Remove file from storage
            $path = str_replace('/storage/', '', $docToDelete['url']);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            
            $tech->update(['documents' => array_values($newDocs)]);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Document not found'], 404);
    }
}
