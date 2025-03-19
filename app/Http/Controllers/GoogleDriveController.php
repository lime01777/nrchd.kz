<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GoogleDriveController extends Controller
{
    /**
     * API ключ Google (в реальном приложении должен храниться в .env)
     */
    protected $apiKey;

    /**
     * Конструктор
     */
    public function __construct()
    {
        $this->apiKey = env('GOOGLE_DRIVE_API_KEY');
    }

    /**
     * Получение списка файлов из папки Google Drive
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFiles(Request $request)
    {
        $request->validate([
            'folderId' => 'required|string',
        ]);

        $folderId = $request->input('folderId');
        
        // Кэшируем результаты на 1 час для уменьшения количества запросов к API
        $cacheKey = 'google_drive_files_' . $folderId;
        
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        try {
            // Запрос к Google Drive API для получения списка файлов
            $response = Http::get('https://www.googleapis.com/drive/v3/files', [
                'q' => "'{$folderId}' in parents and trashed = false",
                'key' => $this->apiKey,
                'fields' => 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)',
                'pageSize' => 100,
            ]);
            
            if ($response->successful()) {
                $files = $response->json()['files'];
                
                // Кэшируем результаты
                Cache::put($cacheKey, $files, now()->addHour());
                
                return response()->json($files);
            } else {
                Log::error('Google Drive API Error: ' . $response->body());
                return response()->json(['error' => 'Failed to fetch files from Google Drive'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Google Drive API Exception: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching files'], 500);
        }
    }

    /**
     * Получение метаданных файла
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFileMetadata(Request $request)
    {
        $request->validate([
            'fileId' => 'required|string',
        ]);

        $fileId = $request->input('fileId');
        
        // Кэшируем результаты на 1 час
        $cacheKey = 'google_drive_file_' . $fileId;
        
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        try {
            // Запрос к Google Drive API для получения метаданных файла
            $response = Http::get("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                'key' => $this->apiKey,
                'fields' => 'id, name, mimeType, size, modifiedTime, webViewLink, webContentLink',
            ]);
            
            if ($response->successful()) {
                $file = $response->json();
                
                // Кэшируем результаты
                Cache::put($cacheKey, $file, now()->addHour());
                
                return response()->json($file);
            } else {
                Log::error('Google Drive API Error: ' . $response->body());
                return response()->json(['error' => 'Failed to fetch file metadata from Google Drive'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Google Drive API Exception: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching file metadata'], 500);
        }
    }

    /**
     * Получение URL для просмотра файла
     *
     * @param string $fileId
     * @return string
     */
    public function getFileViewUrl($fileId)
    {
        return "https://drive.google.com/file/d/{$fileId}/view";
    }

    /**
     * Получение URL для скачивания файла
     *
     * @param string $fileId
     * @return string
     */
    public function getFileDownloadUrl($fileId)
    {
        return "https://drive.google.com/uc?export=download&id={$fileId}";
    }
}
