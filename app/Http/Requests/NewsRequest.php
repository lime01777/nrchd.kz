<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Services\MediaService;

class NewsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // В реальном проекте здесь должна быть проверка прав
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|array|min:1',
            'category.*' => 'string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|string|in:draft,scheduled,published,archived',
            'publish_date' => 'nullable|date',
            'media' => 'nullable|array|max:20',
            'media.*' => 'nullable|array',
            'media.*.id' => 'nullable|string',
            'media.*.path' => 'nullable|string',
            'media.*.type' => 'nullable|string|in:image,video',
            'media.*.name' => 'nullable|string',
            'media.*.size' => 'nullable|integer',
            'media.*.is_cover' => 'nullable|boolean',
            'media.*.position' => 'nullable|integer',
            'media_files' => 'nullable|array|max:10',
            'media_files.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,avi,mov,wmv,flv,webm,ogg|max:' . MediaService::MAX_FILE_SIZE,
        ];

        // Для обновления новости делаем некоторые поля необязательными
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = 'sometimes|required|string|max:255';
            $rules['content'] = 'sometimes|required|string|min:10';
            $rules['category'] = 'sometimes|required|array|min:1';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Заголовок новости обязателен',
            'title.max' => 'Заголовок не должен превышать 255 символов',
            'content.required' => 'Содержимое новости обязательно',
            'content.min' => 'Содержимое должно содержать минимум 10 символов',
            'category.required' => 'Необходимо выбрать хотя бы одну категорию',
            'category.array' => 'Категории должны быть массивом',
            'category.min' => 'Необходимо выбрать хотя бы одну категорию',
            'category.*.string' => 'Каждая категория должна быть строкой',
            'category.*.max' => 'Название категории не должно превышать 100 символов',
            'tags.array' => 'Теги должны быть массивом',
            'tags.*.string' => 'Каждый тег должен быть строкой',
            'tags.*.max' => 'Тег не должен превышать 50 символов',
            'status.required' => 'Статус новости обязателен',
            'status.in' => 'Недопустимый статус новости',
            'publish_date.date' => 'Дата публикации должна быть корректной датой',
            'media.array' => 'Медиа должны быть массивом',
            'media.max' => 'Максимум 20 медиа файлов',
            'media.*.type.in' => 'Тип медиа должен быть image или video',
            'media_files.array' => 'Файлы должны быть массивом',
            'media_files.max' => 'Максимум 10 файлов за раз',
            'media_files.*.file' => 'Загружаемый элемент должен быть файлом',
            'media_files.*.mimes' => 'Неподдерживаемый тип файла. Разрешены: jpeg, png, jpg, gif, webp, mp4, avi, mov, wmv, flv, webm, ogg',
            'media_files.*.max' => 'Файл слишком большой. Максимальный размер: ' . MediaService::MAX_FILE_SIZE . 'KB',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'заголовок',
            'content' => 'содержимое',
            'category' => 'категории',
            'tags' => 'теги',
            'status' => 'статус',
            'publish_date' => 'дата публикации',
            'media' => 'медиа файлы',
            'media_files' => 'новые файлы',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Дополнительная валидация для запланированных новостей
            if ($this->input('status') === 'scheduled' && !$this->input('publish_date')) {
                $validator->errors()->add('publish_date', 'Для запланированных новостей необходимо указать дату публикации');
            }

            // Для запланированных новостей дата должна быть в будущем
            if ($this->input('status') === 'scheduled' && $this->input('publish_date')) {
                $publishDate = \Carbon\Carbon::parse($this->input('publish_date'));
                if ($publishDate->isPast()) {
                    $validator->errors()->add('publish_date', 'Для запланированных новостей дата публикации должна быть в будущем');
                }
            }

            // Проверяем, что есть хотя бы одно медиа или контент достаточно длинный
            $mediaCount = count($this->input('media', []));
            $mediaFilesCount = count($this->input('media_files', []));
            $contentLength = strlen(strip_tags($this->input('content', '')));

            if ($mediaCount === 0 && $mediaFilesCount === 0 && $contentLength < 100) {
                $validator->errors()->add('content', 'Новость должна содержать либо медиа файлы, либо достаточно длинный текст (минимум 100 символов)');
            }

            // Проверяем уникальность тегов
            $tags = $this->input('tags', []);
            if (count($tags) !== count(array_unique($tags))) {
                $validator->errors()->add('tags', 'Теги не должны повторяться');
            }

            // Проверяем уникальность категорий
            $categories = $this->input('category', []);
            if (count($categories) !== count(array_unique($categories))) {
                $validator->errors()->add('category', 'Категории не должны повторяться');
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Нормализуем данные перед валидацией
        $this->merge([
            'tags' => $this->normalizeTags($this->input('tags', [])),
            'category' => $this->normalizeCategories($this->input('category', [])),
        ]);
    }

    /**
     * Нормализовать теги
     */
    private function normalizeTags(array $tags): array
    {
        return array_filter(array_map(function ($tag) {
            if (is_string($tag)) {
                return trim($tag);
            }
            return null;
        }, $tags));
    }

    /**
     * Нормализовать категории
     */
    private function normalizeCategories(array $categories): array
    {
        return array_filter(array_map(function ($category) {
            if (is_string($category)) {
                return trim($category);
            }
            return null;
        }, $categories));
    }
}
