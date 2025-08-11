<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    /**
     * Получить список изображений из папки storage/news
     */
    public function getImages(Request $request)
    {
        try {
            $imagesPath = public_path('storage/news');
            $images = [];
            
            if (is_dir($imagesPath)) {
                $files = scandir($imagesPath);
                
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $filePath = $imagesPath . '/' . $file;
                        
                        // Проверяем, что это изображение
                        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
                        
                        if (in_array($extension, $imageExtensions) && is_file($filePath)) {
                            $images[] = [
                                'name' => $file,
                                'path' => '/storage/news/' . $file,
                                'size' => filesize($filePath),
                                'modified' => filemtime($filePath),
                                'url' => url('/storage/news/' . $file)
                            ];
                        }
                    }
                }
                
                // Сортируем по дате изменения (новые сначала)
                usort($images, function($a, $b) {
                    return $b['modified'] - $a['modified'];
                });
            }
            
            Log::info('API: Получен список изображений', ['count' => count($images)]);
            
            return response()->json([
                'success' => true,
                'images' => $images,
                'total' => count($images)
            ]);
            
        } catch (\Exception $e) {
            Log::error('API: Ошибка получения изображений', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка получения изображений: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Загрузить изображение
     */
    public function uploadImage(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'error' => 'Файл не найден'
                ], 400);
            }

            $file = $request->file('image');
            
            // Проверяем тип файла
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!in_array($file->getMimeType(), $allowedTypes)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Неподдерживаемый тип файла'
                ], 400);
            }

            // Проверяем размер файла (максимум 10MB)
            if ($file->getSize() > 10 * 1024 * 1024) {
                return response()->json([
                    'success' => false,
                    'error' => 'Файл слишком большой (максимум 10MB)'
                ], 400);
            }

            $imagesPath = public_path('storage/news');
            
            // Создаем папку если не существует
            if (!is_dir($imagesPath)) {
                mkdir($imagesPath, 0755, true);
            }

            // Генерируем уникальное имя файла
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $imagesPath . '/' . $filename;

            // Перемещаем файл
            $file->move($imagesPath, $filename);

            Log::info('API: Изображение загружено', [
                'filename' => $filename,
                'size' => filesize($filePath)
            ]);

            return response()->json([
                'success' => true,
                'image' => [
                    'name' => $filename,
                    'path' => '/storage/news/' . $filename,
                    'url' => url('/storage/news/' . $filename),
                    'size' => filesize($filePath)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('API: Ошибка загрузки изображения', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Ошибка загрузки изображения: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Удалить изображение
     */
    public function deleteImage(Request $request)
    {
        try {
            $filename = $request->input('filename');
            
            if (!$filename) {
                return response()->json([
                    'success' => false,
                    'error' => 'Имя файла не указано'
                ], 400);
            }

            $filePath = public_path('storage/news/' . $filename);
            
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Файл не найден'
                ], 404);
            }

            // Удаляем файл
            unlink($filePath);

            Log::info('API: Изображение удалено', ['filename' => $filename]);

            return response()->json([
                'success' => true,
                'message' => 'Изображение удалено'
            ]);

        } catch (\Exception $e) {
            Log::error('API: Ошибка удаления изображения', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Ошибка удаления изображения: ' . $e->getMessage()
            ], 500);
        }
    }
}
