<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Здесь будет логика получения списка документов
        // Пока возвращаем тестовые данные
        $documents = [
            [
                'id' => 1,
                'title' => 'Стратегия развития здравоохранения',
                'category' => 'medical-education',
                'file' => 'strategy.pdf',
                'created_at' => '2024-03-15',
                'downloads' => 45
            ],
            [
                'id' => 2,
                'title' => 'Отчет о медицинских исследованиях',
                'category' => 'medical-science',
                'file' => 'report.pdf',
                'created_at' => '2024-03-10',
                'downloads' => 32
            ],
            [
                'id' => 3,
                'title' => 'Руководство по лекарственной политике',
                'category' => 'drug-policy',
                'file' => 'guidelines.pdf',
                'created_at' => '2024-03-05',
                'downloads' => 78
            ],
        ];

        // Категории документов
        $categories = [
            'medical-education' => 'Медицинское образование',
            'human-resources' => 'Кадровые ресурсы',
            'drug-policy' => 'Лекарственная политика',
            'medical-science' => 'Медицинская наука',
            'medical-rating' => 'Рейтинг медицинских организаций',
        ];

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Documents/Edit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Валидация данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        // Здесь будет логика сохранения документа в базу данных и загрузки файла

        return redirect()->route('admin.documents')->with('success', 'Документ успешно создан');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Здесь будет логика получения документа по ID
        // Пока возвращаем тестовые данные
        $document = [
            'id' => $id,
            'title' => 'Тестовый документ',
            'category' => 'medical-education',
            'description' => 'Описание тестового документа',
            'file' => 'test.pdf'
        ];

        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Валидация данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        // Здесь будет логика обновления документа в базе данных и загрузки файла

        return redirect()->route('admin.documents')->with('success', 'Документ успешно обновлен');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Здесь будет логика удаления документа из базы данных и удаления файла

        return redirect()->route('admin.documents')->with('success', 'Документ успешно удален');
    }
}
