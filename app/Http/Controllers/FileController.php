<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Accordion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    /**
     * Получить список клинических протоколов из JSON-файлов
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClinicalProtocols(Request $request)
    {
        Log::info('Запрос к методу getClinicalProtocols');
        
        // Получаем параметры фильтрации
        $searchTerm = $request->input('search', '');
        $medicine = $request->input('medicine', '');
        $mkb = $request->input('mkb', '');
        $year = $request->input('year', '');
        $category = $request->input('category', '');
        $folderPath = $request->input('folder', ''); // Получаем путь к папке
        
        // Определяем тип документа по пути к папке
        $type = '';
        if (strpos($folderPath, 'Клинические протоколы') !== false && strpos($folderPath, 'Архив') === false) {
            $type = 'protocols';
        } elseif (strpos($folderPath, 'Клинические руководства') !== false) {
            $type = 'guidelines';
        } elseif (strpos($folderPath, 'Архив') !== false) {
            $type = 'archive';
        }
        
        // Логируем параметры поиска для отладки
        Log::info('Параметры поиска клинических протоколов:', [
            'searchTerm' => $searchTerm,
            'medicine' => $medicine,
            'mkb' => $mkb,
            'year' => $year,
            'category' => $category,
            'folderPath' => $folderPath,
            'determinedType' => $type
        ]);
        
        $allProtocols = [];
        
        // Загружаем данные в зависимости от определенного типа
        if ($type === 'protocols' || $type === '') {
            // Загружаем клинические протоколы МЗ РК
            $protocolsPath = public_path('data/clinical_protocols.json');
            if (File::exists($protocolsPath)) {
                try {
                    $protocolsContent = File::get($protocolsPath);
                    $protocolsData = json_decode($protocolsContent, true);
                    
                    if (json_last_error() === JSON_ERROR_NONE && isset($protocolsData['protocols'])) {
                        // Добавляем тип к каждому протоколу
                        foreach ($protocolsData['protocols'] as $protocol) {
                            $protocol['type'] = 'protocols';
                            $allProtocols[] = $protocol;
                        }
                        Log::info('Загружено клинических протоколов МЗ РК:', ['count' => count($protocolsData['protocols'])]);
                    }
                } catch (\Exception $e) {
                    Log::error('Ошибка при чтении файла клинических протоколов:', ['error' => $e->getMessage()]);
                }
            }
        }
        
        if ($type === 'guidelines' || $type === '') {
            // Загружаем клинические руководства
            $guidelinesPath = public_path('data/clinical_guidelines.json');
            if (File::exists($guidelinesPath)) {
                try {
                    $guidelinesContent = File::get($guidelinesPath);
                    $guidelinesData = json_decode($guidelinesContent, true);
                    
                    if (json_last_error() === JSON_ERROR_NONE && isset($guidelinesData['guidelines'])) {
                        // Добавляем тип к каждому руководству
                        foreach ($guidelinesData['guidelines'] as $guideline) {
                            $guideline['type'] = 'guidelines';
                            $allProtocols[] = $guideline;
                        }
                        Log::info('Загружено клинических руководств:', ['count' => count($guidelinesData['guidelines'])]);
                    }
                } catch (\Exception $e) {
                    Log::error('Ошибка при чтении файла клинических руководств:', ['error' => $e->getMessage()]);
                }
            }
            
            // Также загружаем международные клинические руководства
            $internationalGuidelinesPath = public_path('data/international_guidelines.json');
            if (File::exists($internationalGuidelinesPath)) {
                try {
                    $internationalGuidelinesContent = File::get($internationalGuidelinesPath);
                    $internationalGuidelinesData = json_decode($internationalGuidelinesContent, true);
                    
                    if (json_last_error() === JSON_ERROR_NONE && isset($internationalGuidelinesData['guidelines'])) {
                        // Добавляем тип к каждому руководству
                        foreach ($internationalGuidelinesData['guidelines'] as $guideline) {
                            $guideline['type'] = 'guidelines';
                            $allProtocols[] = $guideline;
                        }
                        Log::info('Загружено международных клинических руководств:', ['count' => count($internationalGuidelinesData['guidelines'])]);
                    }
                } catch (\Exception $e) {
                    Log::error('Ошибка при чтении файла международных руководств:', ['error' => $e->getMessage()]);
                }
            }
        }
        
        if ($type === 'archive') {
            // Для архива пока возвращаем пустой массив
            // В будущем здесь можно добавить загрузку архивных документов
            Log::info('Запрос архивных документов - пока не реализовано');
        }
        
        Log::info('Всего загружено документов:', ['count' => count($allProtocols)]);
        
        // Фильтруем протоколы
        try {
            $filteredProtocols = array_filter($allProtocols, function($protocol) use ($searchTerm, $medicine, $mkb, $year, $category) {
                // Проверяем наличие необходимых полей
                if (!isset($protocol['name']) || !isset($protocol['description'])) {
                    Log::warning('Протокол без обязательных полей:', ['protocol' => $protocol]);
                    return false;
                }
                
                // Фильтрация по типу документа уже выполнена при загрузке данных
                
                // Фильтрация по поисковому запросу
                if ($searchTerm && stripos($protocol['name'], $searchTerm) === false && 
                    stripos($protocol['description'], $searchTerm) === false) {
                    return false;
                }
                
                // Фильтрация по разделу медицины
                if ($medicine && (!isset($protocol['medicine']) || $protocol['medicine'] !== $medicine)) {
                    return false;
                }
                
                // Фильтрация по категории МКБ
                if ($mkb && (!isset($protocol['mkb']) || stripos($protocol['mkb'], $mkb) === false)) {
                    return false;
                }
                
                // Фильтрация по году
                if ($year && (!isset($protocol['year']) || $protocol['year'] !== $year)) {
                    return false;
                }
                
                // Фильтрация по категории
                if ($category && (!isset($protocol['category']) || $protocol['category'] !== $category)) {
                    return false;
                }
                
                return true;
            });
            
            Log::info('После фильтрации осталось протоколов:', ['count' => count($filteredProtocols)]);
        } catch (\Exception $e) {
            Log::error('Ошибка при фильтрации протоколов:', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Ошибка при фильтрации протоколов: ' . $e->getMessage()
            ], 500);
        }
        
        // Преобразуем результаты в формат, совместимый с getFiles
        try {
            $documents = [];
            foreach ($filteredProtocols as $protocol) {
                // Проверяем наличие обязательных полей
                if (!isset($protocol['name']) || !isset($protocol['url'])) {
                    Log::warning('Пропускаем протокол без обязательных полей:', ['protocol' => $protocol]);
                    continue;
                }
                
                $document = [
                    'name' => $protocol['name'],
                    'description' => $protocol['description'] ?? $protocol['name'],
                    'url' => $protocol['url'],
                    'size' => '1.2 MB', // Примерный размер
                    'date' => isset($protocol['year']) ? date('Y-m-d', strtotime($protocol['year'] . '-01-01')) : date('Y-m-d'),
                    'type' => $protocol['filetype'] ?? 'pdf',
                    'imgType' => $this->getImageTypeForExtension($protocol['filetype'] ?? 'pdf'),
                ];
                
                // Добавляем дополнительные поля, если они есть
                if (isset($protocol['category'])) $document['category'] = $protocol['category'];
                if (isset($protocol['year'])) $document['year'] = $protocol['year'];
                if (isset($protocol['medicine'])) $document['medicine'] = $protocol['medicine'];
                if (isset($protocol['mkb'])) $document['mkb'] = $protocol['mkb'];
                if (isset($protocol['type'])) $document['type'] = $protocol['type'];
                if (isset($protocol['source'])) $document['source'] = $protocol['source'];
                
                $documents[] = $document;
            }
            
            Log::info('Подготовлено документов для ответа:', ['count' => count($documents)]);
            
            $response = [
                'title' => 'Клинические протоколы',
                'documents' => array_values($documents)
            ];
            
            Log::info('Отправляем ответ с клиническими протоколами:', ['document_count' => count($documents)]);
            return response()->json($response);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при подготовке ответа:', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Ошибка при подготовке ответа: ' . $e->getMessage()
            ], 500);
        }
    }

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
        $searchTerm = $request->input('search', '');
        
        // Парсим searchTerm для дополнительных параметров фильтрации
        $category = '';
        $year = '';
        $fileType = '';
        $medicine = ''; // Раздел медицины
        $mkb = ''; // Категория МКБ
        
        // Извлекаем дополнительные параметры из строки поиска
        if (preg_match('/category:(\S+)/', $searchTerm, $matches)) {
            $category = $matches[1];
            $searchTerm = trim(str_replace($matches[0], '', $searchTerm));
        }
        
        if (preg_match('/year:(\S+)/', $searchTerm, $matches)) {
            $year = $matches[1];
            $searchTerm = trim(str_replace($matches[0], '', $searchTerm));
        }
        
        if (preg_match('/type:(\S+)/', $searchTerm, $matches)) {
            $fileType = $matches[1];
            $searchTerm = trim(str_replace($matches[0], '', $searchTerm));
        }
        
        // Новые параметры для клинических протоколов
        if (preg_match('/medicine:(\S+)/', $searchTerm, $matches)) {
            $medicine = $matches[1];
            $searchTerm = trim(str_replace($matches[0], '', $searchTerm));
        }
        
        if (preg_match('/mkb:(\S+)/', $searchTerm, $matches)) {
            $mkb = $matches[1];
            $searchTerm = trim(str_replace($matches[0], '', $searchTerm));
        }
        
        // Логируем параметры поиска для отладки
        Log::info('Параметры поиска файлов:', [
            'folder' => $folderName,
            'searchTerm' => $searchTerm,
            'category' => $category,
            'year' => $year,
            'fileType' => $fileType,
            'medicine' => $medicine,
            'mkb' => $mkb
        ]);
        
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
            
            // Получаем все файлы и подпапки рекурсивно
            $files = [];
            $this->getFilesRecursively($fullPath, $files, $category);
            
            $documents = [];
            
            foreach ($files as $file) {
                $fileName = $file->getFilename();
                $fileExtension = $file->getExtension();
                $fileSize = $file->getSize();
                $lastModified = $file->getMTime();
                $fileYear = date('Y', $lastModified);
                
                // Фильтрация по году
                if ($year && $fileYear != $year) {
                    continue;
                }
                
                // Фильтрация по типу файла
                if ($fileType && strtolower($fileExtension) != strtolower($fileType)) {
                    continue;
                }
                
                // Фильтрация по поисковому запросу
                if ($searchTerm && stripos(pathinfo($fileName, PATHINFO_FILENAME), $searchTerm) === false) {
                    continue;
                }
                
                // Фильтрация по разделу медицины
                if ($medicine) {
                    // Проверяем наличие раздела медицины в имени файла или в пути
                    $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                    $filePath = $file->getPathname();
                    
                    // Проверяем имя файла и путь на совпадение с разделом медицины
                    if (stripos($fileContent, $medicine) === false && stripos($filePath, $medicine) === false) {
                        continue;
                    }
                }
                
                // Фильтрация по категории МКБ
                if ($mkb) {
                    // Проверяем наличие кода МКБ в имени файла или в пути
                    $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                    $filePath = $file->getPathname();
                    
                    // Проверяем имя файла и путь на совпадение с кодом МКБ
                    if (stripos($fileContent, $mkb) === false && stripos($filePath, $mkb) === false) {
                        continue;
                    }
                }
                
                // Относительный путь к файлу для URL
                $relativePath = str_replace(public_path() . DIRECTORY_SEPARATOR, '', $file->getPathname());
                $relativePath = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
                
                // Определяем тип иконки на основе расширения файла
                $imgType = $this->getImageTypeForExtension($fileExtension);
                
                // Получаем категорию из пути файла
                $fileCategory = $this->getCategoryFromPath($file->getPathname(), $fullPath);
                
                // Определяем раздел медицины на основе имени файла и пути
                $medicineSectionName = '';
                $medicineSections = [
                    'cardiology' => 'Кардиология',
                    'gastroenterology' => 'Гастроэнтерология',
                    'neurology' => 'Неврология',
                    'pulmonology' => 'Пульмонология',
                    'endocrinology' => 'Эндокринология',
                    'oncology' => 'Онкология',
                    'pediatrics' => 'Педиатрия',
                    'surgery' => 'Хирургия',
                    'obstetrics' => 'Акушерство и гинекология',
                    'urology' => 'Урология',
                    'ophthalmology' => 'Офтальмология',
                    'otolaryngology' => 'Оториноларингология',
                    'dermatology' => 'Дерматология',
                    'infectious' => 'Инфекционные болезни',
                    'psychiatry' => 'Психиатрия',
                    'rheumatology' => 'Ревматология',
                    'traumatology' => 'Травматология и ортопедия'
                ];
                
                $fileNameLower = strtolower(pathinfo($fileName, PATHINFO_FILENAME));
                $filePathLower = strtolower($file->getPathname());
                
                foreach ($medicineSections as $key => $value) {
                    if (stripos($fileNameLower, $key) !== false || stripos($filePathLower, $key) !== false ||
                        stripos($fileNameLower, $value) !== false || stripos($filePathLower, $value) !== false) {
                        $medicineSectionName = $key;
                        break;
                    }
                }
                
                // Определяем категорию МКБ на основе имени файла и пути
                $mkbCategory = '';
                $mkbPatterns = [
                    'A\d+' => 'A00-B99',
                    'B\d+' => 'A00-B99',
                    'C\d+' => 'C00-D48',
                    'D[0-4]\d' => 'C00-D48',
                    'D[5-8]\d' => 'D50-D89',
                    'E\d+' => 'E00-E90',
                    'F\d+' => 'F00-F99',
                    'G\d+' => 'G00-G99',
                    'H[0-5]\d' => 'H00-H59',
                    'H[6-9]\d' => 'H60-H95',
                    'I\d+' => 'I00-I99',
                    'J\d+' => 'J00-J99',
                    'K\d+' => 'K00-K93',
                    'L\d+' => 'L00-L99',
                    'M\d+' => 'M00-M99',
                    'N\d+' => 'N00-N99',
                    'O\d+' => 'O00-O99',
                    'P\d+' => 'P00-P96',
                    'Q\d+' => 'Q00-Q99',
                    'R\d+' => 'R00-R99',
                    'S\d+' => 'S00-T98',
                    'T\d+' => 'S00-T98',
                    'V\d+' => 'V01-Y98',
                    'W\d+' => 'V01-Y98',
                    'X\d+' => 'V01-Y98',
                    'Y\d+' => 'V01-Y98',
                    'Z\d+' => 'Z00-Z99'
                ];
                
                foreach ($mkbPatterns as $pattern => $category) {
                    if (preg_match('/' . $pattern . '/', $fileNameLower) || preg_match('/' . $pattern . '/', $filePathLower)) {
                        $mkbCategory = $category;
                        break;
                    }
                }
                
                $documents[] = [
                    'description' => pathinfo($fileName, PATHINFO_FILENAME),
                    'filetype' => strtolower($fileExtension),
                    'img' => $imgType,
                    'filesize' => $this->formatFileSize($fileSize),
                    'date' => date('d.m.Y', $lastModified),
                    'url' => asset($relativePath),
                    'category' => $fileCategory,
                    'year' => $fileYear,
                    'medicine' => $medicineSectionName,  // Добавляем раздел медицины
                    'mkb' => $mkbCategory  // Добавляем категорию МКБ
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
    private function formatSectionName($path)
    {
        // Получаем последний компонент пути (имя папки)
        $parts = explode(DIRECTORY_SEPARATOR, $path);
        $lastPart = end($parts);
        
        // Форматируем имя раздела, заменяя подчеркивания на пробелы и делая первую букву заглавной
        return ucfirst(str_replace('_', ' ', $lastPart));
    }
    
    /**
     * Рекурсивно получает все файлы из указанной директории и её поддиректорий
     * 
     * @param string $directory Путь к директории
     * @param array &$files Массив для хранения найденных файлов
     * @param string $categoryFilter Фильтр по категории (поддиректории)
     * @return void
     */
    private function getFilesRecursively($directory, &$files, $categoryFilter = '')
    {
        // Получаем все файлы в текущей директории
        $directoryFiles = File::files($directory);
        foreach ($directoryFiles as $file) {
            $files[] = $file;
        }
        
        // Получаем все поддиректории
        $subdirectories = File::directories($directory);
        foreach ($subdirectories as $subdirectory) {
            // Получаем имя поддиректории для проверки категории
            $dirName = basename($subdirectory);
            
            // Если задан фильтр категории и текущая поддиректория не соответствует ему, пропускаем
            if ($categoryFilter && strtolower($dirName) !== strtolower($categoryFilter)) {
                continue;
            }
            
            // Рекурсивно обрабатываем поддиректорию
            $this->getFilesRecursively($subdirectory, $files, $categoryFilter);
        }
    }
    
    /**
     * Определяет категорию файла на основе его пути
     * 
     * @param string $filePath Полный путь к файлу
     * @param string $basePath Базовый путь (корневая директория)
     * @return string Категория файла
     */
    private function getCategoryFromPath($filePath, $basePath)
    {
        // Получаем относительный путь от базовой директории
        $relativePath = str_replace($basePath . DIRECTORY_SEPARATOR, '', dirname($filePath));
        
        // Если файл находится в корневой директории, возвращаем 'Общие'
        if (empty($relativePath)) {
            return 'Общие';
        }
        
        // Получаем первый компонент пути как категорию
        $parts = explode(DIRECTORY_SEPARATOR, $relativePath);
        return $parts[0];
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
