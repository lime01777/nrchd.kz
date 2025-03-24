<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentAccordion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DocumentAccordionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accordions = DocumentAccordion::orderBy('sort_order')->get();
        
        return Inertia::render('Admin/DocumentAccordions/Index', [
            'accordions' => $accordions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Получаем список доступных папок
        $folders = $this->getAvailableFolders();
        
        // Получаем список доступных страниц
        $pages = $this->getAvailablePages();
        
        return Inertia::render('Admin/DocumentAccordions/Create', [
            'folders' => $folders,
            'pages' => $pages
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'page_route' => 'nullable|string|max:255',
            'folder_path' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'bg_color' => 'required|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);
        
        DocumentAccordion::create($validated);
        
        return Redirect::route('admin.document-accordions.index')
            ->with('success', 'Аккордеон успешно создан');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $accordion = DocumentAccordion::findOrFail($id);
        
        return Inertia::render('Admin/DocumentAccordions/Show', [
            'accordion' => $accordion
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $accordion = DocumentAccordion::findOrFail($id);
        
        // Получаем список доступных папок
        $folders = $this->getAvailableFolders();
        
        // Получаем список доступных страниц
        $pages = $this->getAvailablePages();
        
        return Inertia::render('Admin/DocumentAccordions/Edit', [
            'accordion' => $accordion,
            'folders' => $folders,
            'pages' => $pages
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $accordion = DocumentAccordion::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'page_route' => 'nullable|string|max:255',
            'folder_path' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'bg_color' => 'required|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);
        
        $accordion->update($validated);
        
        return Redirect::route('admin.document-accordions.index')
            ->with('success', 'Аккордеон успешно обновлен');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $accordion = DocumentAccordion::findOrFail($id);
        $accordion->delete();
        
        return Redirect::route('admin.document-accordions.index')
            ->with('success', 'Аккордеон успешно удален');
    }
    
    /**
     * Получить список доступных папок в директории documents
     */
    private function getAvailableFolders()
    {
        $baseDirectory = public_path('storage/documents');
        $folders = [];
        
        if (File::isDirectory($baseDirectory)) {
            // Получаем все директории в указанной папке
            $directories = File::directories($baseDirectory);
            
            foreach ($directories as $dir) {
                $folderName = basename($dir);
                $folderPath = str_replace('\\', '/', $folderName);
                
                // Проверяем наличие поддиректорий
                $subDirectories = File::directories($dir);
                if (!empty($subDirectories)) {
                    foreach ($subDirectories as $subDir) {
                        $subFolderName = basename($subDir);
                        $subFolderPath = $folderPath . '/' . str_replace('\\', '/', $subFolderName);
                        
                        $folders[] = [
                            'path' => $subFolderPath,
                            'name' => $folderName . '/' . $subFolderName
                        ];
                    }
                }
                
                // Добавляем основную директорию
                $folders[] = [
                    'path' => $folderPath,
                    'name' => $folderName
                ];
            }
        }
        
        return $folders;
    }
    
    /**
     * Получить список доступных страниц
     */
    private function getAvailablePages()
    {
        // Здесь можно динамически получать список страниц из маршрутов
        // или использовать статический список основных страниц
        return [
            ['route' => 'human.resources', 'name' => 'Кадровые ресурсы'],
            ['route' => 'medical.education', 'name' => 'Медицинское образование'],
            ['route' => 'science', 'name' => 'Наука'],
            ['route' => 'international.cooperation', 'name' => 'Международное сотрудничество'],
            ['route' => 'press.center', 'name' => 'Пресс-центр']
        ];
    }
}
