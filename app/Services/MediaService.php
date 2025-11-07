<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Разрешенные типы изображений
     */
    const ALLOWED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    
    /**
     * Разрешенные типы видео
     */
    const ALLOWED_VIDEO_TYPES = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
    
    /**
     * Максимальный размер файла (100MB)
     */
    const MAX_FILE_SIZE = 102400; // KB
    
    /**
     * Загрузить медиа файл
     */
    public function uploadMedia(UploadedFile $file, string $directory = 'news'): array
    {
        try {
            // Отладочная информация
            Log::info('Загрузка медиа файла', [
                'name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'max_size' => self::MAX_FILE_SIZE * 1024
            ]);
            
            // Валидация файла
            $this->validateFile($file);
            
            // Генерируем уникальное имя файла
            $filename = $this->generateUniqueFilename($file);
            
            // Сохраняем файл
            $path = $file->storeAs($directory, $filename, 'public');
            
            // Определяем тип медиа
            $type = $this->getMediaType($file);
            
            // Получаем размер файла
            $size = $file->getSize();
            
            // Создаем запись о медиа
            $mediaData = [
                'id' => Str::uuid()->toString(),
                'path' => '/storage/' . $path,
                'type' => $type,
                'name' => $file->getClientOriginalName(),
                'size' => $size,
                'mime_type' => $file->getMimeType(),
                'uploaded_at' => now()->toISOString(),
                'is_cover' => false,
                'position' => 0
            ];
            
            Log::info('Медиа файл загружен', [
                'filename' => $filename,
                'type' => $type,
                'size' => $size,
                'path' => $path
            ]);
            
            return $mediaData;
            
        } catch (\Exception $e) {
            Log::error('Ошибка загрузки медиа файла', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName()
            ]);
            throw $e;
        }
    }
    
    /**
     * Загрузить несколько медиа файлов
     */
    public function uploadMultipleMedia(array $files, string $directory = 'news'): array
    {
        $uploadedMedia = [];
        
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $uploadedMedia[] = $this->uploadMedia($file, $directory);
            }
        }
        
        return $uploadedMedia;
    }
    
    /**
     * Удалить медиа файл
     */
    public function deleteMedia(string $path): bool
    {
        try {
            $realPath = $path;

            if (str_contains($realPath, 'storage/')) {
                $realPath = substr($realPath, strpos($realPath, 'storage/') + strlen('storage/'));
            }

            $realPath = ltrim($realPath, '/');

            if (Storage::disk('public')->exists($realPath)) {
                Storage::disk('public')->delete($realPath);
                
                Log::info('Медиа файл удален', ['path' => $realPath]);
                return true;
            }
            
            return false;
            
        } catch (\Exception $e) {
            Log::error('Ошибка удаления медиа файла', [
                'error' => $e->getMessage(),
                'path' => $path
            ]);
            return false;
        }
    }
    
    /**
     * Обновить порядок медиа
     */
    public function updateMediaOrder(array $mediaItems): array
    {
        $orderedMedia = [];
        
        foreach ($mediaItems as $index => $item) {
            if (is_array($item)) {
                $item['position'] = $index;
                $orderedMedia[] = $item;
            }
        }
        
        return $orderedMedia;
    }
    
    /**
     * Установить обложку
     */
    public function setCover(array $mediaItems, string $coverId): array
    {
        return array_map(function ($item) use ($coverId) {
            if (is_array($item)) {
                $item['is_cover'] = ($item['id'] ?? '') === $coverId;
            }
            return $item;
        }, $mediaItems);
    }
    
    /**
     * Получить URL медиа файла
     */
    public function getMediaUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        
        if (str_starts_with($path, '/storage/')) {
            return asset($path);
        }
        
        return asset('storage/' . $path);
    }
    
    /**
     * Получить миниатюру для видео (заглушка)
     */
    public function getVideoThumbnail(string $videoPath): string
    {
        // В будущем здесь можно добавить генерацию миниатюр через FFmpeg
        return '/img/video-placeholder.jpg';
    }
    
    /**
     * Валидация файла
     */
    private function validateFile(UploadedFile $file): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        
        // Проверяем расширение
        $allowedExtensions = array_merge(self::ALLOWED_IMAGE_TYPES, self::ALLOWED_VIDEO_TYPES);
        if (!in_array($extension, $allowedExtensions)) {
            throw new \InvalidArgumentException("Неподдерживаемый тип файла: {$extension}");
        }
        
        // Проверяем MIME тип
        $allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
            'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/ogg',
            'video/mp4v-es', 'video/x-ms-wm', 'video/x-ms-wmx', 'video/x-ms-wvx',
            'video/x-flv', 'video/x-m4v', 'video/3gpp', 'video/x-matroska'
        ];
        
        if (!in_array($mimeType, $allowedMimeTypes)) {
            throw new \InvalidArgumentException("Неподдерживаемый MIME тип: {$mimeType}");
        }
        
        // Проверяем размер файла
        if ($size > (self::MAX_FILE_SIZE * 1024)) {
            throw new \InvalidArgumentException("Файл слишком большой. Максимальный размер: " . self::MAX_FILE_SIZE . "KB");
        }
    }
    
    /**
     * Определить тип медиа по файлу
     */
    private function getMediaType(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (in_array($extension, self::ALLOWED_VIDEO_TYPES)) {
            return 'video';
        }
        
        return 'image';
    }
    
    /**
     * Генерировать уникальное имя файла
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $basename = Str::slug($basename);
        
        // Генерируем уникальное имя
        $filename = $basename . '_' . time() . '_' . Str::random(8) . '.' . $extension;
        
        return $filename;
    }
    
    /**
     * Нормализовать медиа данные для фронтенда
     */
    public function normalizeMediaForFrontend(array $mediaItems): array
    {
        $normalized = array_map(function ($item, $index) {
            if (is_string($item)) {
                $type = $this->detectTypeByPath($item);

                return [
                    'id' => Str::uuid()->toString(),
                    'path' => $item,
                    'url' => $this->getMediaUrl($item),
                    'type' => $type,
                    'name' => basename($item),
                    'size' => 0,
                    'mime_type' => $type === 'video' ? 'video/mp4' : 'image/jpeg',
                    'uploaded_at' => now()->toISOString(),
                    'is_cover' => false,
                    'position' => $index,
                ];
            }

            if (is_array($item)) {
                $path = $item['path'] ?? '';

                $item['id'] = $item['id'] ?? Str::uuid()->toString();
                $item['path'] = $path;
                $item['url'] = $this->getMediaUrl($path);
                $item['type'] = $item['type'] ?? $this->detectTypeByPath($path);
                $item['name'] = $item['name'] ?? basename($path);
                $item['size'] = $item['size'] ?? 0;
                $item['mime_type'] = $item['mime_type'] ?? ($item['type'] === 'video' ? 'video/mp4' : 'image/jpeg');
                $item['uploaded_at'] = $item['uploaded_at'] ?? now()->toISOString();
                $item['is_cover'] = (bool) ($item['is_cover'] ?? false);
                $item['position'] = $item['position'] ?? $index;

                return $item;
            }

            return [];
        }, $mediaItems, array_keys($mediaItems));

        return array_values(array_filter($normalized, fn ($item) => !empty($item)));
    }

    public function detectTypeByPath(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (in_array($extension, self::ALLOWED_VIDEO_TYPES)) {
            return 'video';
        }

        return 'image';
    }
}
