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
        return [
            // Страницы из раздела Direction
            ['route' => 'direction.human.resources', 'name' => 'Кадровые ресурсы'],
            ['route' => 'direction.medical.education', 'name' => 'Медицинское образование'],
            ['route' => 'direction.medical.science', 'name' => 'Медицинская наука'],
            ['route' => 'direction.medical.rating', 'name' => 'Рейтинг медицинских организаций'],
            ['route' => 'direction.medical.accreditation', 'name' => 'Аккредитация медицинских организаций'],
            ['route' => 'direction.medical.statistics', 'name' => 'Медицинская статистика'],
            ['route' => 'direction.clinical.protocols', 'name' => 'Клинические протоколы'],
            ['route' => 'direction.drug.policy', 'name' => 'Лекарственная политика'],
            ['route' => 'direction.electronic.health', 'name' => 'Электронное здравоохранение'],
            ['route' => 'direction.health.accounts', 'name' => 'Национальные счета здравоохранения'],
            ['route' => 'direction.health.rate', 'name' => 'Тарифы на медицинские услуги'],
            ['route' => 'direction.strategic.initiatives', 'name' => 'Стратегические инициативы'],
            ['route' => 'medical.tourism', 'name' => 'Медицинский туризм'],
            
            // Страницы из подраздела Direction/StrategicInitiatives
            ['route' => 'direction.strategic.initiatives.astana.declaration', 'name' => 'Декларация Астаны'],
            ['route' => 'direction.strategic.initiatives.partnership', 'name' => 'Стратегическое партнерство'],
            ['route' => 'direction.strategic.initiatives.research', 'name' => 'Стратегические исследования'],
            
            // Страницы из подраздела MedicalTourism
            ['route' => 'medical.tourism.directions', 'name' => 'Направления работы'],
            ['route' => 'medical.tourism.certification', 'name' => 'Сертификация клиник'],
            ['route' => 'medical.tourism.services', 'name' => 'Популярные услуги'],
            ['route' => 'medical.tourism.documents', 'name' => 'Документы'],
            ['route' => 'medical.tourism.contacts', 'name' => 'Контакты'],
            
            // Страницы из подраздела Direction/MedicalScience
            ['route' => 'direction.medical.science.clinical', 'name' => 'Клинические исследования'],
            ['route' => 'direction.medical.science.research', 'name' => 'Научные исследования'],
            ['route' => 'direction.medical.science.tech', 'name' => 'Инновационные технологии'],
            ['route' => 'direction.medical.science.council', 'name' => 'Научный совет'],
            
            // Страницы из подраздела Direction/MedicalRating
            ['route' => 'direction.medical.rating.quality', 'name' => 'Оценка качества'],
            ['route' => 'direction.medical.rating.regional', 'name' => 'Региональный рейтинг'],
            
            // Страницы из подраздела Direction/HumanResources
            ['route' => 'direction.human.resources.medical.workers', 'name' => 'Медицинские работники'],
            ['route' => 'direction.human.resources.managers', 'name' => 'Руководители'],
            ['route' => 'direction.human.resources.graduates', 'name' => 'Выпускники'],
            
            // Страницы из подраздела Direction/DrugPolicy
            ['route' => 'direction.drug.policy.regulations', 'name' => 'Нормативные документы'],
            ['route' => 'direction.drug.policy.commission', 'name' => 'Формулярная комиссия'],
            
            // Другие основные разделы сайта
            ['route' => 'about', 'name' => 'О центре'],
            ['route' => 'news', 'name' => 'Новости'],
            ['route' => 'contacts', 'name' => 'Контакты'],
            ['route' => 'press.center', 'name' => 'Пресс-центр']
        ];
    }
}
