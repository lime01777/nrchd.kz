<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DocumentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = DocumentCategory::orderBy('order')->get();
        
        return Inertia::render('Admin/DocumentCategories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/DocumentCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'accordion_id' => 'required|string|max:255|unique:document_categories',
            'page' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        DocumentCategory::create($validated);

        return Redirect::route('admin.document-categories.index')
            ->with('success', 'Категория документов успешно создана');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentCategory $documentCategory)
    {
        return Inertia::render('Admin/DocumentCategories/Edit', [
            'category' => $documentCategory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentCategory $documentCategory)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'accordion_id' => 'required|string|max:255|unique:document_categories,accordion_id,' . $documentCategory->id,
            'page' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $documentCategory->update($validated);

        return Redirect::route('admin.document-categories.index')
            ->with('success', 'Категория документов успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentCategory $documentCategory)
    {
        $documentCategory->delete();

        return Redirect::route('admin.document-categories.index')
            ->with('success', 'Категория документов успешно удалена');
    }
}
