<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class FileManagerController extends Controller
{
    /**
     * Просмотр содержимого папки
     */
    public function browse(Request $request)
    {
        try {
            $path = $request->input('path', '/storage/news');
            $allowedExtensions = $request->input('allowedExtensions', ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
            
            // Безопасность: проверяем, что путь начинается с /storage
            if (!str_starts_with($path, '/storage')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Неверный путь'
                ], 400);
            }
            
            // Преобразуем путь для работы с Storage
            $storagePath = str_replace('/storage/', '', $path);
            $fullPath = storage_path('app/public/' . $storagePath);
            
            // Проверяем существование папки
            if (!is_dir($fullPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Папка не найдена'
                ], 404);
            }
            
            $items = [];
            $files = scandir($fullPath);
            
            foreach ($files as $file) {
                if ($file === '.' || $file === '..') {
                    continue;
                }
                
                $filePath = $fullPath . '/' . $file;
                $relativePath = $storagePath . '/' . $file;
                $isDirectory = is_dir($filePath);
                
                $item = [
                    'name' => $file,
                    'type' => $isDirectory ? 'directory' : 'file',
                    'path' => '/storage/' . $relativePath,
                    'size' => $isDirectory ? '-' : $this->formatFileSize(filesize($filePath)),
                    'modified' => date('Y-m-d H:i:s', filemtime($filePath)),
                ];
                
                // Для файлов добавляем URL и проверяем расширение
                if (!$isDirectory) {
                    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    $allowedExts = array_map(function($ext) {
                        return ltrim($ext, '.');
                    }, $allowedExtensions);
                    
                    if (in_array($extension, $allowedExts)) {
                        $item['url'] = '/storage/' . $relativePath;
                        $items[] = $item;
                    }
                } else {
                    // Добавляем все папки
                    $items[] = $item;
                }
            }
            
            // Сортируем: сначала папки, потом файлы, по алфавиту
            usort($items, function($a, $b) {
                if ($a['type'] !== $b['type']) {
                    return $a['type'] === 'directory' ? -1 : 1;
                }
                return strcasecmp($a['name'], $b['name']);
            });
            
            // Формируем хлебные крошки
            $breadcrumbs = $this->generateBreadcrumbs($path);
            
            Log::info('FileManager: Просмотр папки', [
                'path' => $path,
                'items_count' => count($items),
                'breadcrumbs' => $breadcrumbs
            ]);
            
            return response()->json([
                'success' => true,
                'items' => $items,
                'breadcrumbs' => $breadcrumbs,
                'current_path' => $path
            ]);
            
        } catch (\Exception $e) {
            Log::error('FileManager: Ошибка при просмотре папки', [
                'error' => $e->getMessage(),
                'path' => $request->input('path'),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке папки: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Форматирование размера файла
     */
    private function formatFileSize($bytes)
    {
        if ($bytes === 0) return '0 B';
        
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = floor(log($bytes, 1024));
        
        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }
    
    /**
     * Генерация хлебных крошек
     */
    private function generateBreadcrumbs($path)
    {
        $breadcrumbs = [];
        $parts = explode('/', trim($path, '/'));
        
        $currentPath = '';
        foreach ($parts as $part) {
            if (empty($part)) continue;
            
            $currentPath .= '/' . $part;
            $breadcrumbs[] = [
                'name' => $part,
                'path' => $currentPath
            ];
        }
        
        return $breadcrumbs;
    }
    
    /**
     * Загрузка изображения в папку news
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
            ]);
            
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Сохраняем в папку news
            $path = $file->storeAs('news', $filename, 'public');
            
            Log::info('FileManager: Загружен файл', [
                'filename' => $filename,
                'path' => $path,
                'size' => $file->getSize()
            ]);
            
            return response()->json([
                'success' => true,
                'file' => [
                    'name' => $filename,
                    'url' => '/storage/' . $path,
                    'size' => $this->formatFileSize($file->getSize())
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('FileManager: Ошибка при загрузке файла', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке файла: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Создание новой папки
     */
    public function createFolder(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|regex:/^[a-zA-Z0-9_-]+$/',
                'parent_path' => 'required|string'
            ]);
            
            $folderName = $request->input('name');
            $parentPath = $request->input('parent_path');
            
            // Безопасность: проверяем путь
            if (!str_starts_with($parentPath, '/storage')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Неверный путь'
                ], 400);
            }
            
            $storagePath = str_replace('/storage/', '', $parentPath);
            $fullPath = storage_path('app/public/' . $storagePath . '/' . $folderName);
            
            // Проверяем, не существует ли уже папка
            if (is_dir($fullPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Папка уже существует'
                ], 400);
            }
            
            // Создаем папку
            if (!mkdir($fullPath, 0755, true)) {
                throw new \Exception('Не удалось создать папку');
            }
            
            Log::info('FileManager: Создана папка', [
                'name' => $folderName,
                'path' => $fullPath
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Папка создана успешно'
            ]);
            
        } catch (\Exception $e) {
            Log::error('FileManager: Ошибка при создании папки', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании папки: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Удаление файла или папки
     */
    public function delete(Request $request)
    {
        try {
            $request->validate([
                'path' => 'required|string'
            ]);
            
            $path = $request->input('path');
            
            // Безопасность: проверяем путь
            if (!str_starts_with($path, '/storage')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Неверный путь'
                ], 400);
            }
            
            $storagePath = str_replace('/storage/', '', $path);
            $fullPath = storage_path('app/public/' . $storagePath);
            
            // Проверяем существование
            if (!file_exists($fullPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Файл или папка не найдены'
                ], 404);
            }
            
            // Удаляем
            if (is_dir($fullPath)) {
                if (!rmdir($fullPath)) {
                    throw new \Exception('Не удалось удалить папку');
                }
            } else {
                if (!unlink($fullPath)) {
                    throw new \Exception('Не удалось удалить файл');
                }
            }
            
            Log::info('FileManager: Удален элемент', [
                'path' => $path,
                'type' => is_dir($fullPath) ? 'directory' : 'file'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Элемент удален успешно'
            ]);
            
        } catch (\Exception $e) {
            Log::error('FileManager: Ошибка при удалении', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении: ' . $e->getMessage()
            ], 500);
        }
    }
}
