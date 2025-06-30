<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;

class TranslationManagementController extends Controller
{
    /**
     * Получить список файлов локализации
     */
    public function getFiles()
    {
        try {
            $files = File::files(resource_path('lang/ru'));
            $fileNames = [];
            
            foreach ($files as $file) {
                if ($file->getExtension() === 'php') {
                    $fileNames[] = $file->getFilename();
                }
            }
            
            return response()->json([
                'success' => true,
                'files' => $fileNames,
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting translation files: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Не удалось получить список файлов локализации',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Получить переводы для указанного файла
     */
    public function getTranslations($file)
    {
        try {
            $languages = ['ru', 'kz', 'en'];
            $translations = [];
            
            foreach ($languages as $lang) {
                $path = resource_path("lang/{$lang}/{$file}");
                
                if (File::exists($path)) {
                    $translations[$lang] = include $path;
                } else {
                    $translations[$lang] = [];
                }
            }
            
            return response()->json([
                'success' => true,
                'translations' => $translations,
            ]);
        } catch (\Exception $e) {
            Log::error("Error getting translations for file {$file}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Не удалось получить переводы',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Сохранить переводы
     */
    public function saveTranslations(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|string',
                'translations' => 'required|array',
            ]);
            
            $file = $request->file;
            $translations = $request->translations;
            
            foreach ($translations as $lang => $trans) {
                $path = resource_path("lang/{$lang}/{$file}");
                $dir = resource_path("lang/{$lang}");
                
                if (!File::isDirectory($dir)) {
                    File::makeDirectory($dir, 0755, true);
                }
                
                $content = "<?php\n\nreturn " . var_export($trans, true) . ";\n";
                File::put($path, $content);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Переводы успешно сохранены',
            ]);
        } catch (\Exception $e) {
            Log::error("Error saving translations: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Не удалось сохранить переводы',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Обновить переводы с помощью Google Translate
     */
    public function refreshTranslations(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|string',
                'source' => 'required|string|in:ru,kz,en',
            ]);
            
            // Запускаем artisan команду для автоматического перевода
            $exitCode = Artisan::call('translate:generate', [
                '--file' => $request->file,
                '--source' => $request->source,
                '--force' => true,
            ]);
            
            if ($exitCode === 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'Переводы успешно обновлены',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Ошибка при обновлении переводов',
                    'details' => Artisan::output(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Error refreshing translations: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Не удалось обновить переводы',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
