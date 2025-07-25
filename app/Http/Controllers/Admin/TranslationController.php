<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TranslationController extends Controller
{
    /**
     * Display a listing of the translations.
     */
    public function index(Request $request)
    {
        $query = Translation::query();
        
        // Filter by group if provided
        if ($request->has('group')) {
            $query->where('group', $request->group);
        }
        
        // Filter by search term if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('ru', 'like', "%{$search}%")
                  ->orWhere('en', 'like', "%{$search}%")
                  ->orWhere('kk', 'like', "%{$search}%");
            });
        }
        
        // Get all unique groups for the dropdown filter
        $groups = Translation::select('group')->distinct()->pluck('group');
        
        // Paginate results
        $translations = $query->paginate(20);
        
        return Inertia::render('Admin/Translations/Index', [
            'translations' => $translations,
            'groups' => $groups,
            'filters' => $request->only(['search', 'group']),
        ]);
    }

    /**
     * Show the form for creating a new translation.
     */
    public function create()
    {
        $groups = Translation::select('group')->distinct()->pluck('group');
        
        return Inertia::render('Admin/Translations/Create', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created translation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'group' => 'required|string|max:255',
            'ru' => 'required|string',
            'en' => 'nullable|string',
            'kk' => 'nullable|string',
        ]);
        
        $translation = Translation::updateOrCreate(
            ['key' => $validated['key'], 'group' => $validated['group']],
            $validated
        );
        
        // Clear cache for this translation
        Translation::clearCache($validated['key'], $validated['group']);
        
        return redirect()->route('admin.translations.index')
            ->with('success', 'Translation created successfully.');
    }

    /**
     * Show the form for editing the specified translation.
     */
    public function edit(Translation $translation)
    {
        $groups = Translation::select('group')->distinct()->pluck('group');
        
        return Inertia::render('Admin/Translations/Edit', [
            'translation' => $translation,
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified translation.
     */
    public function update(Request $request, Translation $translation)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'group' => 'required|string|max:255',
            'ru' => 'required|string',
            'en' => 'nullable|string',
            'kk' => 'nullable|string',
        ]);
        
        // Check if the key or group has changed
        $oldKey = $translation->key;
        $oldGroup = $translation->group;
        $keyOrGroupChanged = $oldKey !== $validated['key'] || $oldGroup !== $validated['group'];
        
        // Update the translation
        $translation->update($validated);
        
        // Clear cache for both the old and new key/group if they have changed
        Translation::clearCache($validated['key'], $validated['group']);
        if ($keyOrGroupChanged) {
            Translation::clearCache($oldKey, $oldGroup);
        }
        
        return redirect()->route('admin.translations.index')
            ->with('success', 'Translation updated successfully.');
    }

    /**
     * Remove the specified translation.
     */
    public function destroy(Translation $translation)
    {
        // Clear cache before deleting
        Translation::clearCache($translation->key, $translation->group);
        
        $translation->delete();
        
        return redirect()->route('admin.translations.index')
            ->with('success', 'Translation deleted successfully.');
    }

    /**
     * Auto-translate missing translations for a specific translation record.
     */
    public function autoTranslate(Translation $translation)
    {
        try {
            // Make sure we have the Russian text to translate from
            if (!$translation->ru) {
                return redirect()->route('admin.translations.edit', $translation)
                    ->with('error', 'Russian text is required for auto-translation.');
            }
            
            $updated = false;
            
            // Auto-translate to English if missing
            if (!$translation->en) {
                $translation->en = TranslationService::translateText($translation->ru, 'ru', 'en');
                $updated = true;
            }
            
            // Auto-translate to Kazakh if missing
            if (!$translation->kk) {
                $translation->kk = TranslationService::translateText($translation->ru, 'ru', 'kk');
                $updated = true;
            }
            
            if ($updated) {
                $translation->save();
                
                // Clear cache for this translation
                Translation::clearCache($translation->key, $translation->group);
                
                return redirect()->route('admin.translations.edit', $translation)
                    ->with('success', 'Translation auto-translated successfully.');
            }
            
            return redirect()->route('admin.translations.edit', $translation)
                ->with('info', 'No translations were missing.');
            
        } catch (\Exception $e) {
            Log::error('Error auto-translating: ' . $e->getMessage());
            
            return redirect()->route('admin.translations.edit', $translation)
                ->with('error', 'Failed to auto-translate: ' . $e->getMessage());
        }
    }

    /**
     * Auto-translate all missing translations for a specific group.
     */
    public function autoTranslateGroup(Request $request)
    {
        $group = $request->input('group');
        
        if (!$group) {
            return redirect()->route('admin.translations.index')
                ->with('error', 'Group is required for auto-translation.');
        }
        
        try {
            $translations = Translation::where('group', $group)->get();
            $translatedCount = 0;
            
            foreach ($translations as $translation) {
                if (!$translation->ru) {
                    continue; // Skip if no Russian text
                }
                
                $updated = false;
                
                // Auto-translate to English if missing
                if (!$translation->en) {
                    $translation->en = TranslationService::translateText($translation->ru, 'ru', 'en');
                    $updated = true;
                }
                
                // Auto-translate to Kazakh if missing
                if (!$translation->kk) {
                    $translation->kk = TranslationService::translateText($translation->ru, 'ru', 'kk');
                    $updated = true;
                }
                
                if ($updated) {
                    $translation->save();
                    $translatedCount++;
                }
            }
            
            // Clear cache for the entire group
            Translation::clearCache(null, $group);
            
            return redirect()->route('admin.translations.index', ['group' => $group])
                ->with('success', "Auto-translated {$translatedCount} translations in group '{$group}'.");
            
        } catch (\Exception $e) {
            Log::error('Error auto-translating group: ' . $e->getMessage());
            
            return redirect()->route('admin.translations.index', ['group' => $group])
                ->with('error', 'Failed to auto-translate group: ' . $e->getMessage());
        }
    }
}
