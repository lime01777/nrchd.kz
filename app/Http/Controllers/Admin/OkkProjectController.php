<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OkkProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class OkkProjectController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:КП,ОТЗ',
            'status' => 'nullable|string'
        ]);

        // Формируем формат: [Название]_[Дата]
        $folderName = $validated['name'] . '_' . now()->format('Y-m-d');
        
        $basePath = 'Клинические протоколы/Комиссия по клиническим протоколам/Материалы для ОКК МЗ РК';
        $subFolder = $validated['type'] === 'КП' ? 'Проекты КП' : 'Проекты ОТЗ';
        
        $relativePath = $basePath . '/' . $subFolder . '/' . $folderName;
        $absolutePath = public_path('storage/' . $relativePath);

        // Создаем физическую папку
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        // Создаем запись в БД
        $project = OkkProject::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'folder_path' => $relativePath,
            'status' => $validated['status'] ?? 'Ознакомление',
        ]);

        return response()->json([
            'success' => true,
            'project' => $project,
            'folder_path' => $relativePath
        ]);
    }

    public function updateStatus(Request $request, OkkProject $project)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'meeting_time' => 'nullable|date'
        ]);

        $project->update($validated);

        // Если статус "На публикацию", перемещаем папку в Архив
        if ($project->status === 'На публикацию') {
            $currentPath = public_path('storage/' . $project->folder_path);
            
            // Получаем базовый путь (без подпапок Проекты КП/ОТЗ)
            $baseParts = explode('/', $project->folder_path);
            $folderName = array_pop($baseParts); // Имя папки проекта
            $subFolder = array_pop($baseParts); // Проекты КП или Проекты ОТЗ
            $basePath = implode('/', $baseParts); // Материалы для ОКК МЗ РК ...
            
            $archiveRelPath = $basePath . '/Архив/' . $folderName;
            $archiveAbsPath = public_path('storage/' . $archiveRelPath);
            
            if (File::exists($currentPath)) {
                $archiveParentDir = public_path('storage/' . $basePath . '/Архив');
                if (!File::exists($archiveParentDir)) {
                    File::makeDirectory($archiveParentDir, 0755, true);
                }
                
                File::move($currentPath, $archiveAbsPath);
                
                // Обновляем путь в БД
                $project->update(['folder_path' => $archiveRelPath]);
            }
        }

        return response()->json(['success' => true, 'project' => $project]);
    }

    public function getQuestions(OkkProject $project)
    {
        return response()->json([
            'questions' => $project->questions()->orderBy('sort_order')->get()
        ]);
    }

    public function saveQuestions(Request $request, OkkProject $project)
    {
        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'nullable|exists:okk_questions,id',
            'questions.*.text' => 'required|string',
            'questions.*.is_active' => 'boolean',
            'questions.*.sort_order' => 'integer',
        ]);

        $existingIds = $project->questions()->pluck('id')->toArray();
        $newIds = [];

        foreach ($validated['questions'] as $q) {
            if (!empty($q['id']) && in_array($q['id'], $existingIds)) {
                $project->questions()->find($q['id'])->update($q);
                $newIds[] = $q['id'];
            } else {
                $newQuestion = $project->questions()->create($q);
                $newIds[] = $newQuestion->id;
            }
        }

        // Удаляем те, которые не пришли в запросе
        $project->questions()->whereNotIn('id', $newIds)->delete();

        return response()->json(['success' => true]);
    }
}
