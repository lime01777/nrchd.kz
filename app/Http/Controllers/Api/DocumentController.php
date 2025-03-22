<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    /**
     * Get documents by accordion ID.
     *
     * @param string $accordion_id
     * @return JsonResponse
     */
    public function getByAccordionId($accordion_id): JsonResponse
    {
        $categories = DocumentCategory::where('accordion_id', $accordion_id)
            ->where('is_active', true)
            ->orderBy('order')
            ->with(['documents' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('order');
            }])
            ->get();

        $sections = $categories->map(function ($category) {
            return [
                'title' => $category->title,
                'documents' => $category->documents->map(function ($document) {
                    return [
                        'description' => $document->description,
                        'filetype' => $document->file_type,
                        'img' => $document->img,
                        'filesize' => $document->file_size,
                        'date' => $document->created_at->format('d.m.Y'),
                        'url' => asset('storage/' . $document->file_path),
                    ];
                }),
            ];
        })->filter(function ($section) {
            return count($section['documents']) > 0;
        })->values();

        return response()->json($sections);
    }
}
