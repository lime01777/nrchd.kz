<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    /**
     * Обслуживает изображения из storage
     */
    public function serve(Request $request, $path)
    {
        // Безопасность: проверяем, что путь не содержит опасные символы
        if (preg_match('/\.\./', $path)) {
            abort(404);
        }

        // Полный путь к файлу
        $fullPath = public_path('storage/' . $path);

        // Проверяем, существует ли файл
        if (!File::exists($fullPath)) {
            abort(404);
        }

        // Проверяем, что это изображение
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        
        if (!in_array($extension, $allowedExtensions)) {
            abort(404);
        }

        // Определяем MIME-тип
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon'
        ];

        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        // Читаем файл
        $file = File::get($fullPath);
        $size = File::size($fullPath);

        // Возвращаем ответ с правильными заголовками
        return Response::make($file, 200, [
            'Content-Type' => $mimeType,
            'Content-Length' => $size,
            'Cache-Control' => 'public, max-age=31536000',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET',
            'Access-Control-Allow-Headers' => 'Content-Type'
        ]);
    }

    /**
     * Обслуживает изображения новостей
     */
    public function serveNewsImage(Request $request, $filename)
    {
        return $this->serve($request, 'news/' . $filename);
    }
}
