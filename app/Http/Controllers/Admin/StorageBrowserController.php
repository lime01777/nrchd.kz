<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Routing\Controller;
use App\Models\ClinicalProtocolMetadata;
use App\Models\ClinicalMedicineCategory;

class StorageBrowserController extends Controller
{
    // Получить список файлов и папок
    public function list(Request $request)
    {
        $base = public_path('storage');
        $rel = $request->get('path', '');
        $dir = rtrim($base . '/' . ltrim($rel, '/'), '/');
        $realBase = realpath($base);
        $realDir = realpath($dir);
        if (!$realDir || !$realBase || !str_starts_with($realDir, $realBase)) {
            return response()->json(['error' => 'Invalid path'], 400);
        }
        $items = [];
        foreach (File::directories($dir) as $folder) {
            $items[] = [
                'type' => 'folder',
                'name' => basename($folder),
                'path' => trim($rel . '/' . basename($folder), '/'),
            ];
        }
        foreach (File::files($dir) as $file) {
            $items[] = [
                'type' => 'file',
                'name' => $file->getFilename(),
                'path' => trim($rel . '/' . $file->getFilename(), '/'),
                'size' => $file->getSize(),
                'url' => asset('storage/' . trim($rel . '/' . $file->getFilename(), '/')),
                'modified' => $file->getMTime(),
            ];
        }

        $filePaths = collect($items)->where('type', 'file')->pluck('path');
        if ($filePaths->isNotEmpty() && Schema::hasTable('clinical_protocol_metadata')) {
            $metadataCollection = ClinicalProtocolMetadata::whereIn('file_path', $filePaths)->get()->keyBy('file_path');
            $categoryIds = $metadataCollection
                ->flatMap(fn ($meta) => $meta->medicine_category_ids ?? [])
                ->unique()
                ->filter();
            $categoriesMap = ($categoryIds->isNotEmpty() && Schema::hasTable('clinical_medicine_categories'))
                ? ClinicalMedicineCategory::whereIn('id', $categoryIds)->pluck('name', 'id')
                : collect();

            foreach ($items as &$item) {
                if ($item['type'] !== 'file') {
                    continue;
                }

                $meta = $metadataCollection->get($item['path']);
                if ($meta) {
                    $item['medicine_categories'] = array_values(array_filter(array_map(
                        fn ($id) => $categoriesMap[$id] ?? null,
                        $meta->medicine_category_ids ?? []
                    )));
                    $item['mkb_codes'] = $meta->mkb_codes ?? [];
                } else {
                    $item['medicine_categories'] = [];
                    $item['mkb_codes'] = [];
                }
            }
            unset($item);
        } else {
            foreach ($items as &$item) {
                if ($item['type'] === 'file') {
                    $item['medicine_categories'] = [];
                    $item['mkb_codes'] = [];
                }
            }
            unset($item);
        }

        return response()->json([
            'current' => $rel,
            'items' => $items,
            'parent' => $rel ? dirname($rel) : null,
        ]);
    }

    // Удалить файл
    public function delete(Request $request)
    {
        $base = public_path('storage');
        $rel = $request->get('path');
        $file = rtrim($base . '/' . ltrim($rel, '/'), '/');
        $realBase = realpath($base);
        $realFile = realpath($file);
        if (!$realFile || !$realBase || !str_starts_with($realFile, $realBase)) {
            return response()->json(['error' => 'Invalid path'], 400);
        }
        if (is_file($file)) {
            unlink($file);
            return response()->json(['success' => true]);
        }
        if (is_dir($file)) {
            File::deleteDirectory($file);
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Not found'], 404);
    }

    // Загрузить файл
    public function upload(Request $request)
    {
        $base = public_path('storage');
        $rel = $request->get('path', '');
        $dir = rtrim($base . '/' . ltrim($rel, '/'), '/');
        $realBase = realpath($base);
        $realDir = realpath($dir);
        if (!$realDir || !$realBase || !str_starts_with($realDir, $realBase)) {
            return response()->json(['error' => 'Invalid path'], 400);
        }
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }
        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
        $file->move($dir, $filename);
        return response()->json(['success' => true]);
    }

    public function updateMetadata(Request $request)
    {
        if (!Schema::hasTable('clinical_protocol_metadata')) {
            return response()->json([
                'error' => 'Таблица clinical_protocol_metadata отсутствует. Запустите миграции.',
            ], 422);
        }

        $validated = $request->validate([
            'path' => 'required|string',
            'medicine_categories' => 'array',
            'medicine_categories.*' => 'string|max:255',
            'mkb_codes' => 'array',
            'mkb_codes.*' => 'string|max:255',
        ]);

        $path = trim($validated['path']);
        $medicineCategories = $validated['medicine_categories'] ?? [];
        $mkbCodes = $validated['mkb_codes'] ?? [];

        $allowedMkbCodes = collect(config('clinical_protocols.mkb_categories', []))->pluck('code')->toArray();
        $mkbCodes = array_values(array_unique(array_filter($mkbCodes, fn ($code) => in_array($code, $allowedMkbCodes, true))));

        $categoryIds = [];
        if (Schema::hasTable('clinical_medicine_categories')) {
            foreach ($medicineCategories as $name) {
                $normalized = trim($name);
                if ($normalized === '') {
                    continue;
                }
                $category = ClinicalMedicineCategory::firstOrCreate(['name' => $normalized]);
                $categoryIds[] = $category->id;
            }
            $categoryIds = array_values(array_unique($categoryIds));
        } else {
            $categoryIds = [];
        }

        $metadata = ClinicalProtocolMetadata::updateOrCreate(
            ['file_path' => $path],
            [
                'medicine_category_ids' => $categoryIds,
                'mkb_codes' => $mkbCodes,
            ]
        );

        $categoriesMap = ($categoryIds && Schema::hasTable('clinical_medicine_categories'))
            ? ClinicalMedicineCategory::whereIn('id', $categoryIds)->pluck('name', 'id')
            : collect();

        $medicineNames = $categoryIds
            ? array_values(array_filter(array_map(fn ($id) => $categoriesMap[$id] ?? null, $categoryIds)))
            : [];

        return response()->json([
            'medicine_categories' => $medicineNames,
            'mkb_codes' => $metadata->mkb_codes ?? [],
            'available_categories' => Schema::hasTable('clinical_medicine_categories')
                ? ClinicalMedicineCategory::orderBy('name')->pluck('name')
                : collect(config('clinical_protocols.defaults.medicine_categories', [])),
        ]);
    }
} 