<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class TranslationsController extends Controller
{
    /**
     * Показать интерфейс управления переводами
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Получаем список файлов локализации
        $files = [];
        
        if (File::isDirectory(resource_path('lang/ru'))) {
            $files = collect(File::files(resource_path('lang/ru')))
                ->filter(function ($file) {
                    return $file->getExtension() === 'php';
                })
                ->map(function ($file) {
                    return $file->getFilename();
                })
                ->values()
                ->all();
        }
        
        $currentFile = $request->query('file', 'common.php');
        
        return Inertia::render('Admin/TranslationManager', [
            'languages' => ['ru', 'kz', 'en'],
            'availableFiles' => $files,
            'currentTranslationFile' => $currentFile
        ]);
    }
}
