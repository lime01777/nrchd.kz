<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Services\Translation\TranslationService;

/** API: словарь и массовое обеспечение ключей. */
class TranslationController extends Controller {
    public function __construct(private readonly TranslationService $svc) {}

    public function dictionary(Request $request, string $locale) {
        return response()->json([
            'locale' => $locale,
            'data' => $this->svc->dictionary($locale, $request->query('namespace'), $request->query('context')),
        ]);
    }

    public function ensure(Request $request) {
        $v = $request->validate([
            'keys' => 'required|array|min:1', 'keys.*' => 'string',
            'locale' => 'required|string', 'namespace' => 'nullable|string', 'context' => 'nullable|string',
        ]);
        $this->svc->ensureKeys($v['keys'], $v['locale'], $v['namespace'] ?? null, $v['context'] ?? null);
        return response()->json(['ok' => true]);
    }
}