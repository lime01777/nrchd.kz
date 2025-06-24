<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoredTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TranslationManagerController extends Controller
{
    /**
     * Отображает страницу управления переводами в админке
     */
    public function index()
    {
        // Проверка прав доступа (если нужно)
        // $this->authorize('manage-translations');
        
        return Inertia::render('Admin/Translations/TranslationManager');
    }
    
    /**
     * Возвращает статистику переводов по языкам
     */
    public function getStats()
    {
        $stats = [
            'ru' => [
                'count' => StoredTranslation::where('target_language', 'ru')->count(),
                'lastUpdated' => StoredTranslation::where('target_language', 'ru')
                    ->latest('updated_at')
                    ->value('updated_at')
            ],
            'kz' => [
                'count' => StoredTranslation::where('target_language', 'kz')->count(),
                'lastUpdated' => StoredTranslation::where('target_language', 'kz')
                    ->latest('updated_at')
                    ->value('updated_at')
            ],
            'en' => [
                'count' => StoredTranslation::where('target_language', 'en')->count(),
                'lastUpdated' => StoredTranslation::where('target_language', 'en')
                    ->latest('updated_at')
                    ->value('updated_at')
            ]
        ];
        
        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }
    
    /**
     * Возвращает список URL сайта для перевода
     */
    public function getSiteUrls()
    {
        // Здесь нужно реализовать логику получения всех URL сайта
        // Например, из карты сайта, из роутов или из базы данных
        
        // Для примера, возвращаем фиксированный список самых важных страниц
        $urls = [
            '/',
            '/about-centre',
            '/services/accreditation',
            '/services/post-accreditation-monitoring',
            '/direction/medical-statistics',
            '/direction/uch',
            '/direction/human-capital',
            '/contacts'
        ];
        
        return response()->json([
            'success' => true,
            'urls' => $urls
        ]);
    }
    
    /**
     * Переводит содержимое страницы и сохраняет переводы
     */
    public function translatePage(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'target_language' => 'required|string|in:ru,kz,en'
        ]);
        
        $url = $request->input('url');
        $targetLanguage = $request->input('target_language');
        
        try {
            // Логика получения контента с указанной страницы
            // Можно использовать HTTP-клиент для запроса к своему же сайту
            
            // Здесь имитируем результаты перевода
            $translations = $this->getPageContent($url, $targetLanguage);
            
            $savedCount = 0;
            
            // Сохраняем переводы в базу данных
            foreach ($translations as $original => $translated) {
                if (empty($original) || empty($translated) || $original === $translated) {
                    continue;
                }
                
                $hash = StoredTranslation::generateHash($original, $targetLanguage);
                
                // Проверяем, существует ли уже такой перевод
                $existingTranslation = StoredTranslation::where('hash', $hash)
                    ->where('target_language', $targetLanguage)
                    ->first();
                
                if ($existingTranslation) {
                    // Обновляем URL страницы
                    $existingTranslation->page_url = $url;
                    $existingTranslation->save();
                } else {
                    // Создаем новый перевод
                    StoredTranslation::create([
                        'original_text' => $original,
                        'translated_text' => $translated,
                        'target_language' => $targetLanguage,
                        'hash' => $hash,
                        'page_url' => $url,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    
                    $savedCount++;
                }
            }
            
            Log::info("Переведено и сохранено $savedCount текстов для URL: $url на язык: $targetLanguage");
            
            return response()->json([
                'success' => true,
                'message' => "Переведено и сохранено $savedCount текстов",
                'url' => $url,
                'target_language' => $targetLanguage
            ]);
        } catch (\Exception $e) {
            Log::error('Ошибка при переводе страницы', [
                'url' => $url,
                'target_language' => $targetLanguage,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при переводе страницы: ' . $e->getMessage(),
                'url' => $url
            ], 500);
        }
    }
    
    /**
     * Удаляет все переводы для указанного языка
     */
    public function clearTranslations(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:ru,kz,en'
        ]);
        
        $language = $request->input('language');
        
        try {
            $deletedCount = StoredTranslation::where('target_language', $language)->delete();
            
            Log::info("Удалено $deletedCount переводов для языка: $language");
            
            return response()->json([
                'success' => true,
                'deleted_count' => $deletedCount,
                'language' => $language
            ]);
        } catch (\Exception $e) {
            Log::error('Ошибка при удалении переводов', [
                'language' => $language,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при удалении переводов: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Получает контент страницы и его переводы
     * В реальной реализации здесь будет запрос к переводческому API
     */
    private function getPageContent($url, $targetLanguage)
    {
        // Примечание: эта функция должна быть заменена на реальное получение
        // содержимого страницы и использование API перевода
        
        // Тестовые данные для демонстрации
        $demoContent = [
            'Главная' => ['ru' => 'Главная', 'kz' => 'Басты бет', 'en' => 'Home'],
            'О центре' => ['ru' => 'О центре', 'kz' => 'Орталық туралы', 'en' => 'About Center'],
            'Направления деятельности' => ['ru' => 'Направления деятельности', 'kz' => 'Қызмет бағыттары', 'en' => 'Areas of activity'],
            'Услуги' => ['ru' => 'Услуги', 'kz' => 'Қызметтер', 'en' => 'Services'],
            'Контакты' => ['ru' => 'Контакты', 'kz' => 'Байланыстар', 'en' => 'Contacts'],
            'Новости' => ['ru' => 'Новости', 'kz' => 'Жаңалықтар', 'en' => 'News'],
            'Документы' => ['ru' => 'Документы', 'kz' => 'Құжаттар', 'en' => 'Documents'],
            'Национальный научный центр развития здравоохранения' => [
                'ru' => 'Национальный научный центр развития здравоохранения', 
                'kz' => 'Денсаулық сақтауды дамытудың ұлттық ғылыми орталығы', 
                'en' => 'National Scientific Center for Health Development'
            ]
        ];
        
        // Возвращаем только для целевого языка
        $result = [];
        foreach ($demoContent as $original => $translations) {
            if (isset($translations[$targetLanguage])) {
                $result[$original] = $translations[$targetLanguage];
            }
        }
        
        return $result;
    }
}
