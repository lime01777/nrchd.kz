<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    /**
     * Получить список файлов из папки storage
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFiles(Request $request)
    {
        $baseDirectory = public_path('storage/documents');
        $folderName = $request->input('folder', '');
        $title = $request->input('title', '');
        
        // Если указана конкретная папка
        if ($folderName) {
            // Нормализуем путь, заменяя прямые слеши на системные разделители
            $folderPath = str_replace('/', DIRECTORY_SEPARATOR, $folderName);
            $fullPath = $baseDirectory . DIRECTORY_SEPARATOR . $folderPath;
            
            // Проверяем существование папки
            if (!File::isDirectory($fullPath)) {
                return response()->json([
                    'error' => 'Указанная папка не существует: ' . $folderName
                ], 404);
            }
            
            $files = File::files($fullPath);
            $documents = [];
            
            foreach ($files as $file) {
                $fileName = $file->getFilename();
                $fileExtension = $file->getExtension();
                $fileSize = $file->getSize();
                $lastModified = $file->getMTime();
                
                // Относительный путь к файлу для URL (всегда используем прямые слеши для URL)
                $relativePath = 'storage/documents/' . str_replace(DIRECTORY_SEPARATOR, '/', $folderPath) . '/' . $fileName;
                
                // Определяем тип иконки на основе расширения файла
                $imgType = $this->getImageTypeForExtension($fileExtension);
                
                $documents[] = [
                    'description' => pathinfo($fileName, PATHINFO_FILENAME),
                    'filetype' => strtolower($fileExtension),
                    'img' => $imgType,
                    'filesize' => $this->formatFileSize($fileSize),
                    'date' => date('d.m.Y', $lastModified),
                    'url' => asset($relativePath)
                ];
            }
            
            // Возвращаем один раздел с указанным заголовком и документами
            return response()->json([
                [
                    'title' => $title ?: $this->formatSectionName($folderPath),
                    'documents' => $documents
                ]
            ]);
        }
        
        // Если папка не указана, возвращаем все разделы
        $sections = [];
        $directories = File::directories($baseDirectory);
        
        foreach ($directories as $dir) {
            $sectionName = basename($dir);
            $files = File::files($dir);
            $documents = [];
            
            foreach ($files as $file) {
                $fileName = $file->getFilename();
                $fileExtension = $file->getExtension();
                $fileSize = $file->getSize();
                $lastModified = $file->getMTime();
                
                // Относительный путь к файлу для URL (всегда используем прямые слеши для URL)
                $relativePath = 'storage/documents/' . str_replace(DIRECTORY_SEPARATOR, '/', $sectionName) . '/' . $fileName;
                
                // Определяем тип иконки на основе расширения файла
                $imgType = $this->getImageTypeForExtension($fileExtension);
                
                $documents[] = [
                    'description' => pathinfo($fileName, PATHINFO_FILENAME),
                    'filetype' => strtolower($fileExtension),
                    'img' => $imgType,
                    'filesize' => $this->formatFileSize($fileSize),
                    'date' => date('d.m.Y', $lastModified),
                    'url' => asset($relativePath)
                ];
            }
            
            if (!empty($documents)) {
                $sections[] = [
                    'title' => $this->formatSectionName($sectionName),
                    'documents' => $documents
                ];
            }
        }
        
        return response()->json($sections);
    }
    
    /**
     * Форматирование размера файла
     *
     * @param int $bytes
     * @return string
     */
    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 1) . ' ' . $units[$pow];
    }
    
    /**
     * Получить тип изображения для расширения файла
     *
     * @param string $extension
     * @return int
     */
    private function getImageTypeForExtension($extension)
    {
        $extension = strtolower($extension);
        
        // Типы файлов и соответствующие им изображения
        $imageTypes = [
            'pdf' => 2,
            'doc' => 1,
            'docx' => 1,
            'xls' => 3,
            'xlsx' => 3,
            'ppt' => 4,
            'pptx' => 4,
            'jpg' => 5,
            'jpeg' => 5,
            'png' => 5,
            'gif' => 5,
            'zip' => 6,
            'rar' => 6,
            'txt' => 7
        ];
        
        return $imageTypes[$extension] ?? 2; // По умолчанию используем тип 2 (PDF)
    }
    
    /**
     * Форматирует имя раздела из имени папки
     */
    private function formatSectionName($folderName)
    {
        // Заменяем подчеркивания и дефисы на пробелы
        $name = str_replace(['_', '-'], ' ', $folderName);
        // Преобразуем первую букву каждого слова в верхний регистр
        return ucwords($name);
    }
    
    /**
     * Получить аккордеоны для указанной страницы
     */
    public function getAccordionsForPage(Request $request)
    {
        $pageRoute = $request->input('page_route');
        
        Log::info('Запрос аккордеонов для страницы: ' . $pageRoute);
        
        if (!$pageRoute) {
            Log::warning('Не указан маршрут страницы в запросе');
            return response()->json([
                'error' => 'Не указан маршрут страницы'
            ], 400);
        }
        
        // Получаем аккордеоны для указанной страницы
        $accordions = \App\Models\DocumentAccordion::where(function($query) use ($pageRoute) {
            $query->where('page_route', $pageRoute)
                  ->orWhere('page_route', 'LIKE', "%$pageRoute%");
        })
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();
        
        Log::info('Найдено аккордеонов: ' . $accordions->count());
        
        if ($accordions->isEmpty()) {
            Log::warning('Аккордеоны не найдены для страницы: ' . $pageRoute);
            return response()->json([]);
        }
        
        return response()->json($accordions);
    }
}
