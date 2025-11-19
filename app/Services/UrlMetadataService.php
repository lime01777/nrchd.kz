<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use DOMDocument;
use DOMXPath;

/**
 * Сервис для парсинга метаданных из URL (Open Graph, Twitter Cards, обычные мета-теги)
 */
class UrlMetadataService
{
    /**
     * Парсит метаданные из URL
     * 
     * @param string $url URL для парсинга
     * @return array Массив с метаданными: title, description, image, url
     */
    public function parseUrl(string $url): array
    {
        try {
            // Валидация URL
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                throw new \InvalidArgumentException('Некорректный URL');
            }

            // Получаем HTML контент
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                ])
                ->get($url);

            if (!$response->successful()) {
                throw new \Exception('Не удалось загрузить страницу: ' . $response->status());
            }

            $html = $response->body();

            // Парсим HTML
            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
            libxml_clear_errors();

            $xpath = new DOMXPath($dom);

            // Извлекаем метаданные
            $metadata = [
                'title' => $this->getTitle($xpath, $dom),
                'description' => $this->getDescription($xpath),
                'image' => $this->getImage($xpath, $url),
                'url' => $url,
            ];

            return $metadata;
        } catch (\Exception $e) {
            Log::error('Ошибка парсинга URL', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            // Возвращаем базовые данные
            return [
                'title' => $this->extractDomain($url),
                'description' => null,
                'image' => null,
                'url' => $url,
            ];
        }
    }

    /**
     * Извлекает заголовок страницы
     */
    private function getTitle(DOMXPath $xpath, DOMDocument $dom): ?string
    {
        // Пробуем Open Graph title
        $ogTitle = $xpath->query("//meta[@property='og:title']/@content");
        if ($ogTitle->length > 0) {
            return trim($ogTitle->item(0)->nodeValue);
        }

        // Пробуем Twitter Card title
        $twitterTitle = $xpath->query("//meta[@name='twitter:title']/@content");
        if ($twitterTitle->length > 0) {
            return trim($twitterTitle->item(0)->nodeValue);
        }

        // Пробуем обычный title
        $titleTags = $dom->getElementsByTagName('title');
        if ($titleTags->length > 0) {
            return trim($titleTags->item(0)->nodeValue);
        }

        return null;
    }

    /**
     * Извлекает описание страницы
     */
    private function getDescription(DOMXPath $xpath): ?string
    {
        // Пробуем Open Graph description
        $ogDesc = $xpath->query("//meta[@property='og:description']/@content");
        if ($ogDesc->length > 0) {
            return trim($ogDesc->item(0)->nodeValue);
        }

        // Пробуем Twitter Card description
        $twitterDesc = $xpath->query("//meta[@name='twitter:description']/@content");
        if ($twitterDesc->length > 0) {
            return trim($twitterDesc->item(0)->nodeValue);
        }

        // Пробуем обычный meta description
        $metaDesc = $xpath->query("//meta[@name='description']/@content");
        if ($metaDesc->length > 0) {
            return trim($metaDesc->item(0)->nodeValue);
        }

        return null;
    }

    /**
     * Извлекает изображение страницы
     */
    private function getImage(DOMXPath $xpath, string $baseUrl): ?string
    {
        // Пробуем Open Graph image
        $ogImage = $xpath->query("//meta[@property='og:image']/@content");
        if ($ogImage->length > 0) {
            $imageUrl = trim($ogImage->item(0)->nodeValue);
            return $this->makeAbsoluteUrl($imageUrl, $baseUrl);
        }

        // Пробуем Twitter Card image
        $twitterImage = $xpath->query("//meta[@name='twitter:image']/@content");
        if ($twitterImage->length > 0) {
            $imageUrl = trim($twitterImage->item(0)->nodeValue);
            return $this->makeAbsoluteUrl($imageUrl, $baseUrl);
        }

        // Пробуем первое изображение из статьи
        $firstImage = $xpath->query("//img[@src][1]/@src");
        if ($firstImage->length > 0) {
            $imageUrl = trim($firstImage->item(0)->nodeValue);
            return $this->makeAbsoluteUrl($imageUrl, $baseUrl);
        }

        return null;
    }

    /**
     * Преобразует относительный URL в абсолютный
     */
    private function makeAbsoluteUrl(string $url, string $baseUrl): string
    {
        // Если уже абсолютный URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        // Если начинается с //
        if (strpos($url, '//') === 0) {
            $parsed = parse_url($baseUrl);
            return ($parsed['scheme'] ?? 'https') . ':' . $url;
        }

        // Если начинается с /
        if (strpos($url, '/') === 0) {
            $parsed = parse_url($baseUrl);
            return ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? '') . $url;
        }

        // Относительный путь
        $basePath = dirname(parse_url($baseUrl, PHP_URL_PATH) ?: '/');
        $parsed = parse_url($baseUrl);
        return ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? '') . $basePath . '/' . $url;
    }

    /**
     * Извлекает домен из URL
     */
    private function extractDomain(string $url): string
    {
        $parsed = parse_url($url);
        return $parsed['host'] ?? $url;
    }
}

