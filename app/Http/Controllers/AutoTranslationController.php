<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use App\Services\AutoTranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AutoTranslationController extends Controller
{
    protected $autoTranslationService;

    public function __construct(AutoTranslationService $autoTranslationService)
    {
        $this->autoTranslationService = $autoTranslationService;
    }

    /**
     * Перевести текст и сохранить в базе данных
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function translate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string',
            'source_language' => 'required|string|size:2',
            'content_type' => 'nullable|string|max:50',
            'content_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $text = $request->input('text');
            $sourceLanguage = $request->input('source_language', 'ru');
            $contentType = $request->input('content_type', 'general');
            $contentId = $request->input('content_id');

            // Переводим и сохраняем в базе
            $translations = $this->autoTranslationService->translateAndStore(
                $text,
                $sourceLanguage,
                $contentType,
                $contentId
            );

            // Логируем успешный перевод
            Log::channel('windsurf')->info('Text translated and stored', [
                'text_length' => strlen($text),
                'source_language' => $sourceLanguage,
                'target_languages' => array_keys(array_diff_key($translations, [$sourceLanguage => '']))
            ]);

            return response()->json([
                'translations' => $translations,
                'source_language' => $sourceLanguage
            ]);
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Translation error: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при переводе: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Получить сохраненный перевод из базы данных
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getTranslation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string',
            'source_language' => 'required|string|size:2',
            'target_language' => 'required|string|size:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $text = $request->input('text');
            $sourceLanguage = $request->input('source_language');
            $targetLanguage = $request->input('target_language');

            $translation = $this->autoTranslationService->getStoredTranslation(
                $text,
                $sourceLanguage,
                $targetLanguage
            );

            if ($translation) {
                return response()->json([
                    'text' => $text,
                    'source_language' => $sourceLanguage,
                    'target_language' => $targetLanguage,
                    'translation' => $translation,
                    'from_cache' => true
                ]);
            }

            // Если перевод не найден, сделаем и сохраним новый
            $translations = $this->autoTranslationService->translateAndStore(
                $text,
                $sourceLanguage
            );

            return response()->json([
                'text' => $text,
                'source_language' => $sourceLanguage,
                'target_language' => $targetLanguage,
                'translation' => $translations[$targetLanguage] ?? $text,
                'from_cache' => false
            ]);
            
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Error retrieving translation: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при получении перевода: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Перевести и сохранить массив текстов
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function bulkTranslate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.text' => 'required|string',
            'items.*.key' => 'required|string',
            'source_language' => 'required|string|size:2',
            'content_type' => 'nullable|string|max:50',
            'content_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $items = $request->input('items');
            $sourceLanguage = $request->input('source_language', 'ru');
            $contentType = $request->input('content_type', 'general');
            $contentId = $request->input('content_id');

            $results = [];

            foreach ($items as $item) {
                $text = $item['text'];
                $key = $item['key'];

                // Переводим и сохраняем
                $translations = $this->autoTranslationService->translateAndStore(
                    $text,
                    $sourceLanguage,
                    $contentType,
                    $contentId
                );

                $results[$key] = $translations;
            }

            Log::channel('windsurf')->info('Bulk translation completed', [
                'items_count' => count($items),
                'content_type' => $contentType,
                'content_id' => $contentId
            ]);

            return response()->json([
                'results' => $results,
                'source_language' => $sourceLanguage
            ]);
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Bulk translation error: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при массовом переводе: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Получить все переводы для конкретного контента
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getContentTranslations(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content_type' => 'required|string|max:50',
            'content_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $contentType = $request->input('content_type');
            $contentId = $request->input('content_id');

            $translations = Translation::getContentTranslations($contentType, $contentId);

            return response()->json([
                'translations' => $translations,
                'content_type' => $contentType,
                'content_id' => $contentId,
                'count' => count($translations)
            ]);
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Error retrieving content translations: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при получении переводов: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Обновление существующего перевода
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTranslation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'original_text' => 'required|string',
            'source_language' => 'required|string|size:2',
            'target_language' => 'required|string|size:2',
            'translated_text' => 'required|string',
            'content_type' => 'nullable|string',
            'content_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $translation = Translation::where('original_text', $request->input('original_text'))
                ->where('source_language', $request->input('source_language'))
                ->where('target_language', $request->input('target_language'))
                ->when($request->has('content_type'), function ($query) use ($request) {
                    return $query->where('content_type', $request->input('content_type'));
                })
                ->when($request->has('content_id'), function ($query) use ($request) {
                    return $query->where('content_id', $request->input('content_id'));
                })
                ->first();

            if ($translation) {
                $translation->translated_text = $request->input('translated_text');
                $translation->save();
            } else {
                // Если перевод не найден, создаем новый
                $translation = new Translation();
                $translation->original_text = $request->input('original_text');
                $translation->source_language = $request->input('source_language');
                $translation->target_language = $request->input('target_language');
                $translation->translated_text = $request->input('translated_text');
                $translation->content_type = $request->input('content_type');
                $translation->content_id = $request->input('content_id');
                $translation->save();
            }

            Log::channel('windsurf')->info('Translation updated successfully', [
                'original_text' => substr($request->input('original_text'), 0, 100),
                'target_language' => $request->input('target_language'),
                'content_type' => $request->input('content_type'),
                'content_id' => $request->input('content_id'),
            ]);

            return response()->json(['message' => 'Перевод успешно обновлен'], 200);
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Error updating translation: ' . $e->getMessage());

            return response()->json(['error' => 'Ошибка при обновлении перевода: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Удаление перевода
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteTranslation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'original_text' => 'required|string',
            'content_type' => 'nullable|string',
            'content_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $deleted = Translation::where('original_text', $request->input('original_text'))
                ->when($request->has('content_type'), function ($query) use ($request) {
                    return $query->where('content_type', $request->input('content_type'));
                })
                ->when($request->has('content_id'), function ($query) use ($request) {
                    return $query->where('content_id', $request->input('content_id'));
                })
                ->delete();

            if ($deleted) {
                Log::channel('windsurf')->info('Translation deleted successfully', [
                    'original_text' => substr($request->input('original_text'), 0, 100),
                    'content_type' => $request->input('content_type'),
                    'content_id' => $request->input('content_id'),
                ]);

                return response()->json(['message' => 'Перевод успешно удален'], 200);
            } else {
                return response()->json(['message' => 'Перевод не найден'], 404);
            }
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Error deleting translation: ' . $e->getMessage());

            return response()->json(['error' => 'Ошибка при удалении перевода: ' . $e->getMessage()], 500);
        }
    }
}
