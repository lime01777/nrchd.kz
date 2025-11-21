<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedTechDocument;
use App\Models\MedTechRegistry;
use App\Models\MedTechPilotSite;
use App\Models\MedTechContent;
use App\Models\MedTechSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Контроллер админки для управления платформой MedTech
 */
class MedTechController extends Controller
{
    public function __construct()
    {
        // Можно добавить политику доступа, если нужно
        // $this->middleware('auth');
    }

    /**
     * Главная страница админ-панели MedTech
     */
    public function index(): InertiaResponse
    {
        $documentsCount = MedTechDocument::count();
        $registryCount = MedTechRegistry::count();
        $pilotSitesCount = MedTechPilotSite::count();
        $submissionsCount = MedTechSubmission::count();

        return Inertia::render('Admin/MedTech/Index', [
            'stats' => [
                'documents' => $documentsCount,
                'registry' => $registryCount,
                'pilot_sites' => $pilotSitesCount,
                'submissions' => $submissionsCount,
            ],
        ]);
    }

    // ==================== ДОКУМЕНТЫ ====================

    /**
     * Список документов
     */
    public function documents(Request $request): InertiaResponse
    {
        $query = MedTechDocument::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        $documents = $query->orderBy('order')->orderBy('created_at', 'desc')->paginate(20);

        // Преобразуем данные для фронтенда
        $documents->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'type' => $item->type,
                'file_path' => $item->file_path,
                'file_name' => $item->file_name,
                'file_url' => $item->file_url,
                'order' => $item->order,
                'is_active' => $item->is_active,
            ];
        });

        return Inertia::render('Admin/MedTech/Documents/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Форма создания документа
     */
    public function createDocument(): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/Documents/Form', [
            'document' => null,
        ]);
    }

    /**
     * Сохранение документа
     */
    public function storeDocument(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $filePath = $request->file('file')->store('medtech/documents', 'public');
        $fileName = $request->file('file')->getClientOriginalName();

        MedTechDocument::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? null,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.medtech.documents')->with('success', 'Документ успешно создан');
    }

    /**
     * Форма редактирования документа
     */
    public function editDocument(MedTechDocument $document): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/Documents/Form', [
            'document' => $document,
        ]);
    }

    /**
     * Обновление документа
     */
    public function updateDocument(Request $request, MedTechDocument $document): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            // Удаляем старый файл
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $filePath = $request->file('file')->store('medtech/documents', 'public');
            $fileName = $request->file('file')->getClientOriginalName();
            $document->file_path = $filePath;
            $document->file_name = $fileName;
        }

        $document->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? null,
            'order' => $validated['order'] ?? 0,
            'is_active' => $request->has('is_active') ? (bool)$request->input('is_active') : $document->is_active,
        ]);

        return redirect()->route('admin.medtech.documents')->with('success', 'Документ успешно обновлен');
    }

    /**
     * Удаление документа
     */
    public function destroyDocument(MedTechDocument $document): RedirectResponse
    {
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }
        $document->delete();

        return redirect()->route('admin.medtech.documents')->with('success', 'Документ успешно удален');
    }

    // ==================== РЕЕСТР ТЕХНОЛОГИЙ ====================

    /**
     * Список записей реестра
     */
    public function registry(Request $request): InertiaResponse
    {
        $query = MedTechRegistry::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $registry = $query->orderBy('order')->orderBy('created_at', 'desc')->paginate(20);

        // Преобразуем данные для фронтенда
        $registry->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'type' => $item->type,
                'application_area' => $item->application_area,
                'trl' => $item->trl,
                'status' => $item->status,
                'developer' => $item->developer,
                'pilot_sites' => $item->pilot_sites,
                'full_description' => $item->full_description,
                'is_active' => $item->is_active,
            ];
        });

        return Inertia::render('Admin/MedTech/Registry/Index', [
            'registry' => $registry,
        ]);
    }

    /**
     * Форма создания записи реестра
     */
    public function createRegistry(): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/Registry/Form', [
            'item' => null,
        ]);
    }

    /**
     * Сохранение записи реестра
     */
    public function storeRegistry(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'application_area' => 'nullable|string|max:255',
            'trl' => 'nullable|integer|min:1|max:9',
            'status' => 'nullable|string|max:100',
            'developer' => 'nullable|string|max:255',
            'pilot_sites' => 'nullable|string',
            'full_description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['is_active'] = $request->has('is_active') ? (bool)$request->input('is_active') : true;
        MedTechRegistry::create($data);

        return redirect()->route('admin.medtech.registry')->with('success', 'Запись реестра успешно создана');
    }

    /**
     * Форма редактирования записи реестра
     */
    public function editRegistry(MedTechRegistry $registry): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/Registry/Form', [
            'item' => $registry,
        ]);
    }

    /**
     * Обновление записи реестра
     */
    public function updateRegistry(Request $request, MedTechRegistry $registry): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'application_area' => 'nullable|string|max:255',
            'trl' => 'nullable|integer|min:1|max:9',
            'status' => 'nullable|string|max:100',
            'developer' => 'nullable|string|max:255',
            'pilot_sites' => 'nullable|string',
            'full_description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['is_active'] = $request->has('is_active') ? (bool)$request->input('is_active') : $registry->is_active;
        $registry->update($data);

        return redirect()->route('admin.medtech.registry')->with('success', 'Запись реестра успешно обновлена');
    }

    /**
     * Удаление записи реестра
     */
    public function destroyRegistry(MedTechRegistry $registry): RedirectResponse
    {
        $registry->delete();

        return redirect()->route('admin.medtech.registry')->with('success', 'Запись реестра успешно удалена');
    }

    // ==================== ПИЛОТНЫЕ ПЛОЩАДКИ ====================

    /**
     * Список пилотных площадок
     */
    public function pilotSites(Request $request): InertiaResponse
    {
        $query = MedTechPilotSite::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $pilotSites = $query->orderBy('order')->orderBy('name')->paginate(20);

        // Преобразуем данные для фронтенда
        $pilotSites->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'city' => $item->city,
                'region' => $item->region,
                'profile' => $item->profile,
                'description' => $item->description,
                'technologies' => $item->technologies,
                'is_active' => $item->is_active,
            ];
        });

        return Inertia::render('Admin/MedTech/PilotSites/Index', [
            'pilotSites' => $pilotSites,
        ]);
    }

    /**
     * Форма создания пилотной площадки
     */
    public function createPilotSite(): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/PilotSites/Form', [
            'pilotSite' => null,
        ]);
    }

    /**
     * Сохранение пилотной площадки
     */
    public function storePilotSite(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'region' => 'nullable|string|max:100',
            'profile' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'technologies' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['is_active'] = $request->has('is_active') ? (bool)$request->input('is_active') : true;
        MedTechPilotSite::create($data);

        return redirect()->route('admin.medtech.pilot-sites')->with('success', 'Пилотная площадка успешно создана');
    }

    /**
     * Форма редактирования пилотной площадки
     */
    public function editPilotSite(MedTechPilotSite $pilotSite): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/PilotSites/Form', [
            'pilotSite' => $pilotSite,
        ]);
    }

    /**
     * Обновление пилотной площадки
     */
    public function updatePilotSite(Request $request, MedTechPilotSite $pilotSite): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'region' => 'nullable|string|max:100',
            'profile' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'technologies' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['is_active'] = $request->has('is_active') ? (bool)$request->input('is_active') : $pilotSite->is_active;
        $pilotSite->update($data);

        return redirect()->route('admin.medtech.pilot-sites')->with('success', 'Пилотная площадка успешно обновлена');
    }

    /**
     * Удаление пилотной площадки
     */
    public function destroyPilotSite(MedTechPilotSite $pilotSite): RedirectResponse
    {
        $pilotSite->delete();

        return redirect()->route('admin.medtech.pilot-sites')->with('success', 'Пилотная площадка успешно удалена');
    }

    // ==================== ЗАЯВКИ ====================

    /**
     * Список заявок на подачу технологий
     */
    public function submissions(Request $request): InertiaResponse
    {
        $query = MedTechSubmission::query();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('organization', 'like', '%' . $request->input('search') . '%')
                  ->orWhere('contact_name', 'like', '%' . $request->input('search') . '%')
                  ->orWhere('technology_name', 'like', '%' . $request->input('search') . '%');
            });
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/MedTech/Submissions/Index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Просмотр заявки
     */
    public function showSubmission(MedTechSubmission $submission): InertiaResponse
    {
        return Inertia::render('Admin/MedTech/Submissions/Show', [
            'submission' => [
                'id' => $submission->id,
                'organization' => $submission->organization,
                'contact_name' => $submission->contact_name,
                'contact_email' => $submission->contact_email,
                'contact_phone' => $submission->contact_phone,
                'technology_name' => $submission->technology_name,
                'description' => $submission->description,
                'type' => $submission->type,
                'trl' => $submission->trl,
                'pilot_sites' => $submission->pilot_sites,
                'attachment_path' => $submission->attachment_path,
                'attachment_url' => $submission->attachment_url,
                'status' => $submission->status,
                'admin_notes' => $submission->admin_notes,
                'created_at' => $submission->created_at,
            ],
        ]);
    }

    /**
     * Обновление статуса заявки
     */
    public function updateSubmissionStatus(Request $request, MedTechSubmission $submission): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $submission->update($validated);

        return redirect()->route('admin.medtech.submissions')->with('success', 'Статус заявки обновлен');
    }

    // ==================== КОНТЕНТ (АЛГОРИТМ) ====================

    /**
     * Управление контентом (алгоритм, этапы, индикаторы)
     */
    public function content(): InertiaResponse
    {
        $algorithmSteps = MedTechContent::where('section', 'algorithm_steps')
            ->orderBy('order')
            ->get()
            ->pluck('content_ru')
            ->filter()
            ->values()
            ->all();

        $algorithmIndicators = MedTechContent::where('section', 'algorithm_indicators')
            ->orderBy('order')
            ->get()
            ->pluck('content_ru')
            ->filter()
            ->values()
            ->all();

        $algorithmImageContent = MedTechContent::where('section', 'algorithm')
            ->where('key', 'image')
            ->first();

        $algorithmImage = $algorithmImageContent ? $algorithmImageContent->image_url : null;

        return Inertia::render('Admin/MedTech/Content/Index', [
            'algorithmSteps' => $algorithmSteps,
            'algorithmIndicators' => $algorithmIndicators,
            'algorithmImage' => $algorithmImage,
        ]);
    }

    /**
     * Сохранение контента
     */
    public function storeContent(Request $request): RedirectResponse
    {
        try {
            // Обработка изображения алгоритма
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('medtech/content', 'public');
                
                // Удаляем старое изображение, если есть
                $oldImage = MedTechContent::where('section', 'algorithm')
                    ->where('key', 'image')
                    ->first();
                if ($oldImage && $oldImage->image_path) {
                    Storage::disk('public')->delete($oldImage->image_path);
                    $oldImage->delete();
                }

                MedTechContent::create([
                    'section' => 'algorithm',
                    'key' => 'image',
                    'image_path' => $imagePath,
                    'order' => 0,
                ]);
            }

            // Сохранение этапов алгоритма
            if ($request->has('algorithm_steps')) {
                $steps = $request->input('algorithm_steps');
                
                // Если данные пришли как JSON строка, декодируем
                if (is_string($steps)) {
                    $steps = json_decode($steps, true);
                }
                
                if (is_array($steps) && count($steps) > 0) {
                    // Удаляем старые этапы
                    MedTechContent::where('section', 'algorithm_steps')->delete();
                    
                    foreach ($steps as $index => $step) {
                        // Проверяем, что есть контент (может быть объект или строка)
                        $contentRu = is_array($step) ? ($step['content_ru'] ?? '') : (is_string($step) ? $step : '');
                        
                        if (!empty($contentRu) && trim($contentRu) !== '') {
                            MedTechContent::create([
                                'section' => 'algorithm_steps',
                                'key' => 'step_' . ($index + 1),
                                'content_ru' => trim($contentRu),
                                'content_kz' => is_array($step) ? (trim($step['content_kz'] ?? '') ?: null) : null,
                                'content_en' => is_array($step) ? (trim($step['content_en'] ?? '') ?: null) : null,
                                'order' => $index,
                            ]);
                        }
                    }
                }
            }

            // Сохранение индикаторов
            if ($request->has('algorithm_indicators')) {
                $indicators = $request->input('algorithm_indicators');
                
                // Если данные пришли как JSON строка, декодируем
                if (is_string($indicators)) {
                    $indicators = json_decode($indicators, true);
                }
                
                if (is_array($indicators) && count($indicators) > 0) {
                    // Удаляем старые индикаторы
                    MedTechContent::where('section', 'algorithm_indicators')->delete();
                    
                    foreach ($indicators as $index => $indicator) {
                        // Проверяем, что есть контент (может быть объект или строка)
                        $contentRu = is_array($indicator) ? ($indicator['content_ru'] ?? '') : (is_string($indicator) ? $indicator : '');
                        
                        if (!empty($contentRu) && trim($contentRu) !== '') {
                            MedTechContent::create([
                                'section' => 'algorithm_indicators',
                                'key' => 'indicator_' . ($index + 1),
                                'content_ru' => trim($contentRu),
                                'content_kz' => is_array($indicator) ? (trim($indicator['content_kz'] ?? '') ?: null) : null,
                                'content_en' => is_array($indicator) ? (trim($indicator['content_en'] ?? '') ?: null) : null,
                                'order' => $index,
                            ]);
                        }
                    }
                }
            }

            return redirect()->route('admin.medtech.content')->with('success', 'Контент успешно сохранен');
        } catch (\Exception $e) {
            Log::error('Ошибка сохранения контента MedTech', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['image']),
            ]);

            return redirect()->route('admin.medtech.content')
                ->withErrors(['error' => 'Произошла ошибка при сохранении: ' . $e->getMessage()]);
        }
    }
}
