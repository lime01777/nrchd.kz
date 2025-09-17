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
            // Админ имеет доступ ко всем папкам
            $allowedFolders = [
                'Клинические протоколы',
                'Bioethics',
                'Другие документы'
            ];
        } elseif ($user->isDocumentManager()) {
            // Менеджер документов имеет доступ только к клиническим протоколам
            $allowedFolders = [
                'Клинические протоколы'
            ];
        }

        return Inertia::render('Admin/DocumentManager/Index', [
            'user' => $user,
            'allowedFolders' => $allowedFolders
        ]);
    }

    /**
     * Получить список документов в папке с фильтрацией
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
            return true; // Админ имеет доступ ко всем папкам
        }

        if ($user->isDocumentManager()) {
            // Менеджер документов имеет доступ только к клиническим протоколам
            return strpos($folderPath, 'Клинические протоколы') === 0;
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