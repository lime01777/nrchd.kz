<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedTechDocument;
use App\Models\MedTechRegistry;
use App\Models\MedTechPilotSite;
use App\Models\MedTechContent;
use Illuminate\Http\Request;

class MedTechController extends Controller
{
    /**
     * Получить все данные для платформы MedTech
     */
    public function getPlatformData()
    {
        $documents = MedTechDocument::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'description' => $doc->description,
                    'type' => $doc->type,
                    'file_url' => $doc->file_url,
                    'file_name' => $doc->file_name,
                ];
            });

        $registry = MedTechRegistry::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
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
                ];
            });

        $pilotSites = MedTechPilotSite::where('is_active', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->map(function ($site) {
                return [
                    'id' => $site->id,
                    'name' => $site->name,
                    'city' => $site->city,
                    'region' => $site->region,
                    'profile' => $site->profile,
                    'description' => $site->description,
                    'technologies' => $site->technologies,
                ];
            });

        // Получаем контент для алгоритма
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

        $algorithmImage = MedTechContent::where('section', 'algorithm')
            ->where('key', 'image')
            ->first();

        return [
            'documents' => $documents,
            'registry' => $registry,
            'pilot_sites' => $pilotSites,
            'content' => [
                'algorithm_steps' => $algorithmSteps,
                'algorithm_indicators' => $algorithmIndicators,
            ],
            'algorithm_image' => $algorithmImage ? $algorithmImage->image_url : null,
        ];
    }
}
