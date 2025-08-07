<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageLibraryController extends Controller
{
    /**
     * Получение изображений из библиотеки
     */
    public function getImages(Request $request)
    {
        try {
            $images = [];
            
            // Получаем изображения из папки news
            $newsPath = 'news';
            if (Storage::disk('public')->exists($newsPath)) {
                $files = Storage::disk('public')->files($newsPath);
                
                foreach ($files as $file) {
                    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        $images[] = [
                            'url' => asset('storage/' . $file),
                            'name' => basename($file),
                            'path' => $file,
                            'size' => Storage::disk('public')->size($file)
                        ];
                    }
                }
            }
            
            // Получаем изображения из других папок (если нужно)
            $otherPaths = ['img', 'images', 'uploads'];
            foreach ($otherPaths as $path) {
                if (Storage::disk('public')->exists($path)) {
                    $files = Storage::disk('public')->files($path);
                    
                    foreach ($files as $file) {
                        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                            $images[] = [
                                'url' => asset('storage/' . $file),
                                'name' => basename($file),
                                'path' => $file,
                                'size' => Storage::disk('public')->size($file)
                            ];
                        }
                    }
                }
            }
            
            // Удаляем дубликаты
            $images = array_unique($images, SORT_REGULAR);
            
            Log::info('Library images loaded', ['count' => count($images)]);
            
            return response()->json([
                'success' => true,
                'images' => $images
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error loading library images', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки библиотеки изображений',
                'images' => []
            ], 500);
        }
    }
}
