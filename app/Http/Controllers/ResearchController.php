<?php

namespace App\Http\Controllers;

use App\Models\Research;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResearchController extends Controller
{
    /**
     * Display a listing of the researches.
     */
    public function index()
    {
        $researches = Research::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('ResearchHub/Index', [
            'researches' => $researches,
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Display the specified research.
     */
    public function show($slug)
    {
        $research = Research::with([
            'indicators',
            'dashboards',
            'files',
            'infographics' => function ($query) {
                $query->where('is_active', true);
            }
        ])->where('slug', $slug)
          ->where('is_active', true)
          ->firstOrFail();

        return Inertia::render('ResearchHub/Show', [
            'research' => $research,
            'locale' => app()->getLocale(),
        ]);
    }
}
