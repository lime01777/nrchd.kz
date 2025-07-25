<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller;

class StorageBrowserController extends Controller
{
    // Получить список файлов и папок
    public function list(Request $request)
    {
        $base = public_path('storage');
        $rel = $request->get('path', '');
        $dir = rtrim($base . '/' . ltrim($rel, '/'), '/');
        if (!str_starts_with(realpath($dir), realpath($base))) {
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
        if (!str_starts_with(realpath($file), realpath($base))) {
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
        if (!str_starts_with(realpath($dir), realpath($base))) {
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
} 