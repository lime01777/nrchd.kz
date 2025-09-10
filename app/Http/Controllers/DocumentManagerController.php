<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DocumentManagerController extends Controller
{
    /**
     * Показать главную страницу управления документами
     */
    public function index()
    {
        $user = auth()->user();
        
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
     * Получить список документов в папке
     */
    public function getDocuments(Request $request)
    {
        $folderPath = $request->input('folder', 'Клинические протоколы');
        $user = auth()->user();
        
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

        // Обрабатываем файлы
        foreach ($items as $file) {
            $relativePath = str_replace($fullPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $documents[] = [
                'name' => $file->getFilename(),
                'path' => $relativePath,
                'size' => $file->getSize(),
                'extension' => $file->getExtension(),
                'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                'type' => 'file',
                'url' => '/storage/documents/' . $folderPath . '/' . $relativePath
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

        return response()->json([
            'documents' => $documents,
            'directories' => $directories,
            'currentPath' => $folderPath
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

        $user = auth()->user();
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

        $user = auth()->user();
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

        $user = auth()->user();
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
}