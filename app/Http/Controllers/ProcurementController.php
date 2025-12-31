<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Контроллер для получения данных о госзакупках
 * Парсит данные с сайта goszakup.gov.kz и возвращает структурированный JSON
 */
class ProcurementController extends Controller
{
    /**
     * Получить данные о планах закупок
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProcurements(Request $request)
    {
        try {
            // URL для получения планов закупок центра (ID заказчика: 110340017483)
            $procurementUrl = 'https://goszakup.gov.kz/ru/registry/plan?filter%5Bcustomer%5D=110340017483';
            
            // Используем кэш на 1 час, чтобы не делать много запросов
            $cacheKey = 'procurements_' . md5($procurementUrl);
            $cachedData = Cache::get($cacheKey);
            
            if ($cachedData) {
                return response()->json($cachedData);
            }
            
            // Делаем HTTP запрос к сайту госзакупок
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                ])
                ->get($procurementUrl);
            
            if (!$response->successful()) {
                Log::error('Ошибка при получении данных о закупках: ' . $response->status());
                return response()->json([
                    'error' => 'Не удалось получить данные о закупках',
                    'procurements' => []
                ], 500);
            }
            
            $html = $response->body();
            
            // Парсим HTML и извлекаем данные о закупках
            $procurements = $this->parseProcurements($html);
            
            // Кэшируем результат на 1 час
            Cache::put($cacheKey, $procurements, now()->addHour());
            
            return response()->json($procurements);
            
        } catch (\Exception $e) {
            Log::error('Исключение при получении данных о закупках: ' . $e->getMessage());
            return response()->json([
                'error' => 'Произошла ошибка при получении данных о закупках',
                'procurements' => []
            ], 500);
        }
    }
    
    /**
     * Парсит HTML и извлекает данные о закупках
     * 
     * @param string $html
     * @return array
     */
    private function parseProcurements($html)
    {
        $procurements = [];
        
        try {
            // Используем DOMDocument для парсинга HTML
            libxml_use_internal_errors(true);
            $dom = new \DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            libxml_clear_errors();
            
            $xpath = new \DOMXPath($dom);
            
            // Ищем ссылки на планы закупок (более надежный способ)
            $links = $xpath->query("//a[contains(@href, '/registry/show_plan/')]");
            
            foreach ($links as $link) {
                $href = $link->getAttribute('href');
                $text = trim($link->textContent);
                
                if (!empty($text) && !empty($href)) {
                    // Находим родительскую строку таблицы
                    $parentRow = $link;
                    while ($parentRow && $parentRow->nodeName !== 'tr' && $parentRow->parentNode) {
                        $parentRow = $parentRow->parentNode;
                    }
                    
                    if ($parentRow && $parentRow->nodeName === 'tr') {
                        $cells = $parentRow->getElementsByTagName('td');
                        
                        // Пытаемся извлечь данные из ячеек таблицы
                        $procurement = [
                            'name' => $text,
                            'link' => $this->normalizeUrl($href),
                            'customer' => 'РГП на ПХВ "Национальный научный центр развития здравоохранения имени Салидат Каирбековой"',
                            'method' => '',
                            'amount' => '',
                            'status' => '',
                            'date' => '',
                        ];
                        
                        // Пытаемся найти данные в соседних ячейках
                        if ($cells->length >= 4) {
                            // Обычно структура: номер, заказчик, название (ссылка), способ, сумма, статус, дата
                            for ($i = 0; $i < $cells->length; $i++) {
                                $cellText = trim($cells->item($i)->textContent);
                                
                                // Определяем тип данных по содержимому
                                if (empty($procurement['method']) && (
                                    stripos($cellText, 'запрос') !== false ||
                                    stripos($cellText, 'конкурс') !== false ||
                                    stripos($cellText, 'аукцион') !== false ||
                                    stripos($cellText, 'тендер') !== false
                                )) {
                                    $procurement['method'] = $cellText;
                                } elseif (empty($procurement['amount']) && (
                                    preg_match('/[\d\s,]+\.?\d*\s*(тенге|тг|KZT)/iu', $cellText) ||
                                    preg_match('/\d{1,3}(?:\s?\d{3})*(?:\s?\d{3})*(?:\.\d{2})?/', $cellText)
                                )) {
                                    $procurement['amount'] = $cellText;
                                } elseif (empty($procurement['status']) && (
                                    stripos($cellText, 'состоялся') !== false ||
                                    stripos($cellText, 'не состоялся') !== false ||
                                    stripos($cellText, 'договор') !== false ||
                                    stripos($cellText, 'заявка') !== false
                                )) {
                                    $procurement['status'] = $cellText;
                                } elseif (empty($procurement['date']) && (
                                    preg_match('/\d{1,2}\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/iu', $cellText) ||
                                    preg_match('/\d{4}-\d{2}-\d{2}/', $cellText)
                                )) {
                                    $procurement['date'] = $cellText;
                                }
                            }
                        }
                        
                        $procurements[] = $procurement;
                    } else {
                        // Если не нашли строку таблицы, все равно добавляем с минимальными данными
                        $procurements[] = [
                            'name' => $text,
                            'link' => $this->normalizeUrl($href),
                            'customer' => 'РГП на ПХВ "Национальный научный центр развития здравоохранения имени Салидат Каирбековой"',
                            'method' => '',
                            'amount' => '',
                            'status' => '',
                            'date' => '',
                        ];
                    }
                }
            }
            
            // Если не нашли через ссылки, пробуем парсить таблицу напрямую
            if (empty($procurements)) {
                $rows = $xpath->query("//table//tr[position()>1]");
                
                foreach ($rows as $row) {
                    $cells = $row->getElementsByTagName('td');
                    
                    if ($cells->length >= 3) {
                        // Ищем ссылку в ячейках
                        $linkNode = null;
                        $linkIndex = -1;
                        for ($i = 0; $i < $cells->length; $i++) {
                            $linkNodes = $cells->item($i)->getElementsByTagName('a');
                            if ($linkNodes->length > 0) {
                                $linkNode = $linkNodes->item(0);
                                $linkIndex = $i;
                                break;
                            }
                        }
                        
                        if ($linkNode) {
                            $href = $linkNode->getAttribute('href');
                            $text = trim($linkNode->textContent);
                            
                            if (!empty($text) && !empty($href)) {
                                $procurements[] = [
                                    'name' => $text,
                                    'link' => $this->normalizeUrl($href),
                                    'customer' => $this->getCellText($cells->item(1)),
                                    'method' => $this->getCellText($cells->item(3)),
                                    'amount' => $this->getCellText($cells->item(4)),
                                    'status' => $this->getCellText($cells->item(5)) ?? '',
                                    'date' => $this->getCellText($cells->item(6)) ?? '',
                                ];
                            }
                        }
                    }
                }
            }
            
        } catch (\Exception $e) {
            Log::error('Ошибка при парсинге HTML закупок: ' . $e->getMessage());
            Log::error('Трассировка: ' . $e->getTraceAsString());
        }
        
        return [
            'procurements' => $procurements,
            'total' => count($procurements)
        ];
    }
    
    /**
     * Получает текст из ячейки таблицы
     * 
     * @param \DOMNode $cell
     * @return string
     */
    private function getCellText($cell)
    {
        if (!$cell) {
            return '';
        }
        
        return trim(preg_replace('/\s+/', ' ', $cell->textContent));
    }
    
    /**
     * Получает ссылку из ячейки таблицы
     * 
     * @param \DOMNode $cell
     * @return string
     */
    private function getCellLink($cell)
    {
        if (!$cell) {
            return '';
        }
        
        $links = $cell->getElementsByTagName('a');
        if ($links->length > 0) {
            $href = $links->item(0)->getAttribute('href');
            return $this->normalizeUrl($href);
        }
        
        return '';
    }
    
    /**
     * Нормализует URL (добавляет домен, если нужно)
     * 
     * @param string $url
     * @return string
     */
    private function normalizeUrl($url)
    {
        if (empty($url)) {
            return '';
        }
        
        // Если относительная ссылка, добавляем домен
        if (strpos($url, 'http') !== 0) {
            if (strpos($url, '/') === 0) {
                return 'https://goszakup.gov.kz' . $url;
            }
            return 'https://goszakup.gov.kz/' . $url;
        }
        
        return $url;
    }
}

