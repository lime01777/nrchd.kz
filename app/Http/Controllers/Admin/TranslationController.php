<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TranslationService;
use App\Models\StoredTranslation;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TranslationController extends Controller
{
    /**
     * Показать панель управления переводами
     */
    public function index()
    {
        $stats = TranslationService::getTranslationStats();
        
        return Inertia::render('Admin/Translations/Index', [
            'stats' => $stats,
            'languages' => ['en', 'kz'],
            'recentTranslations' => StoredTranslation::latest()
                                                    ->limit(50)
                                                    ->get()
                                                    ->groupBy('target_language')
        ]);
    }

    /**
     * Запустить массовый перевод всего контента
     */
    public function translateAll(Request $request)
    {
        $request->validate([
            'target_language' => 'required|in:en,kz'
        ]);

        $targetLanguage = $request->target_language;
        $stats = [
            'total_found' => 0,
            'already_translated' => 0,
            'newly_translated' => 0,
            'errors' => 0
        ];

        try {
            // Собираем тексты из новостей
            $newsTexts = $this->extractNewsTexts();
            $stats['total_found'] += count($newsTexts);

            // Собираем тексты из других источников
            $otherTexts = $this->extractOtherTexts();
            $stats['total_found'] += count($otherTexts);

            // Объединяем все тексты
            $allTexts = array_merge($newsTexts, $otherTexts);

            foreach ($allTexts as $text) {
                // Пропускаем пустые тексты и HTML теги
                if (empty(trim($text)) || strlen(trim($text)) < 3) {
                    continue;
                }

                // Проверяем есть ли уже перевод
                if (TranslationService::hasTranslation($text, $targetLanguage)) {
                    $stats['already_translated']++;
                    continue;
                }

                // Переводим текст
                try {
                    $translated = TranslationService::translate($text, $targetLanguage, url()->current());
                    if ($translated !== $text) {
                        $stats['newly_translated']++;
                    }
                } catch (\Exception $e) {
                    Log::error('Ошибка перевода текста: ' . $e->getMessage(), [
                        'text' => substr($text, 0, 100),
                        'target_language' => $targetLanguage
                    ]);
                    $stats['errors']++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Массовый перевод завершен',
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка массового перевода: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при массовом переводе: ' . $e->getMessage(),
                'stats' => $stats
            ], 500);
        }
    }

    /**
     * Извлечь тексты из новостей
     */
    private function extractNewsTexts(): array
    {
        $texts = [];
        
        News::chunk(100, function ($news) use (&$texts) {
            foreach ($news as $item) {
                // Заголовки
                if (!empty($item->title)) {
                    $texts[] = $item->title;
                }

                // Контент (очищаем от HTML и берем предложения)
                if (!empty($item->content)) {
                    $cleanContent = strip_tags($item->content);
                    $sentences = preg_split('/[.!?]+/', $cleanContent, -1, PREG_SPLIT_NO_EMPTY);
                    
                    foreach ($sentences as $sentence) {
                        $sentence = trim($sentence);
                        if (strlen($sentence) > 10) {
                            $texts[] = $sentence;
                        }
                    }
                }

                // Категории
                if (is_array($item->category)) {
                    foreach ($item->category as $category) {
                        if (!empty($category)) {
                            $texts[] = $category;
                        }
                    }
                } elseif (!empty($item->category)) {
                    $texts[] = $item->category;
                }
            }
        });

        return array_unique($texts);
    }

    /**
     * Извлечь тексты из других источников (меню, статические тексты и т.д.)
     */
    private function extractOtherTexts(): array
    {
        // Здесь можно добавить извлечение текстов из других моделей
        // Пока возвращаем базовые тексты интерфейса
        return [
            'Главная',
            'О центре',
            'Новости',
            'Услуги',
            'Документы',
            'Контакты',
            'Поиск',
            'Читать далее',
            'Подробнее',
            'Назад',
            'Далее',
            'Сохранить',
            'Отмена',
            'Редактировать',
            'Удалить',
            'Добавить',
            'Опубликовано',
            'Черновик',
            'Дата публикации',
            'Категория',
            'Просмотры',
            'Администрирование',
            'Пользователи',
            'Настройки'
        ];
    }

    /**
     * Получить переводы для конкретной страницы
     */
    public function getPageTranslations(Request $request)
    {
        $request->validate([
            'page_url' => 'required|string',
            'target_language' => 'required|in:en,kz'
        ]);

        $translations = TranslationService::getPageTranslations(
            $request->page_url,
            $request->target_language
        );

        return response()->json([
            'success' => true,
            'translations' => $translations
        ]);
    }

    /**
     * Удалить перевод
     */
    public function deleteTranslation(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:stored_translations,id'
        ]);

        try {
            StoredTranslation::destroy($request->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Перевод удален'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка удаления: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Обновить перевод
     */
    public function updateTranslation(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:stored_translations,id',
            'translated_text' => 'required|string',
            'is_verified' => 'boolean'
        ]);

        try {
            $translation = StoredTranslation::findOrFail($request->id);
            $translation->update([
                'translated_text' => $request->translated_text,
                'is_verified' => $request->is_verified ?? false
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Перевод обновлен'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка обновления: ' . $e->getMessage()
            ], 500);
        }
    }
}