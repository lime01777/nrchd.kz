<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HealthTechnology;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HealthTechnologyRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = HealthTechnology::query();
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Add other filters as needed...
        
        $data = $query->latest()->get();
        
        return Inertia::render('Admin/Registry/Index', [
            'initialRegistryData' => $data
        ]);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            // Add more validations if needed
        ]);
        
        // Handle image/file uploads separately if we move to real files.
        // For now, logoUrl and documents might be passed as strings or we handle files here.
        // Assuming user passes JSON data directly for simplicity if React side converts to base64.
        
        HealthTechnology::create($request->all());

        return redirect()->back()->with('success', 'Технология добавлена успешно.');
    }

    /**
     * Upload a file and return its URL.
     */
    public function uploadFile(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = public_path('storage/health_technologies');
            
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            
            $file->move($path, $filename);
            
            return response()->json([
                'url' => '/storage/health_technologies/' . $filename,
                'filename' => $filename
            ]);
        }
        
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    /**
     * Display the registry dashboard.
     */
    public function dashboard()
    {
        $data = HealthTechnology::all();
        return Inertia::render('Admin/Registry/Dashboard', [
            'registryData' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tech = HealthTechnology::findOrFail($id);
        $tech->update($request->all());
        
        return redirect()->back()->with('success', 'Технология обновлена успешно.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        HealthTechnology::destroy($id);
        return redirect()->back()->with('success', 'Технология удалена.');
    }
}
