<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiProtocolAnalysis;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Jobs\RunAiProtocolAnalysis;

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
        
        // Mark as queued/processing
        $analysis->update([
            'status' => 'processing', 
            'progress' => 0, 
            'log' => 'Queued for analysis...'
        ]);

        // Dispatch job to run in background
        RunAiProtocolAnalysis::dispatch($analysis->id);

        return redirect()->back()->with('success', 'Analysis started in background. Screen will update automatically.');
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
