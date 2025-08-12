<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OptimizedNewsController extends Controller
{
    /**
     * Оптимизированное создание новости с учетом ограничений хостинга
     */
    public function store(Request $request)
    {
        // Настройки для хостинга
        set_time_limit(100); // 100 секунд (меньше лимита хостинга 120 сек)
        ini_set('memory_limit', '512M');
        
        Log::info('Начало создания новости (оптимизированная версия)', [
            'time' => now(),
            'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
        ]);

        try {
            // Проверяем наличие директории
            if (!Storage::disk('public')->exists('news')) {
                Storage::disk('public')->makeDirectory('news');
            }

            // Валидация данных
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string|min:10',
                'category' => 'required|array|min:1',
                'category.*' => 'string',
                'status' => 'required|string|in:Черновик,Опубликовано,Запланировано',
                'publishDate' => 'nullable|date',
                'images' => 'nullable|array',
                'images.*' => 'nullable',
                'image_files' => 'nullable|array',
                'image_files.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'main_image' => 'nullable',
            ]);

            Log::info('Валидация прошла успешно');

            // Генерируем slug
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (News::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Обработка изображений - оптимизированная версия
            $mediaPaths = [];
            
            // Обрабатываем медиа файлы (изображения и видео)
            if ($request->hasFile('media_files')) {
                $files = $request->file('media_files');
                $maxFiles = min(count($files), 10); // Ограничиваем до 10 файлов
                
                Log::info('Начало обработки медиа файлов', ['total_files' => count($files), 'max_files' => $maxFiles]);
                
                for ($i = 0; $i < $maxFiles; $i++) {
                    $file = $files[$i];
                    
                    if ($file && $file->isValid()) {
                        $fileSize = $file->getSize();
                        $maxSize = 50 * 1024 * 1024; // 50MB для видео, 5MB для изображений
                        
                        // Определяем тип файла
                        $mimeType = $file->getMimeType();
                        $isVideo = strpos($mimeType, 'video/') === 0;
                        $isImage = strpos($mimeType, 'image/') === 0;
                        
                        if ($isVideo && $fileSize <= $maxSize) {
                            // Обрабатываем видео
                            try {
                                $filename = time() . '_' . $i . '.' . $file->getClientOriginalExtension();
                                $destinationPath = public_path('videos/news');
                                if (!is_dir($destinationPath)) {
                                    mkdir($destinationPath, 0755, true);
                                }
                                $file->move($destinationPath, $filename);
                                $path = '/videos/news/' . $filename;
                                $mediaPaths[] = [
                                    'path' => $path,
                                    'type' => 'video',
                                    'name' => $file->getClientOriginalName(),
                                    'size' => $fileSize
                                ];
                                
                                Log::info('Загружен видео файл', [
                                    'index' => $i,
                                    'path' => $path,
                                    'size' => $fileSize,
                                    'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Ошибка загрузки видео файла', [
                                    'index' => $i,
                                    'error' => $e->getMessage()
                                ]);
                                continue;
                            }
                        } elseif ($isImage && $fileSize <= 5 * 1024 * 1024) {
                            // Обрабатываем изображения
                            try {
                                $filename = time() . '_' . $i . '.' . $file->getClientOriginalExtension();
                                $destinationPath = public_path('img/news');
                                if (!is_dir($destinationPath)) {
                                    mkdir($destinationPath, 0755, true);
                                }
                                $file->move($destinationPath, $filename);
                                $path = '/img/news/' . $filename;
                                $mediaPaths[] = [
                                    'path' => $path,
                                    'type' => 'image',
                                    'name' => $file->getClientOriginalName(),
                                    'size' => $fileSize
                                ];
                                
                                Log::info('Загружен файл изображения', [
                                    'index' => $i,
                                    'path' => $path,
                                    'size' => $fileSize,
                                    'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Ошибка загрузки файла изображения', [
                                    'index' => $i,
                                    'error' => $e->getMessage()
                                ]);
                                continue;
                            }
                        } else {
                            Log::warning('Файл пропущен', [
                                'index' => $i,
                                'mime_type' => $mimeType,
                                'size' => $fileSize,
                                'max_size' => $maxSize
                            ]);
                        }
                    }
                }
                
                Log::info('Завершена обработка медиа файлов', ['processed_count' => count($mediaPaths)]);
            }
            
            // Обрабатываем URL медиа
            $inputMedia = $request->input('media');
            if (is_array($inputMedia)) {
                foreach ($inputMedia as $mediaItem) {
                    if (is_string($mediaItem) && !empty($mediaItem)) {
                        // Определяем тип по расширению
                        $extension = pathinfo($mediaItem, PATHINFO_EXTENSION);
                        $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
                        $type = in_array(strtolower($extension), $videoExtensions) ? 'video' : 'image';
                        
                        $mediaPaths[] = [
                            'path' => $mediaItem,
                            'type' => $type,
                            'name' => basename($mediaItem)
                        ];
                    }
                }
            }

            // Создаем новую запись
            Log::info('Начало создания записи в БД');
            
            $news = new News();
            $news->title = $validated['title'];
            $news->slug = $slug;
            $news->content = $validated['content'];
            $news->category = $validated['category'];
            $news->status = $validated['status'];
            $news->publish_date = $validated['publishDate'] ?? null;
            $news->images = $mediaPaths;
            
            $news->save();
            
            Log::info('Новость успешно создана', [
                'id' => $news->id,
                'title' => $news->title,
                'media_count' => count($mediaPaths),
                'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
            ]);

            return redirect()->route('admin.news')->with('success', 'Новость успешно создана');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Ошибка валидации', [
                'errors' => $e->errors(),
                'title' => $request->input('title', 'не указан')
            ]);
            throw $e;
            
        } catch (\Exception $e) {
            Log::error('Критическая ошибка при создании новости', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'title' => $request->input('title', 'не указан'),
                'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
            ]);
            
            return back()->withErrors([
                'error' => 'Произошла ошибка при сохранении новости: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
