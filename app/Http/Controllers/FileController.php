<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Accordion;
use App\Models\ClinicalMedicineCategory;
use App\Models\ClinicalProtocolMetadata;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use ZipArchive;

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
        
        // Логируем параметры поиска для отладки
        Log::info('Параметры поиска клинических протоколов:', [
            'searchTerm' => $searchTerm,
            'medicine' => $medicine,
            'mkb' => $mkb,
            'year' => $year,
            'category' => $category,
            'folderPath' => $folderPath,
            'allRequestInputs' => $request->all()
        ]);
        
        // Используем тот же подход, что и в getFiles - сканируем файловую систему
        $baseDirectory = public_path('storage/documents');
        
        // Если указана конкретная папка
        if ($folderPath) {
            // Декодируем URL-кодированный путь (на случай, если он пришел закодированным)
            $decodedPath = urldecode($folderPath);
            
            // Нормализуем путь, заменяя прямые слеши на системные разделители
            $normalizedPath = str_replace('/', DIRECTORY_SEPARATOR, $decodedPath);
            $fullPath = $baseDirectory . DIRECTORY_SEPARATOR . $normalizedPath;
            
            // Логируем информацию о пути для отладки
            Log::info('Проверка существования папки:', [
                'originalFolderPath' => $folderPath,
                'decodedPath' => $decodedPath,
                'normalizedPath' => $normalizedPath,
                'baseDirectory' => $baseDirectory,
                'fullPath' => $fullPath,
                'baseDirectoryExists' => File::isDirectory($baseDirectory),
                'fullPathExists' => File::exists($fullPath),
                'fullPathIsDirectory' => File::isDirectory($fullPath)
            ]);
            
            // Проверяем существование базовой директории
            if (!File::isDirectory($baseDirectory)) {
                Log::error('Базовая директория не существует', ['path' => $baseDirectory]);
                return response()->json([
                    'error' => 'Базовая директория не найдена: ' . $baseDirectory
                ], 500);
            }
            
            // Проверяем существование папки
            if (!File::isDirectory($fullPath)) {
                // Пытаемся найти альтернативные варианты пути
                $foundAlternativePath = null;
                
                // Вариант 1: без декодирования (на случай двойного кодирования)
                $altPath1 = $baseDirectory . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $folderPath);
                if (File::isDirectory($altPath1)) {
                    $foundAlternativePath = $altPath1;
                    Log::info('Найден альтернативный путь (без декодирования)', ['path' => $altPath1]);
                }
                
                // Вариант 2: проверяем содержимое базовой директории на похожие имена
                if (!$foundAlternativePath && File::isDirectory($baseDirectory)) {
                    $baseContents = array_filter(scandir($baseDirectory), function($item) {
                        return $item !== '.' && $item !== '..';
                    });
                    
                    // Ищем первую часть пути в содержимом
                    $pathParts = explode('/', $decodedPath);
                    $firstPart = $pathParts[0] ?? '';
                    
                    foreach ($baseContents as $item) {
                        // Проверяем точное совпадение или совпадение без учета регистра
                        if (strcasecmp($item, $firstPart) === 0 || 
                            mb_strtolower($item) === mb_strtolower($firstPart)) {
                            $testPath = $baseDirectory . DIRECTORY_SEPARATOR . $item;
                            if (count($pathParts) > 1) {
                                // Если есть вложенные папки, проверяем их
                                $remainingPath = implode(DIRECTORY_SEPARATOR, array_slice($pathParts, 1));
                                $testPath .= DIRECTORY_SEPARATOR . $remainingPath;
                            }
                            
                            if (File::isDirectory($testPath)) {
                                $foundAlternativePath = $testPath;
                                Log::info('Найден альтернативный путь (поиск по содержимому)', [
                                    'original' => $fullPath,
                                    'found' => $testPath
                                ]);
                                break;
                            }
                        }
                    }
                }
                
                // Если нашли альтернативный путь, используем его
                if ($foundAlternativePath) {
                    $fullPath = $foundAlternativePath;
                    Log::info('Используется альтернативный путь', ['path' => $fullPath]);
                } else {
                    // Вариант 3: проверяем, может быть это файл, а не папка
                    if (File::exists($fullPath) && !File::isDirectory($fullPath)) {
                        Log::warning('Указанный путь существует, но это файл, а не папка', ['path' => $fullPath]);
                    }
                    
                    // Логируем ошибку с детальной информацией
                    Log::error('Указанная папка не существует', [
                        'requestedPath' => $folderPath,
                        'decodedPath' => $decodedPath,
                        'fullPath' => $fullPath,
                        'baseDirectory' => $baseDirectory,
                        'baseDirectoryContents' => File::exists($baseDirectory) ? array_slice(scandir($baseDirectory), 2) : []
                    ]);
                    
                    return response()->json([
                        'error' => 'Указанная папка не существует: ' . $folderPath,
                        'details' => [
                            'requested_path' => $folderPath,
                            'decoded_path' => $decodedPath,
                            'full_path' => $fullPath,
                            'base_directory' => $baseDirectory,
                            'base_directory_exists' => File::isDirectory($baseDirectory)
                        ]
                    ], 404);
                }
            }
            
            $files = [];
            $this->getFilesRecursively($fullPath, $files, $category);

            $absoluteToRelativePath = [];
            foreach ($files as $file) {
                $absoluteToRelativePath[$file->getPathname()] = $this->getRelativeStoragePath($file->getPathname());
            }

            $metadataCollection = $this->getMetadataCollection(array_values($absoluteToRelativePath));
            $categoriesMap = $this->getMedicineCategoriesMap($metadataCollection);

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
                
                if ($searchTerm && !$this->containsCaseInsensitive(pathinfo($fileName, PATHINFO_FILENAME), $searchTerm)) {
                    continue;
                }

                $relativeStoragePath = $absoluteToRelativePath[$file->getPathname()] ?? $this->getRelativeStoragePath($file->getPathname());
            $metadata = $this->findMetadataByPath($metadataCollection, $relativeStoragePath);
                $metadataMedicine = $metadata
                    ? array_values(array_filter(array_map(fn ($id) => $categoriesMap[$id] ?? null, $metadata->medicine_category_ids ?? [])))
                    : [];
                $metadataMkb = $metadata->mkb_codes ?? [];
                
                // Определяем категории МКБ и медицины из имени файла и пути ДО фильтрации
                $fileNameLower = strtolower(pathinfo($fileName, PATHINFO_FILENAME));
                $filePathLower = strtolower($file->getPathname());
                
                // Определяем раздел медицины из имени файла/пути
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
                
                foreach ($medicineSections as $key => $value) {
                    if (stripos($fileNameLower, $key) !== false || 
                        stripos($fileNameLower, $value) !== false ||
                        stripos($filePathLower, $key) !== false ||
                        stripos($filePathLower, $value) !== false) {
                        $medicineSectionName = $value;
                        break;
                    }
                }
                
                // Определяем категорию МКБ из имени файла/пути
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

                foreach ($mkbPatterns as $pattern => $categoryCode) {
                    if (preg_match('/' . $pattern . '/', $fileNameLower) || preg_match('/' . $pattern . '/', $filePathLower)) {
                        $mkbCategory = $categoryCode;
                        break;
                    }
                }

                // Фильтрация по разделу медицины
                if ($medicine) {
                    $matchesMetadata = $this->arrayContainsInsensitive($metadataMedicine, $medicine);
                    $matchesSection = $this->containsCaseInsensitive($medicineSectionName, $medicine);
                    if (!$matchesMetadata && !$matchesSection) {
                        $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                        $filePath = $file->getPathname();
                        if (
                            !$this->containsCaseInsensitive($fileContent, $medicine) &&
                            !$this->containsCaseInsensitive($filePath, $medicine)
                        ) {
                            continue;
                        }
                    }
                }
                
                // Фильтрация по МКБ - проверяем метаданные, автоматически определенную категорию и имя файла/путь
                if ($mkb) {
                    // Проверяем метаданные
                    $matchesMetadata = $this->arrayContainsInsensitive($metadataMkb, $mkb);
                    // Проверяем автоматически определенную категорию МКБ
                    $matchesCategory = $mkbCategory && (
                        $this->containsCaseInsensitive($mkbCategory, $mkb) || 
                        $this->containsCaseInsensitive($mkb, $mkbCategory)
                    );
                    
                    // Логируем для отладки (только для первых нескольких файлов)
                    if (count($documents) < 3) {
                        Log::debug('Фильтрация по МКБ', [
                            'fileName' => $fileName,
                            'requestedMkb' => $mkb,
                            'metadataMkb' => $metadataMkb,
                            'mkbCategory' => $mkbCategory,
                            'matchesMetadata' => $matchesMetadata,
                            'matchesCategory' => $matchesCategory
                        ]);
                    }
                    
                    if (!$matchesMetadata && !$matchesCategory) {
                        // Если не совпало в метаданных и категории, проверяем имя файла и путь
                        $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                        $filePath = $file->getPathname();
                        
                        $matchesFileName = $this->containsCaseInsensitive($fileContent, $mkb);
                        $matchesFilePath = $this->containsCaseInsensitive($filePath, $mkb);
                        
                        if (!$matchesFileName && !$matchesFilePath) {
                            continue;
                        }
                    }
                }
                
                $imgType = $this->getImageTypeForExtension($fileExtension);
                
                $fileCategory = $this->getCategoryFromPath($file->getPathname(), $fullPath);

                $primaryMedicine = $metadataMedicine[0] ?? $medicineSectionName;
                $primaryMkb = $metadataMkb[0] ?? '';

                $documents[] = [
                    'name' => pathinfo($fileName, PATHINFO_FILENAME),
                    'url' => asset('storage/' . $relativeStoragePath),
                    'size' => $fileSize,
                    'extension' => $fileExtension,
                    'imgType' => $imgType,
                    'category' => $fileCategory,
                    'year' => $fileYear,
                    'medicine' => $primaryMedicine,
                    'medicine_categories' => $metadataMedicine,
                    'mkb' => $primaryMkb ?: $mkbCategory,
                    'mkb_codes' => $metadataMkb,
                    'modified' => date('Y-m-d H:i:s', $lastModified),
                    'type' => $this->getDocumentTypeFromPath($folderPath)
                ];
            }
            
            // Сортируем по названию
            usort($documents, function($a, $b) {
                return strcmp($a['name'], $b['name']);
            });
            
            Log::info('Возвращаем файлы из файловой системы:', ['count' => count($documents)]);
            
            return response()->json([
                'documents' => $documents,
                'total' => count($documents)
            ]);
        }
        
        return response()->json([
            'error' => 'Не указан путь к папке'
        ], 400);
    }

    public function getClinicalProtocolFilters()
    {
        $medicineCategories = $this->fetchMedicineCategories();
        if (empty($medicineCategories)) {
            $medicineCategories = $this->getDefaultMedicineCategories();
        }
        
        $mkbCategories = config('clinical_protocols.mkb_categories', []);
        
        return response()->json([
            'medicine_categories' => $medicineCategories,
            'mkb_categories' => $mkbCategories,
        ]);
    }

    /**
     * Скачать все клинические протоколы архивом
     * Использует ту же логику фильтрации, что и getClinicalProtocols
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function downloadClinicalProtocolsArchive(Request $request)
    {
        try {
            // Получаем параметры фильтрации (те же, что и в getClinicalProtocols)
            $searchTerm = $request->input('search', '');
            $medicine = $request->input('medicine', '');
            $mkb = $request->input('mkb', '');
            $year = $request->input('year', '');
            $category = $request->input('category', '');
            $folderPath = $request->input('folder', '');
            
            // Получаем список файлов с учетом фильтров, используя ту же логику, что и getClinicalProtocols
            $baseDirectory = public_path('storage/documents');
            
            if (!$folderPath) {
                return response()->json(['error' => 'Не указан путь к папке'], 400);
            }
            
            // Используем ту же логику определения пути, что и в getClinicalProtocols
            $decodedPath = urldecode($folderPath);
            $normalizedPath = str_replace('/', DIRECTORY_SEPARATOR, $decodedPath);
            $fullPath = $baseDirectory . DIRECTORY_SEPARATOR . $normalizedPath;
            
            // Проверяем существование папки
            if (!File::isDirectory($fullPath)) {
                // Пытаемся найти альтернативные варианты пути (как в getClinicalProtocols)
                $altPath1 = $baseDirectory . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $folderPath);
                if (File::isDirectory($altPath1)) {
                    $fullPath = $altPath1;
                } else {
                    return response()->json(['error' => 'Папка не найдена'], 404);
                }
            }
            
            // Получаем список файлов рекурсивно (как в getClinicalProtocols)
            $files = [];
            $this->getFilesRecursively($fullPath, $files, $category);
            
            // Получаем метаданные для фильтрации
            $absoluteToRelativePath = [];
            foreach ($files as $file) {
                $absoluteToRelativePath[$file->getPathname()] = $this->getRelativeStoragePath($file->getPathname());
            }
            
            $metadataCollection = $this->getMetadataCollection(array_values($absoluteToRelativePath));
            
            // Фильтруем файлы с применением той же логики, что и в getClinicalProtocols
            $documentsToArchive = [];
            
            foreach ($files as $file) {
                $fileName = $file->getFilename();
                $fileExtension = strtolower($file->getExtension());
                
                // Пропускаем не-PDF файлы
                if ($fileExtension !== 'pdf') {
                    continue;
                }
                
                $relativeStoragePath = $absoluteToRelativePath[$file->getPathname()];
                $metadata = $metadataCollection->get($relativeStoragePath);
                
                $metadataMedicine = $metadata ? ($metadata->medicine_categories ?? []) : [];
                $metadataMkb = $metadata ? ($metadata->mkb_codes ?? []) : [];
                
                $fileNameLower = mb_strtolower($fileName);
                $filePathLower = mb_strtolower($file->getPathname());
                
                // Определяем раздел медицины из имени файла/пути (как в getClinicalProtocols)
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
                
                foreach ($medicineSections as $key => $value) {
                    if (stripos($fileNameLower, $key) !== false || 
                        stripos($fileNameLower, $value) !== false ||
                        stripos($filePathLower, $key) !== false ||
                        stripos($filePathLower, $value) !== false) {
                        $medicineSectionName = $value;
                        break;
                    }
                }
                
                // Определяем категорию МКБ (как в getClinicalProtocols)
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
                
                foreach ($mkbPatterns as $pattern => $categoryCode) {
                    if (preg_match('/' . $pattern . '/', $fileNameLower) || preg_match('/' . $pattern . '/', $filePathLower)) {
                        $mkbCategory = $categoryCode;
                        break;
                    }
                }
                
                // Фильтрация по разделу медицины (как в getClinicalProtocols)
                if ($medicine) {
                    $matchesMetadata = $this->arrayContainsInsensitive($metadataMedicine, $medicine);
                    $matchesSection = $this->containsCaseInsensitive($medicineSectionName, $medicine);
                    if (!$matchesMetadata && !$matchesSection) {
                        $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                        $filePath = $file->getPathname();
                        if (
                            !$this->containsCaseInsensitive($fileContent, $medicine) &&
                            !$this->containsCaseInsensitive($filePath, $medicine)
                        ) {
                            continue;
                        }
                    }
                }
                
                // Фильтрация по МКБ (как в getClinicalProtocols)
                if ($mkb) {
                    $matchesMetadata = $this->arrayContainsInsensitive($metadataMkb, $mkb);
                    $matchesCategory = $mkbCategory && (
                        $this->containsCaseInsensitive($mkbCategory, $mkb) || 
                        $this->containsCaseInsensitive($mkb, $mkbCategory)
                    );
                    
                    if (!$matchesMetadata && !$matchesCategory) {
                        $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                        $filePath = $file->getPathname();
                        
                        $matchesFileName = $this->containsCaseInsensitive($fileContent, $mkb);
                        $matchesFilePath = $this->containsCaseInsensitive($filePath, $mkb);
                        
                        if (!$matchesFileName && !$matchesFilePath) {
                            continue;
                        }
                    }
                }
                
                // Фильтрация по поисковому запросу
                if ($searchTerm) {
                    $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                    $filePath = $file->getPathname();
                    if (
                        !$this->containsCaseInsensitive($fileContent, $searchTerm) &&
                        !$this->containsCaseInsensitive($filePath, $searchTerm)
                    ) {
                        continue;
                    }
                }
                
                // Фильтрация по году
                if ($year) {
                    $fileYear = date('Y', $file->getMTime());
                    if ($fileYear !== $year) {
                        $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                        if (stripos($fileContent, $year) === false) {
                            continue;
                        }
                    }
                }
                
                // Добавляем файл в список для архива
                $relativePath = str_replace($fullPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
                $documentsToArchive[] = [
                    'path' => $file->getPathname(),
                    'name' => $relativePath
                ];
            }
            
            if (empty($documentsToArchive)) {
                return response()->json(['error' => 'Не найдено файлов для скачивания по заданным фильтрам'], 404);
            }
            
            // Проверяем наличие расширения ZipArchive
            if (!class_exists('ZipArchive')) {
                return response()->json(['error' => 'Расширение ZipArchive не установлено на сервере'], 500);
            }
            
            // Создаем временный ZIP архив
            $zipFileName = 'clinical_protocols_' . date('Y-m-d_His') . '.zip';
            $zipPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $zipFileName;
            
            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
                return response()->json(['error' => 'Не удалось создать архив'], 500);
            }
            
            // Добавляем файлы в архив
            foreach ($documentsToArchive as $document) {
                if (File::exists($document['path'])) {
                    $zip->addFile($document['path'], $document['name']);
                }
            }
            
            $zip->close();
            
            // Проверяем, что архив создан
            if (!File::exists($zipPath)) {
                return response()->json(['error' => 'Ошибка при создании архива'], 500);
            }
            
            // Возвращаем архив для скачивания
            return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при создании архива клинических протоколов', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Ошибка при создании архива: ' . $e->getMessage()], 500);
        }
    }

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
                if ($searchTerm && !$this->containsCaseInsensitive(pathinfo($fileName, PATHINFO_FILENAME), $searchTerm)) {
                    continue;
                }
                
                // Фильтрация по разделу медицины
                if ($medicine) {
                    // Проверяем наличие раздела медицины в имени файла или в пути
                    $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                    $filePath = $file->getPathname();
                    
                    // Проверяем имя файла и путь на совпадение с разделом медицины
                    if (
                        !$this->containsCaseInsensitive($fileContent, $medicine) &&
                        !$this->containsCaseInsensitive($filePath, $medicine)
                    ) {
                        continue;
                    }
                }
                
                // Фильтрация по категории МКБ
                if ($mkb) {
                    // Проверяем наличие кода МКБ в имени файла или в пути
                    $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                    $filePath = $file->getPathname();
                    
                    // Проверяем имя файла и путь на совпадение с кодом МКБ
                    if (
                        !$this->containsCaseInsensitive($fileContent, $mkb) &&
                        !$this->containsCaseInsensitive($filePath, $mkb)
                    ) {
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

    /**
     * Определяет тип документа по пути к папке
     */
    private function getDocumentTypeFromPath($folderPath)
    {
        if (strpos($folderPath, 'Поток — клинические протоколы') !== false) {
            return 'protocols';
        } elseif (strpos($folderPath, 'Клинические руководства МЗ РК') !== false) {
            return 'guidelines';
        } elseif (strpos($folderPath, 'Архив клинических протоколов МЗ РК') !== false) {
            return 'archive';
        }
        
        return 'unknown';
    }

    private function containsCaseInsensitive(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return true;
        }

        return mb_stripos($haystack, $needle, 0, 'UTF-8') !== false;
    }

    private function arrayContainsInsensitive(array $haystack, string $needle): bool
    {
        foreach ($haystack as $value) {
            if ($this->containsCaseInsensitive($value, $needle)) {
                return true;
            }
        }

        return false;
    }

    private function getRelativeStoragePath(string $absolutePath): string
    {
        $storageRoot = realpath(public_path('storage'));
        $realPath = realpath($absolutePath);

        if ($storageRoot && $realPath && str_starts_with($realPath, $storageRoot)) {
            $relative = ltrim(str_replace($storageRoot, '', $realPath), DIRECTORY_SEPARATOR);
            return str_replace(DIRECTORY_SEPARATOR, '/', $relative);
        }

        return str_replace(DIRECTORY_SEPARATOR, '/', ltrim(str_replace(public_path(), '', $absolutePath), DIRECTORY_SEPARATOR));
    }

    private function getMetadataCollection(array $paths): Collection
    {
        if (empty($paths) || !Schema::hasTable('clinical_protocol_metadata')) {
            return collect();
        }
        
        $queryPaths = collect($paths)
            ->flatMap(fn ($path) => $this->generateMetadataKeyVariants($path))
            ->unique()
            ->values()
            ->all();

        if (empty($queryPaths)) {
            return collect();
        }

        try {
            return ClinicalProtocolMetadata::whereIn('file_path', $queryPaths)->get()->keyBy('file_path');
        } catch (QueryException $exception) {
            Log::warning('Не удалось получить метаданные клинических протоколов', [
                'error' => $exception->getMessage(),
            ]);
            return collect();
        }
    }

    private function generateMetadataKeyVariants(string $path): array
    {
        $normalized = str_replace('\\', '/', $path);
        $variants = [
            $normalized,
            ltrim($normalized, '/'),
        ];

        if (str_starts_with($normalized, 'documents/')) {
            $variants[] = substr($normalized, strlen('documents/'));
        }

        if (str_starts_with($normalized, 'storage/')) {
            $variants[] = substr($normalized, strlen('storage/'));
        }

        if (str_starts_with($normalized, 'storage/documents/')) {
            $afterStorage = substr($normalized, strlen('storage/'));
            $variants[] = $afterStorage;
            $variants[] = substr($normalized, strlen('storage/documents/'));
            $variants[] = 'documents/' . substr($normalized, strlen('storage/documents/'));
        }

        return array_values(array_unique(array_filter($variants)));
    }

    private function findMetadataByPath(Collection $metadataCollection, string $path): ?ClinicalProtocolMetadata
    {
        foreach ($this->generateMetadataKeyVariants($path) as $variant) {
            if ($metadataCollection->has($variant)) {
                return $metadataCollection->get($variant);
            }
        }

        return null;
    }

    private function getMedicineCategoriesMap(Collection $metadataCollection): Collection
    {
        if ($metadataCollection->isEmpty() || !Schema::hasTable('clinical_medicine_categories')) {
            return collect();
        }
        
        $allCategoryIds = $metadataCollection
            ->flatMap(fn ($meta) => $meta->medicine_category_ids ?? [])
            ->unique()
            ->filter();
        
        if ($allCategoryIds->isEmpty()) {
            return collect();
        }
        
        try {
            return ClinicalMedicineCategory::whereIn('id', $allCategoryIds)->pluck('name', 'id');
        } catch (QueryException $exception) {
            Log::warning('Не удалось получить справочник категорий медицины', [
                'error' => $exception->getMessage(),
            ]);
            return collect();
        }
    }

    private function fetchMedicineCategories(): array
    {
        if (!Schema::hasTable('clinical_medicine_categories')) {
            return [];
        }

        try {
            return ClinicalMedicineCategory::orderBy('name')->pluck('name')->toArray();
        } catch (QueryException $exception) {
            Log::warning('Ошибка чтения категорий медицины', [
                'error' => $exception->getMessage(),
            ]);
            return [];
        }
    }

    private function getDefaultMedicineCategories(): array
    {
        return config('clinical_protocols.defaults.medicine_categories', []);
    }
}
