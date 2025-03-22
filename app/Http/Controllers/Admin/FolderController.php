<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = Folder::orderBy('order')->get();
        
        return Inertia::render('Admin/Folders/Index', [
            'folders' => $folders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Folders/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'colorsec' => 'required|string|max:255',
            'href' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        Folder::create($validated);

        return Redirect::route('admin.folders.index')
            ->with('success', 'Папка успешно создана');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        return Inertia::render('Admin/Folders/Edit', [
            'folder' => $folder
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'colorsec' => 'required|string|max:255',
            'href' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $folder->update($validated);

        return Redirect::route('admin.folders.index')
            ->with('success', 'Папка успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        $folder->delete();

        return Redirect::route('admin.folders.index')
            ->with('success', 'Папка успешно удалена');
    }
}
