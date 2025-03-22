<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Document::with('category')
            ->orderBy('order')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'description' => $document->description,
                    'file_name' => $document->file_name,
                    'file_type' => $document->file_type,
                    'file_size' => $document->file_size,
                    'category' => $document->category->title,
                    'is_active' => $document->is_active,
                    'created_at' => $document->created_at->format('d.m.Y'),
                ];
            });
        
        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = DocumentCategory::orderBy('title')->get();
        
        return Inertia::render('Admin/Documents/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:document_categories,id',
            'description' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // 10MB max
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileSize = $this->formatFileSize($file->getSize());
        $fileType = $this->getFileType($file->getClientOriginalExtension());
        $img = $this->getFileImage($file->getClientOriginalExtension());
        
        // Сохраняем файл
        $filePath = $file->store('documents', 'public');

        Document::create([
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'img' => $img,
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return Redirect::route('admin.documents.index')
            ->with('success', 'Документ успешно загружен');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        $categories = DocumentCategory::orderBy('title')->get();
        
        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document,
            'categories' => $categories,
            'file_url' => asset('storage/' . $document->file_path),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:document_categories,id',
            'description' => 'required|string|max:255',
            'file' => 'nullable|file|max:10240', // 10MB max
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $data = [
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'order' => $validated['order'] ?? $document->order,
            'is_active' => $validated['is_active'] ?? $document->is_active,
        ];

        // Если загружен новый файл
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileSize = $this->formatFileSize($file->getSize());
            $fileType = $this->getFileType($file->getClientOriginalExtension());
            $img = $this->getFileImage($file->getClientOriginalExtension());
            
            // Удаляем старый файл
            if (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }
            
            // Сохраняем новый файл
            $filePath = $file->store('documents', 'public');
            
            $data['file_path'] = $filePath;
            $data['file_name'] = $fileName;
            $data['file_type'] = $fileType;
            $data['file_size'] = $fileSize;
            $data['img'] = $img;
        }

        $document->update($data);

        return Redirect::route('admin.documents.index')
            ->with('success', 'Документ успешно обновлен');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        // Удаляем файл
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        $document->delete();

        return Redirect::route('admin.documents.index')
            ->with('success', 'Документ успешно удален');
    }

    /**
     * Format file size to human readable format
     */
    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Get file type based on extension
     */
    private function getFileType($extension)
    {
        $extension = strtolower($extension);
        
        switch ($extension) {
            case 'pdf':
                return 'pdf';
            case 'doc':
            case 'docx':
                return 'doc';
            case 'xls':
            case 'xlsx':
                return 'xls';
            case 'ppt':
            case 'pptx':
                return 'ppt';
            default:
                return $extension;
        }
    }

    /**
     * Get file image number based on extension
     */
    private function getFileImage($extension)
    {
        $extension = strtolower($extension);
        
        switch ($extension) {
            case 'pdf':
                return 2;
            case 'doc':
            case 'docx':
                return 1;
            case 'xls':
            case 'xlsx':
                return 3;
            case 'ppt':
            case 'pptx':
                return 4;
            default:
                return 2;
        }
    }
}
