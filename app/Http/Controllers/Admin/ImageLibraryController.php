<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageLibraryController extends Controller
{
    /**
     * Получение списка всех изображений из директории news
     */
    public function getNewsImages()
    {
        try {
            $files = Storage::disk('public')->files('news');
            $images = [];
            
            foreach ($files as $file) {
                if (in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $url = asset('storage/' . $file);
                    $images[] = [
                        'path' => $file,
                        'url' => $url,
                        'name' => basename($file),
                        'size' => Storage::disk('public')->size($file),
                        'last_modified' => Storage::disk('public')->lastModified($file)
                    ];
                }
            }
            
            // Сортируем по дате модификации (новые сверху)
            usort($images, function($a, $b) {
                return $b['last_modified'] - $a['last_modified'];
            });
            
            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Ошибка при получении списка изображений: ' . $e->getMessage());
            return response()->json(['error' => 'Не удалось получить список изображений'], 500);
        }
    }
}
