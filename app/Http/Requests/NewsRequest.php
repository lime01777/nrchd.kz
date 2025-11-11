<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * FormRequest для валидации данных новостей
 */
class NewsRequest extends FormRequest
{
    /**
     * Определяет, авторизован ли пользователь для выполнения запроса
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Проверка прав доступа выполняется через политику в контроллере
    }

    /**
     * Правила валидации
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $this->route('news')?->id,
            'excerpt' => 'nullable|string|max:1000',
            'body' => 'required|string|min:10',
            'cover' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:min_width=800,min_height=400',
            'cover_image_alt' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published',
            'type' => 'nullable|string|in:news,media',
            'published_at' => 'nullable|date',
            'media' => 'nullable',
            'section' => 'nullable|string|in:news,media',
        ];

        // Для обновления некоторые поля необязательны
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = 'sometimes|required|string|max:255';
            $rules['body'] = 'sometimes|required|string|min:10';
            $rules['cover'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:min_width=800,min_height=400';
        }

        return $rules;
    }

    /**
     * Сообщения об ошибках валидации на русском языке
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Заголовок новости обязателен для заполнения.',
            'title.max' => 'Заголовок не должен превышать 255 символов.',
            'slug.unique' => 'Такой URL-адрес уже используется. Пожалуйста, выберите другой.',
            'slug.max' => 'URL-адрес не должен превышать 255 символов.',
            'excerpt.max' => 'Краткое описание не должно превышать 1000 символов.',
            'body.required' => 'Содержимое новости обязательно для заполнения.',
            'body.min' => 'Содержимое должно содержать минимум 10 символов.',
            'cover.image' => 'Обложка должна быть изображением.',
            'cover.mimes' => 'Обложка должна быть в формате: jpg, jpeg, png или webp.',
            'cover.max' => 'Размер обложки не должен превышать 5 МБ.',
            'cover.dimensions' => 'Минимальный размер обложки: 800×400 пикселей.',
            'cover_image_alt.max' => 'Альтернативный текст не должен превышать 255 символов.',
            'seo_title.max' => 'SEO заголовок не должен превышать 255 символов.',
            'seo_description.max' => 'SEO описание не должно превышать 255 символов.',
            'status.required' => 'Статус новости обязателен для заполнения.',
            'status.in' => 'Недопустимый статус новости. Допустимые значения: draft, published.',
            'published_at.date' => 'Дата публикации должна быть корректной датой.',
            'type.in' => 'Недопустимый тип публикации.',
            'section.in' => 'Недопустимый раздел для новости.',
        ];
    }

    /**
     * Названия атрибутов для сообщений об ошибках
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'заголовок',
            'slug' => 'URL-адрес',
            'excerpt' => 'краткое описание',
            'body' => 'содержимое',
            'cover' => 'обложка',
            'cover_image_alt' => 'альтернативный текст обложки',
            'seo_title' => 'SEO заголовок',
            'seo_description' => 'SEO описание',
            'status' => 'статус',
            'published_at' => 'дата публикации',
            'type' => 'тип публикации',
            'section' => 'раздел',
        ];
    }

    /**
     * Дополнительная валидация после основных правил
     *
     * @param \Illuminate\Contracts\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Для опубликованных новостей рекомендуется указать дату публикации
            if ($this->input('status') === 'published' && !$this->input('published_at')) {
                // Автоматически устанавливаем текущую дату, если не указана
                $this->merge(['published_at' => now()]);
            }

            // Если статус "опубликовано", дата публикации не должна быть в будущем (если указана)
            if ($this->input('status') === 'published' && $this->input('published_at')) {
                $publishedAt = \Carbon\Carbon::parse($this->input('published_at'));
                if ($publishedAt->isFuture()) {
                    $validator->errors()->add('published_at', 'Дата публикации не может быть в будущем для опубликованных новостей.');
                }
            }
        });
    }
}
