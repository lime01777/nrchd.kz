<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Research;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResearchHubController extends Controller
{
    public function index()
    {
        $researches = Research::orderBy('sort_order')->paginate(10);
        
        return Inertia::render('Admin/ResearchHub/Index', [
            'researches' => $researches
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ResearchHub/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:researches',
            'description' => 'nullable|string',
            'sample' => 'nullable|string',
            'geography' => 'nullable|string|max:255',
            'period' => 'nullable|string|max:255',
            'methodology' => 'nullable|string',
            'citation_rules' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $research = Research::create($validated);
        
        $this->syncRelations($request, $research);

        return redirect()->route('admin.research-hub.index')->with('success', 'Исследование добавлено');
    }

    public function show(Research $research)
    {
        return Inertia::render('Admin/ResearchHub/Show', [
            'research' => $research->load(['indicators', 'dashboards', 'files', 'infographics'])
        ]);
    }

    public function edit(Research $research)
    {
        return Inertia::render('Admin/ResearchHub/Edit', [
            'research' => $research->load(['indicators', 'dashboards', 'files', 'infographics'])
        ]);
    }

    public function update(Request $request, Research $research)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:researches,slug,' . $research->id,
            'description' => 'nullable|string',
            'sample' => 'nullable|string',
            'geography' => 'nullable|string|max:255',
            'period' => 'nullable|string|max:255',
            'methodology' => 'nullable|string',
            'citation_rules' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $research->update($validated);
        
        $this->syncRelations($request, $research);

        return redirect()->route('admin.research-hub.index')->with('success', 'Исследование обновлено');
    }

    private function syncRelations(Request $request, Research $research)
    {
        if ($request->has('indicators')) {
            $research->indicators()->delete();
            $indicators = $request->input('indicators', []);
            foreach ($indicators as $idx => $item) {
                if (!empty($item['name'])) {
                    $research->indicators()->create([
                        'name' => $item['name'],
                        'definition' => $item['definition'] ?? null,
                        'sort_order' => $item['sort_order'] ?? $idx,
                    ]);
                }
            }
        }

        if ($request->has('dashboards')) {
            $research->dashboards()->delete();
            $dashboards = $request->input('dashboards', []);
            foreach ($dashboards as $idx => $item) {
                if (!empty($item['title'])) {
                    $research->dashboards()->create([
                        'title' => $item['title'],
                        'embed_url' => $item['embed_url'] ?? null,
                        'type' => $item['type'] ?? 'trend',
                        'description' => $item['description'] ?? null,
                        'sort_order' => $item['sort_order'] ?? $idx,
                    ]);
                }
            }
        }

        if ($request->has('files')) {
            $research->files()->delete();
            $files = $request->input('files', []);
            foreach ($files as $idx => $item) {
                if (!empty($item['title']) && !empty($item['file_path'])) {
                    $research->files()->create([
                        'title' => $item['title'],
                        'category' => $item['category'] ?? 'other',
                        'file_path' => $item['file_path'],
                        'file_type' => $item['file_type'] ?? null,
                        'sort_order' => $item['sort_order'] ?? $idx,
                    ]);
                }
            }
        }
        
        if ($request->has('infographics')) {
            $research->infographics()->delete();
            $infographics = $request->input('infographics', []);
            foreach ($infographics as $idx => $item) {
                if (!empty($item['title'])) {
                    $research->infographics()->create([
                        'title' => $item['title'],
                        'image_path' => $item['image_path'] ?? null,
                        'pdf_path' => $item['pdf_path'] ?? null,
                        'attributes' => $item['attributes'] ?? null,
                        'is_active' => $item['is_active'] ?? true,
                        'sort_order' => $item['sort_order'] ?? $idx,
                    ]);
                }
            }
        }
    }

    public function destroy(Research $research)
    {
        $research->delete();
        return redirect()->route('admin.research-hub.index')->with('success', 'Исследование удалено');
    }
}
