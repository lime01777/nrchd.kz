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
    
    /**
     * Получить документы для компонента TabDocuments
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTabDocuments(Request $request)
    {
        $baseDirectory = public_path('storage/documents');
        $folderName = $request->input('folder', '');
        
        // Нормализуем путь, заменяя прямые слеши на системные разделители
        if ($folderName) {
            $folderPath = str_replace('/', DIRECTORY_SEPARATOR, $folderName);
            $fullPath = $baseDirectory . DIRECTORY_SEPARATOR . $folderPath;
            
            // Проверяем существование папки
            if (!File::isDirectory($fullPath)) {
                return response()->json([
                    'error' => 'Указанная папка не существует: ' . $folderName
                ], 404);
            }
            
            // Получаем все подпапки в указанной директории (категории документов)
            $categories = File::directories($fullPath);
            
            // Если подпапок нет, пробуем использовать текущую папку как единственную категорию
            if (empty($categories)) {
                return $this->processSingleCategoryDocuments($fullPath, basename($fullPath));
            }
            
            // Иначе обрабатываем все категории
            return $this->processMultipleCategoryDocuments($categories);
        }
        
        // Если папка не указана, возвращаем пустой массив
        return response()->json([]);
    }
    
    /**
     * Обработка документов из одной категории
     *
     * @param string $categoryPath
     * @param string $categoryName
     * @return \Illuminate\Http\JsonResponse
     */
    private function processSingleCategoryDocuments($categoryPath, $categoryName)
    {
        // Получаем годовые папки или файлы непосредственно
        $yearDirs = File::directories($categoryPath);
        
        if (empty($yearDirs)) {
            // Если годовых папок нет, используем файлы из текущей папки
            $files = File::files($categoryPath);
            
            if (empty($files)) {
                return response()->json([
                    [
                        'title' => $this->formatSectionName($categoryName),
                        'years' => []
                    ]
                ]);
            }
            
            // Группируем файлы по году их создания
            $documentsByYear = $this->groupFilesByYear($files, dirname($categoryPath), basename($categoryPath));
            
            return response()->json([
                [
                    'title' => $this->formatSectionName($categoryName),
                    'years' => $documentsByYear
                ]
            ]);
        }
        
        // Если есть годовые папки, обрабатываем их
        $yearDocuments = [];
        
        foreach ($yearDirs as $yearDir) {
            $yearName = basename($yearDir);
            $files = File::files($yearDir);
            
            if (!empty($files)) {
                $documents = $this->processFiles($files, str_replace(public_path('storage/documents'), '', dirname($yearDir)), $yearName);
                
                if (!empty($documents)) {
                    $yearDocuments[] = [
                        'year' => $yearName,
                        'documents' => $documents
                    ];
                }
            }
        }
        
        return response()->json([
            [
                'title' => $this->formatSectionName($categoryName),
                'years' => $yearDocuments
            ]
        ]);
    }
    
    /**
     * Обработка документов из нескольких категорий
     *
     * @param array $categories
     * @return \Illuminate\Http\JsonResponse
     */
    private function processMultipleCategoryDocuments($categories)
    {
        $tabs = [];
        
        foreach ($categories as $categoryDir) {
            $categoryName = basename($categoryDir);
            
            // Получаем годовые папки
            $yearDirs = File::directories($categoryDir);
            $yearDocuments = [];
            
            if (empty($yearDirs)) {
                // Если годовых папок нет, используем файлы из текущей папки категории
                $files = File::files($categoryDir);
                
                if (!empty($files)) {
                    // Группируем файлы по году их создания
                    $yearDocuments = $this->groupFilesByYear($files, dirname($categoryDir), $categoryName);
                }
            } else {
                // Иначе обрабатываем годовые папки
                foreach ($yearDirs as $yearDir) {
                    $yearName = basename($yearDir);
                    $files = File::files($yearDir);
                    
                    if (!empty($files)) {
                        $documents = $this->processFiles($files, str_replace(public_path('storage/documents'), '', dirname($yearDir)), $yearName);
                        
                        if (!empty($documents)) {
                            $yearDocuments[] = [
                                'year' => $yearName,
                                'documents' => $documents
                            ];
                        }
                    }
                }
            }
            
            // Добавляем категорию только если в ней есть документы
            if (!empty($yearDocuments)) {
                $tabs[] = [
                    'title' => $this->formatSectionName($categoryName),
                    'years' => $yearDocuments
                ];
            }
        }
        
        return response()->json($tabs);
    }
    
    /**
     * Группировка файлов по году их создания
     *
     * @param array $files
     * @param string $basePath
     * @param string $categoryName
     * @return array
     */
    private function groupFilesByYear($files, $basePath, $categoryName)
    {
        $documentsByYear = [];
        $filesByYear = [];
        
        foreach ($files as $file) {
            $lastModified = $file->getMTime();
            $year = date('Y', $lastModified);
            
            if (!isset($filesByYear[$year])) {
                $filesByYear[$year] = [];
            }
            
            $filesByYear[$year][] = $file;
        }
        
        // Сортируем годы в обратном порядке (новые сначала)
        krsort($filesByYear);
        
        foreach ($filesByYear as $year => $yearFiles) {
            $documents = $this->processFiles($yearFiles, $basePath, $categoryName);
            
            if (!empty($documents)) {
                $documentsByYear[] = [
                    'year' => $year . ' год',
                    'documents' => $documents
                ];
            }
        }
        
        return $documentsByYear;
    }
    
    /**
     * Обработка файлов для создания массива документов
     *
     * @param array $files
     * @param string $basePath
     * @param string $categoryName
     * @return array
     */
    private function processFiles($files, $basePath, $categoryName)
    {
        $documents = [];
        
        foreach ($files as $file) {
            $fileName = $file->getFilename();
            $fileExtension = $file->getExtension();
            $fileSize = $file->getSize();
            $lastModified = $file->getMTime();
            
            // Относительный путь к файлу для URL (всегда используем прямые слеши для URL)
            $relativePath = 'storage/documents/' . str_replace('\\', '/', $basePath) . '/' . $categoryName . '/' . $fileName;
            
            $documents[] = [
                'title' => pathinfo($fileName, PATHINFO_FILENAME),
                'fileType' => strtolower($fileExtension),
                'fileSize' => $this->formatFileSize($fileSize),
                'date' => date('d.m.Y', $lastModified),
                'url' => asset($relativePath)
            ];
        }
        
        return $documents;
    }
}
