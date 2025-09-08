<?php
namespace App\Services\Translation;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Тонкий HTTP-клиент DeepL. Документация: https://www.deepl.com/docs-api
 */
class DeepLClient {
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl,
    ) {}

    /**
     * Перевод массива строк на целевой язык (например, 'RU','KK','EN').
     * @param array<int,string> $texts
     * @return array<int,string>
     */
    public function translate(array $texts, string $targetLang, ?string $sourceLang = null): array {
        if (empty($texts)) return [];

        $endpoint = rtrim($this->baseUrl, '/').'/v2/translate';
        $payload = ['target_lang' => strtoupper($targetLang)];
        if ($sourceLang) $payload['source_lang'] = strtoupper($sourceLang);

        $resp = Http::withHeaders([
            'Authorization' => 'DeepL-Auth-Key '.$this->apiKey,
        ])->asForm()->post($endpoint, $payload + ['text' => $texts]);

        if (!$resp->successful()) {
            throw new RuntimeException('DeepL error: '.$resp->status().' '.$resp->body());
        }
        $data = $resp->json();
        return collect($data['translations'] ?? [])->pluck('text')->all();
    }
}
