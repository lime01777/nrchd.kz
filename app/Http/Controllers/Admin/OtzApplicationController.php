<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OtzApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OtzApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = OtzApplication::query();

        // Поиск по названию
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('application_id', 'like', '%' . $request->search . '%');
        }

        // Фильтрация по категории
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Фильтрация по этапу
        if ($request->filled('stage')) {
            $query->where('current_stage', $request->stage);
        }

        // Фильтрация по статусу
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $applications = $query->orderBy('created_at', 'desc')
                             ->paginate(12)
                             ->withQueryString();

        return Inertia::render('Admin/OtzApplications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'category', 'stage', 'status']),
            'categories' => OtzApplication::getCategories(),
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/OtzApplications/Create', [
            'categories' => OtzApplication::getCategories(),
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => ['required', Rule::in(OtzApplication::getCategories())],
            'current_stage' => ['required', Rule::in(OtzApplication::getStages())],
            'description' => 'nullable|string',
            'responsible_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'stage_start_date' => 'nullable|date',
            'stage_end_date' => 'nullable|date|after_or_equal:stage_start_date',
            'stage_documents' => 'nullable|array',
            'stage_documents.*.name' => 'required|string',
            'stage_documents.*.date' => 'required|date',
            'is_active' => 'boolean',
        ]);

        // Генерируем уникальный ID заявки
        $validated['application_id'] = OtzApplication::generateApplicationId();

        // Инициализируем прогресс по этапам
        $stages = OtzApplication::getStages();
        $stageProgress = [];
        foreach ($stages as $stage) {
            $stageProgress[$stage] = [
                'completed' => false,
                'start_date' => null,
                'end_date' => null,
                'documents' => []
            ];
        }

        // Отмечаем завершенные этапы
        $currentIndex = array_search($validated['current_stage'], $stages);
        for ($i = 0; $i < $currentIndex; $i++) {
            $stageProgress[$stages[$i]]['completed'] = true;
        }

        $validated['stage_progress'] = $stageProgress;

        OtzApplication::create($validated);

        return redirect()->route('admin.admin.otz-applications.index')
                         ->with('success', 'Заявка ОТЗ успешно создана');
    }

    /**
     * Display the specified resource.
     */
    public function show(OtzApplication $otzApplication)
    {
        return Inertia::render('Admin/OtzApplications/Show', [
            'application' => $otzApplication,
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OtzApplication $otzApplication)
    {
        return Inertia::render('Admin/OtzApplications/Edit', [
            'application' => $otzApplication,
            'categories' => OtzApplication::getCategories(),
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OtzApplication $otzApplication)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => ['required', Rule::in(OtzApplication::getCategories())],
            'current_stage' => ['required', Rule::in(OtzApplication::getStages())],
            'description' => 'nullable|string',
            'responsible_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'stage_start_date' => 'nullable|date',
            'stage_end_date' => 'nullable|date|after_or_equal:stage_start_date',
            'stage_documents' => 'nullable|array',
            'stage_documents.*.name' => 'required|string',
            'stage_documents.*.date' => 'required|date',
            'is_active' => 'boolean',
        ]);

        // Обновляем прогресс по этапам
        $stages = OtzApplication::getStages();
        $stageProgress = $otzApplication->stage_progress ?? [];
        
        foreach ($stages as $stage) {
            if (!isset($stageProgress[$stage])) {
                $stageProgress[$stage] = [
                    'completed' => false,
                    'start_date' => null,
                    'end_date' => null,
                    'documents' => []
                ];
            }
        }

        // Отмечаем завершенные этапы
        $currentIndex = array_search($validated['current_stage'], $stages);
        for ($i = 0; $i < $currentIndex; $i++) {
            $stageProgress[$stages[$i]]['completed'] = true;
        }

        $validated['stage_progress'] = $stageProgress;

        $otzApplication->update($validated);

        return redirect()->route('admin.admin.otz-applications.index')
                         ->with('success', 'Заявка ОТЗ успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OtzApplication $otzApplication)
    {
        $otzApplication->delete();

        return redirect()->route('admin.admin.otz-applications.index')
                         ->with('success', 'Заявка ОТЗ успешно удалена');
    }

    /**
     * Загрузка документов для этапа
     */
    public function uploadDocuments(Request $request, OtzApplication $otzApplication)
    {
        $request->validate([
            'stage' => ['required', Rule::in(OtzApplication::getStages())],
            'documents' => 'required|array',
            'documents.*' => 'file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        $stage = $request->stage;
        $stageProgress = $otzApplication->stage_progress ?? [];
        
        if (!isset($stageProgress[$stage])) {
            $stageProgress[$stage] = [
                'completed' => false,
                'start_date' => null,
                'end_date' => null,
                'documents' => []
            ];
        }

        $uploadedDocuments = [];
        foreach ($request->file('documents') as $file) {
            $path = $file->store('otz-documents/' . $otzApplication->id . '/' . $stage, 'public');
            $uploadedDocuments[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'uploaded_at' => now()->toDateString()
            ];
        }

        $stageProgress[$stage]['documents'] = array_merge(
            $stageProgress[$stage]['documents'] ?? [],
            $uploadedDocuments
        );

        $otzApplication->update(['stage_progress' => $stageProgress]);

        return response()->json([
            'success' => true,
            'message' => 'Документы успешно загружены',
            'documents' => $uploadedDocuments
        ]);
    }

    /**
     * Удаление документа
     */
    public function deleteDocument(Request $request, OtzApplication $otzApplication)
    {
        $request->validate([
            'stage' => ['required', Rule::in(OtzApplication::getStages())],
            'document_index' => 'required|integer|min:0',
        ]);

        $stage = $request->stage;
        $documentIndex = $request->document_index;
        $stageProgress = $otzApplication->stage_progress ?? [];

        if (isset($stageProgress[$stage]['documents'][$documentIndex])) {
            $document = $stageProgress[$stage]['documents'][$documentIndex];
            
            // Удаляем файл
            if (Storage::disk('public')->exists($document['path'])) {
                Storage::disk('public')->delete($document['path']);
            }

            // Удаляем из массива
            unset($stageProgress[$stage]['documents'][$documentIndex]);
            $stageProgress[$stage]['documents'] = array_values($stageProgress[$stage]['documents']);

            $otzApplication->update(['stage_progress' => $stageProgress]);

            return response()->json([
                'success' => true,
                'message' => 'Документ успешно удален'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Документ не найден'
        ], 404);
    }
}
