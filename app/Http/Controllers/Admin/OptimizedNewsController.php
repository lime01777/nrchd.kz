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
            $imagePaths = [];
            
            // Обрабатываем файлы изображений
            if ($request->hasFile('image_files')) {
                $files = $request->file('image_files');
                $maxFiles = min(count($files), 5); // Ограничиваем до 5 файлов
                
                Log::info('Начало обработки файлов', ['total_files' => count($files), 'max_files' => $maxFiles]);
                
                for ($i = 0; $i < $maxFiles; $i++) {
                    $img = $files[$i];
                    
                    if ($img && $img->isValid() && $img->getSize() <= 5 * 1024 * 1024) { // Максимум 5MB
                        try {
                            // Генерируем уникальное имя файла
                            $filename = time() . '_' . $i . '.' . $img->getClientOriginalExtension();
                            
                            // Сохраняем файл напрямую для ускорения
                            $img->move(storage_path('app/public/news'), $filename);
                            $path = '/storage/news/' . $filename;
                            $imagePaths[] = $path;
                            
                            Log::info('Загружен файл изображения', [
                                'index' => $i,
                                'path' => $path, 
                                'size' => $img->getSize(),
                                'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
                            ]);
                        } catch (\Exception $e) {
                            Log::error('Ошибка загрузки файла', [
                                'index' => $i,
                                'error' => $e->getMessage()
                            ]);
                            continue;
                        }
                    }
                }
                
                Log::info('Завершена обработка файлов', ['processed_count' => count($imagePaths)]);
            }
            
            // Обрабатываем URL изображений
            $inputImages = $request->input('images');
            if (is_array($inputImages)) {
                foreach ($inputImages as $img) {
                    if (is_string($img) && !empty($img) && !in_array($img, $imagePaths)) {
                        $imagePaths[] = $img;
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
            $news->images = $imagePaths;
            
            $news->save();
            
            Log::info('Новость успешно создана', [
                'id' => $news->id,
                'title' => $news->title,
                'images_count' => count($imagePaths),
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
