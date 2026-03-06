<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class DocumentManagerController extends Controller
{
    /**
     * Показать главную страницу управления документами
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Определяем доступные папки в зависимости от роли пользователя
        $allowedFolders = [];
        
        if ($user->isAdmin()) {
            $path = public_path('storage/documents');
            if (File::isDirectory($path)) {
                foreach (File::directories($path) as $dir) {
                    $allowedFolders[] = basename($dir);
                }
            }
        } elseif ($user->hasPermission('documents') && is_array($user->document_folders)) {
            $allowedFolders = $user->document_folders;
        } elseif ($user->hasPermission('okk_committee')) {
            $allowedFolders = [
                'Клинические протоколы/Комиссия по клиническим протоколам/Материалы для ОКК МЗ РК'
            ];
        }

        return Inertia::render('Admin/Documents/Index', [
            'user' => $user,
            'allowedFolders' => $allowedFolders,
            'canEdit' => $user->hasPermission('documents')
        ]);
    }

    /**
     * Получить дерево папок для визуального пикера
     */
    public function getFolderTree(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $rootFolders = [];
        
        if ($user->isAdmin()) {
            $path = public_path('storage/documents');
            if (File::isDirectory($path)) {
                foreach (File::directories($path) as $dir) {
                    $rootFolders[] = basename($dir);
                }
            }
        } elseif ($user->hasPermission('documents') && is_array($user->document_folders)) {
            $rootFolders = $user->document_folders;
        } elseif ($user->hasPermission('okk_committee')) {
            $rootFolders = ['Клинические протоколы/Комиссия по клиническим протоколам/Материалы для ОКК МЗ РК'];
        }

        $tree = [];
        foreach ($rootFolders as $folder) {
            $fullPath = public_path('storage/documents/' . $folder);
            $tree[] = [
                'name' => basename($folder),
                'path' => $folder,
                'children' => $this->buildFolderTree($fullPath, $folder)
            ];
        }

        return response()->json(['tree' => $tree]);
    }

    /**
     * Рекурсивное построение дерева папок (не более 3 уровней)
     */
    private function buildFolderTree(string $path, string $relativePath, int $depth = 0): array
    {
        if ($depth >= 5 || !File::isDirectory($path)) {
            return [];
        }
        
        $children = [];
        foreach (File::directories($path) as $dir) {
            $name = basename($dir);
            $childRelPath = $relativePath . '/' . $name;
            $children[] = [
                'name' => $name,
                'path' => $childRelPath,
                'children' => $this->buildFolderTree($dir, $childRelPath, $depth + 1)
            ];
        }
        return $children;
    }

    /**
     * Показать главную страницу управления документами
     */
    public function getDocuments(Request $request)
    {
        $folderPath = $request->input('folder', 'Клинические протоколы');
        $searchTerm = $request->input('search', '');
        $medicine = $request->input('medicine', '');
        $mkb = $request->input('mkb', '');
        $year = $request->input('year', '');
        $category = $request->input('category', '');
        
        /** @var User $user */
        $user = Auth::user();
        
        // Проверяем доступ к папке
        if (!$this->hasAccessToFolder($user, $folderPath)) {
            return response()->json(['error' => 'Нет доступа к этой папке'], 403);
        }

        $fullPath = public_path('storage/documents/' . $folderPath);
        
        if (!File::exists($fullPath)) {
            return response()->json(['error' => 'Папка не найдена'], 404);
        }

        $documents = [];
        $directories = [];

        // Получаем файлы и папки
        $items = File::allFiles($fullPath);
        $dirs = File::directories($fullPath);

        // Обрабатываем файлы с фильтрацией
        foreach ($items as $file) {
            $fileName = $file->getFilename();
            $fileExtension = $file->getExtension();
            $fileSize = $file->getSize();
            $lastModified = $file->getMTime();
            $fileYear = date('Y', $lastModified);
            
            // Фильтрация по году
            if ($year && $fileYear != $year) {
                continue;
            }
            
            // Фильтрация по поисковому запросу
            if ($searchTerm && stripos(pathinfo($fileName, PATHINFO_FILENAME), $searchTerm) === false) {
                continue;
            }
            
            // Фильтрация по разделу медицины
            if ($medicine) {
                $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                $filePath = $file->getPathname();
                
                if (stripos($fileContent, $medicine) === false && stripos($filePath, $medicine) === false) {
                    continue;
                }
            }
            
            // Фильтрация по категории МКБ
            if ($mkb) {
                $fileContent = pathinfo($fileName, PATHINFO_FILENAME);
                $filePath = $file->getPathname();
                
                if (stripos($fileContent, $mkb) === false && stripos($filePath, $mkb) === false) {
                    continue;
                }
            }
            
            $relativePath = str_replace($fullPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
            
            // Определяем раздел медицины на основе имени файла и пути
            $medicineSectionName = $this->getMedicineSectionFromFile($fileName, $file->getPathname());
            
            // Определяем категорию МКБ
            $mkbCategory = $this->getMkbCategoryFromFile($fileName, $file->getPathname());
            
            $documents[] = [
                'name' => $file->getFilename(),
                'path' => $relativePath,
                'size' => $fileSize,
                'extension' => $fileExtension,
                'modified' => date('Y-m-d H:i:s', $lastModified),
                'type' => 'file',
                'url' => '/storage/documents/' . $folderPath . '/' . $relativePath,
                'year' => $fileYear,
                'medicine' => $medicineSectionName,
                'mkb' => $mkbCategory,
                'category' => $this->getCategoryFromPath($file->getPathname(), $fullPath)
            ];
        }

        // Обрабатываем папки
        foreach ($dirs as $dir) {
            $relativePath = str_replace($fullPath . DIRECTORY_SEPARATOR, '', $dir);
            $directories[] = [
                'name' => basename($dir),
                'path' => $relativePath,
                'type' => 'directory',
                'modified' => date('Y-m-d H:i:s', File::lastModified($dir))
            ];
        }

        // Сортируем по названию
        usort($documents, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        return response()->json([
            'documents' => $documents,
            'directories' => $directories,
            'currentPath' => $folderPath,
            'total' => count($documents)
        ]);
    }

    /**
     * Создать новую папку
     */
    public function createFolder(Request $request)
    {
        $request->validate([
            'currentPath' => 'required|string',
            'folderName' => 'required|string|max:255'
        ]);

        /** @var User $user */
        $user = Auth::user();
        $currentPath = $request->input('currentPath');
        $folderName = $request->input('folderName');

        // Проверяем доступ к родительской папке
        if (!$this->hasAccessToFolder($user, $currentPath)) {
            return response()->json(['error' => 'Нет доступа к этой папке'], 403);
        }

        $fullPath = public_path('storage/documents/' . $currentPath . '/' . ltrim($folderName, '/'));

        if (File::exists($fullPath)) {
            return response()->json(['error' => 'Папка с таким именем уже существует'], 400);
        }

        try {
            File::makeDirectory($fullPath, 0755, true);
            
            Log::info('Создана новая папка', [
                'user_id' => $user->id,
                'path' => $currentPath . '/' . $folderName
            ]);

            return response()->json(['message' => 'Папка успешно создана']);
        } catch (\Exception $e) {
            Log::error('Ошибка при создании папки', [
                'error' => $e->getMessage(),
                'path' => $currentPath . '/' . $folderName
            ]);
            
            return response()->json(['error' => 'Ошибка при создании папки'], 500);
        }
    }

    /**
     * Загрузить файлы в указанную папку
     */
    public function upload(Request $request)
    {
        $request->validate([
            'currentPath' => 'required|string',
            'files' => 'required|array',
            'files.*' => 'required|file' // Можно добавить макс. размер: |max:50000
        ]);

        /** @var User $user */
        $user = Auth::user();
        $currentPath = $request->input('currentPath');

        // Проверяем доступ к папке, куда грузим
        if (!$this->hasAccessToFolder($user, $currentPath)) {
            return response()->json(['error' => 'Нет доступа к этой папке'], 403);
        }

        $fullPath = public_path('storage/documents/' . $currentPath);

        if (!File::exists($fullPath)) {
            return response()->json(['error' => 'Папка назначения не найдена'], 404);
        }

        $uploadedCount = 0;
        $errors = [];

        foreach ($request->file('files') as $file) {
            $fileName = $file->getClientOriginalName();
            $targetPath = $fullPath . DIRECTORY_SEPARATOR . $fileName;

            if (File::exists($targetPath)) {
                $errors[] = "Файл {$fileName} уже существует";
                continue;
            }

            try {
                $file->move($fullPath, $fileName);
                $uploadedCount++;
            } catch (\Exception $e) {
                $errors[] = "Ошибка загрузки {$fileName}";
                Log::error('Ошибка загрузки документа', [
                    'error' => $e->getMessage(),
                    'file' => $fileName,
                    'path' => $currentPath
                ]);
            }
        }

        if (count($errors) > 0) {
            return response()->json([
                'error' => "Загружено: {$uploadedCount}. Ошибки: " . implode(', ', $errors)
            ], 207); // 207 Multi-Status
        }

        return response()->json([
            'message' => "Успешно загружено файлов: {$uploadedCount}"
        ]);
    }

    /**
     * Переименовать документ или папку
     */
    public function rename(Request $request)
    {
        $request->validate([
            'currentPath' => 'required|string',
            'newName' => 'required|string|max:255',
            'type' => 'required|in:file,directory'
        ]);

        /** @var User $user */
        $user = Auth::user();
        $currentPath = $request->input('currentPath');
        $newName = $request->input('newName');
        $type = $request->input('type');

        // Проверяем доступ к папке
        $folderPath = dirname($currentPath);
        if (!$this->hasAccessToFolder($user, $folderPath)) {
            return response()->json(['error' => 'Нет доступа к этой папке'], 403);
        }

        $fullCurrentPath = public_path('storage/documents/' . $currentPath);
        $fullNewPath = public_path('storage/documents/' . dirname($currentPath) . '/' . $newName);

        if (!File::exists($fullCurrentPath)) {
            return response()->json(['error' => 'Файл или папка не найдены'], 404);
        }

        if (File::exists($fullNewPath)) {
            return response()->json(['error' => 'Файл или папка с таким именем уже существует'], 400);
        }

        try {
            File::move($fullCurrentPath, $fullNewPath);
            
            Log::info('Документ переименован', [
                'user_id' => $user->id,
                'old_path' => $currentPath,
                'new_name' => $newName,
                'type' => $type
            ]);

            return response()->json(['message' => 'Успешно переименовано']);
        } catch (\Exception $e) {
            Log::error('Ошибка при переименовании документа', [
                'error' => $e->getMessage(),
                'path' => $currentPath
            ]);
            
            return response()->json(['error' => 'Ошибка при переименовании'], 500);
        }
    }

    /**
     * Переместить документ или папку
     */
    public function move(Request $request)
    {
        $request->validate([
            'currentPath' => 'required|string',
            'newPath' => 'required|string',
            'type' => 'required|in:file,directory'
        ]);

        /** @var User $user */
        $user = Auth::user();
        $currentPath = $request->input('currentPath');
        $newPath = $request->input('newPath');
        $type = $request->input('type');

        // Проверяем доступ к исходной и целевой папкам
        $currentFolder = dirname($currentPath);
        $newFolder = dirname($newPath);
        
        if (!$this->hasAccessToFolder($user, $currentFolder) || 
            !$this->hasAccessToFolder($user, $newFolder)) {
            return response()->json(['error' => 'Нет доступа к одной из папок'], 403);
        }

        $fullCurrentPath = public_path('storage/documents/' . $currentPath);
        $fullNewPath = public_path('storage/documents/' . $newPath);

        if (!File::exists($fullCurrentPath)) {
            return response()->json(['error' => 'Файл или папка не найдены'], 404);
        }

        if (File::exists($fullNewPath)) {
            return response()->json(['error' => 'Файл или папка с таким именем уже существует в целевой папке'], 400);
        }

        try {
            // Создаем целевую папку если она не существует
            $targetDir = dirname($fullNewPath);
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }

            File::move($fullCurrentPath, $fullNewPath);
            
            Log::info('Документ перемещен', [
                'user_id' => $user->id,
                'old_path' => $currentPath,
                'new_path' => $newPath,
                'type' => $type
            ]);

            return response()->json(['message' => 'Успешно перемещено']);
        } catch (\Exception $e) {
            Log::error('Ошибка при перемещении документа', [
                'error' => $e->getMessage(),
                'old_path' => $currentPath,
                'new_path' => $newPath
            ]);
            
            return response()->json(['error' => 'Ошибка при перемещении'], 500);
        }
    }

    /**
     * Массовое перемещение документов и папок
     */
    public function bulkMove(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.path' => 'required|string',
            'items.*.type' => 'required|in:file,directory',
            'newPath' => 'required|string'
        ]);

        /** @var User $user */
        $user = Auth::user();
        $items = $request->input('items');
        $newPath = $request->input('newPath');

        // Проверяем доступ к целевой папке
        if (!$this->hasAccessToFolder($user, $newPath)) {
            return response()->json(['error' => 'Нет доступа к целевой папке'], 403);
        }

        $fullNewPath = public_path('storage/documents/' . $newPath);

        try {
            if (!File::exists($fullNewPath)) {
                File::makeDirectory($fullNewPath, 0755, true);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Не удалось создать целевую папку'], 500);
        }

        $movedCount = 0;
        $errors = [];

        foreach ($items as $item) {
            $currentPath = $item['path'];
            $type = $item['type'];
            $currentFolder = dirname($currentPath);

            // Проверяем доступ к исходной папке
            if (!$this->hasAccessToFolder($user, $currentFolder)) {
                $errors[] = "Нет доступа к перемещению из: " . basename($currentFolder);
                continue;
            }

            $fullCurrentPath = public_path('storage/documents/' . $currentPath);
            $targetPath = $fullNewPath . DIRECTORY_SEPARATOR . basename($currentPath);

            if (!File::exists($fullCurrentPath)) {
                $errors[] = basename($currentPath) . " не найден";
                continue;
            }

            if (File::exists($targetPath)) {
                $errors[] = basename($currentPath) . " уже существует в целевой папке";
                continue;
            }

            try {
                File::move($fullCurrentPath, $targetPath);
                $movedCount++;
            } catch (\Exception $e) {
                $errors[] = "Ошибка при перемещении " . basename($currentPath);
            }
        }

        if ($movedCount > 0) {
            Log::info('Массовое перемещение завершено', [
                'user_id' => $user->id,
                'moved_count' => $movedCount,
                'new_path' => $newPath
            ]);
        }

        if (count($errors) > 0) {
            return response()->json([
                'error' => "Перемещено: $movedCount. Ошибок: " . count($errors),
                'details' => $errors
            ], $movedCount == 0 ? 400 : 207);
        }

        return response()->json(['message' => "Успешно перемещено $movedCount элементов"]);
    }

    /**
     * Удалить документ или папку
     */
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'type' => 'required|in:file,directory'
        ]);

        /** @var User $user */
        $user = Auth::user();
        $path = $request->input('path');
        $type = $request->input('type');

        // Проверяем доступ к папке
        $folderPath = dirname($path);
        if (!$this->hasAccessToFolder($user, $folderPath)) {
            return response()->json(['error' => 'Нет доступа к этой папке'], 403);
        }

        $fullPath = public_path('storage/documents/' . $path);

        if (!File::exists($fullPath)) {
            return response()->json(['error' => 'Файл или папка не найдены'], 404);
        }

        try {
            if ($type === 'directory') {
                File::deleteDirectory($fullPath);
            } else {
                File::delete($fullPath);
            }
            
            Log::info('Документ удален', [
                'user_id' => $user->id,
                'path' => $path,
                'type' => $type
            ]);

            return response()->json(['message' => 'Успешно удалено']);
        } catch (\Exception $e) {
            Log::error('Ошибка при удалении документа', [
                'error' => $e->getMessage(),
                'path' => $path
            ]);
            
            return response()->json(['error' => 'Ошибка при удалении'], 500);
        }
    }

    /**
     * Проверить доступ пользователя к папке
     */
    private function hasAccessToFolder($user, $folderPath)
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->hasPermission('documents') && is_array($user->document_folders)) {
            foreach ($user->document_folders as $allowedFolder) {
                if ($folderPath === $allowedFolder || str_starts_with($folderPath, $allowedFolder . '/')) {
                    return true;
                }
            }
        }

        if ($user->hasPermission('okk_committee')) {
            return str_starts_with($folderPath, 'Клинические протоколы/Комиссия по клиническим протоколам/Материалы для ОКК МЗ РК');
        }

        return false;
    }

    /**
     * Определяет раздел медицины на основе имени файла и пути
     */
    private function getMedicineSectionFromFile($fileName, $filePath)
    {
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
        $filePathLower = strtolower($filePath);
        
        foreach ($medicineSections as $key => $value) {
            if (stripos($fileNameLower, $key) !== false || 
                stripos($fileNameLower, $value) !== false ||
                stripos($filePathLower, $key) !== false ||
                stripos($filePathLower, $value) !== false) {
                return $value;
            }
        }
        
        return '';
    }

    /**
     * Определяет категорию МКБ на основе имени файла и пути
     */
    private function getMkbCategoryFromFile($fileName, $filePath)
    {
        $mkbCategories = [
            'A00-B99' => 'A00-B99 Инфекционные и паразитарные болезни',
            'C00-D48' => 'C00-D48 Новообразования',
            'D50-D89' => 'D50-D89 Болезни крови и кроветворных органов',
            'E00-E90' => 'E00-E90 Болезни эндокринной системы',
            'F01-F99' => 'F01-F99 Психические расстройства',
            'G00-G99' => 'G00-G99 Болезни нервной системы',
            'H00-H59' => 'H00-H59 Болезни глаза',
            'H60-H95' => 'H60-H95 Болезни уха',
            'I00-I99' => 'I00-I99 Болезни системы кровообращения',
            'J00-J99' => 'J00-J99 Болезни органов дыхания',
            'K00-K93' => 'K00-K93 Болезни органов пищеварения',
            'L00-L99' => 'L00-L99 Болезни кожи',
            'M00-M99' => 'M00-M99 Болезни костно-мышечной системы',
            'N00-N99' => 'N00-N99 Болезни мочеполовой системы',
            'O00-O99' => 'O00-O99 Беременность, роды и послеродовой период',
            'P00-P96' => 'P00-P96 Отдельные состояния, возникающие в перинатальном периоде',
            'Q00-Q99' => 'Q00-Q99 Врожденные аномалии',
            'R00-R99' => 'R00-R99 Симптомы, признаки и отклонения от нормы',
            'S00-T98' => 'S00-T98 Травмы, отравления и другие последствия воздействия внешних причин',
            'U00-U99' => 'U00-U99 Коды для особых целей',
            'V01-Y98' => 'V01-Y98 Внешние причины заболеваемости и смертности',
            'Z00-Z99' => 'Z00-Z99 Факторы, влияющие на состояние здоровья'
        ];
        
        $fileNameLower = strtolower(pathinfo($fileName, PATHINFO_FILENAME));
        $filePathLower = strtolower($filePath);
        
        foreach ($mkbCategories as $key => $value) {
            if (stripos($fileNameLower, $key) !== false || 
                stripos($fileNameLower, $value) !== false ||
                stripos($filePathLower, $key) !== false ||
                stripos($filePathLower, $value) !== false) {
                return $key;
            }
        }
        
        return '';
    }

    /**
     * Получить категорию из пути файла
     */
    private function getCategoryFromPath($filePath, $basePath)
    {
        $relativePath = str_replace($basePath . DIRECTORY_SEPARATOR, '', $filePath);
        $pathParts = explode(DIRECTORY_SEPARATOR, $relativePath);
        
        // Возвращаем название папки, в которой находится файл
        if (count($pathParts) > 1) {
            return $pathParts[count($pathParts) - 2];
        }
        
        return '';
    }
}