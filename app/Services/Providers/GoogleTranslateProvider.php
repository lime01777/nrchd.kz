<?php

namespace App\Services\Providers;

use App\Contracts\TranslateProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Провайдер перевода через Google Translate API
 */
class GoogleTranslateProvider implements TranslateProvider
{
    protected string $apiKey;
    protected string $apiUrl = 'https://translation.googleapis.com/language/translate/v2';

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?? config('services.google.translate_api_key', '');
        
        if (empty($this->apiKey)) {
            Log::warning('Google Translate API key not configured');
        }
    }

    /**
     * Перевести текст
     */
    public function translate(string $text, string $from, string $to): string
    {
        if (empty($text)) {
            return $text;
        }
        
        if ($from === $to) {
            return $text;
        }
        
        if (empty($this->apiKey)) {
            throw new RuntimeException('Google Translate API key is not configured');
        }

        try {
            // Конвертируем коды языков для Google API (kk вместо kz)
            $sourceCode = $this->convertLanguageCode($from);
            $targetCode = $this->convertLanguageCode($to);

            $response = Http::timeout(30)->post($this->apiUrl, [
                'q' => $text,
                'source' => $sourceCode,
                'target' => $targetCode,
                'key' => $this->apiKey,
                'format' => 'text'
            ]);

            if (!$response->successful()) {
                throw new RuntimeException(
                    "Google Translate API error: {$response->status()} - {$response->body()}"
                );
            }

            $data = $response->json();

            if (!isset($data['data']['translations'][0]['translatedText'])) {
                throw new RuntimeException('Invalid response from Google Translate API');
            }

            return $data['data']['translations'][0]['translatedText'];
            
        } catch (\Exception $e) {
            Log::error('Google Translate error', [
                'text' => substr($text, 0, 100),
                'from' => $from,
                'to' => $to,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException("Translation failed: {$e->getMessage()}", 0, $e);
        }
    }

    /**
     * Массовый перевод
     */
    public function translateBatch(array $texts, string $from, string $to): array
    {
        if (empty($texts)) {
            return [];
        }
        
        if ($from === $to) {
            return $texts;
        }
        
        if (empty($this->apiKey)) {
            throw new RuntimeException('Google Translate API key is not configured');
        }

        try {
            $sourceCode = $this->convertLanguageCode($from);
            $targetCode = $this->convertLanguageCode($to);

            // Google API поддерживает массивы в параметре q
            $response = Http::timeout(60)->post($this->apiUrl, [
                'q' => $texts,
                'source' => $sourceCode,
                'target' => $targetCode,
                'key' => $this->apiKey,
                'format' => 'text'
            ]);

            if (!$response->successful()) {
                throw new RuntimeException(
                    "Google Translate API error: {$response->status()} - {$response->body()}"
                );
            }

            $data = $response->json();

            if (!isset($data['data']['translations'])) {
                throw new RuntimeException('Invalid response from Google Translate API');
            }

            return array_map(
                fn($translation) => $translation['translatedText'] ?? '',
                $data['data']['translations']
            );
            
        } catch (\Exception $e) {
            Log::error('Google Translate batch error', [
                'count' => count($texts),
                'from' => $from,
                'to' => $to,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException("Batch translation failed: {$e->getMessage()}", 0, $e);
        }
    }

    /**
     * Конвертировать коды языков для Google API
     */
    protected function convertLanguageCode(string $code): string
    {
        return match($code) {
            'kk' => 'kk',  // Казахский
            'ru' => 'ru',  // Русский
            'en' => 'en',  // Английский
            default => $code,
        };
    }
}

