<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\YouthHealthCenter;
use Illuminate\Http\Request;

class YouthHealthCenterApiController extends Controller
{
    /**
     * Получить все активные МЦЗ для отображения на карте
     */
    public function index(Request $request)
    {
        $query = YouthHealthCenter::active();

        // Фильтр по региону если указан
        if ($request->has('region') && !empty($request->region)) {
            $query->byRegion($request->region);
        }

        $centers = $query->orderBy('region')
            ->orderBy('name')
            ->get()
            ->map(function ($center) {
                return [
                    'id' => $center->id,
                    'name' => $center->name,
                    'org' => $center->organization,
                    'address' => $center->address,
                    'region' => $center->region,
                    'position' => [
                        floatval($center->latitude),
                        floatval($center->longitude)
                    ],
                ];
            });

        return response()->json($centers);
    }

    /**
     * Получить список всех регионов
     */
    public function regions()
    {
        $regions = YouthHealthCenter::active()
            ->distinct()
            ->pluck('region')
            ->sort()
            ->values();

        return response()->json($regions);
    }
}

