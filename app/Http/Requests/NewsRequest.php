<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        // Преобразуем content в body для обратной совместимости
        if ($this->has('content') && !$this->has('body')) {
            $this->merge(['body' => $this->input('content')]);
        }
        
        // Определяем, является ли это материалом СМИ
        $isMedia = $this->input('type') === 'media' || $this->input('section') === 'media';
        
        $rules = [
            // Для СМИ заголовок необязателен, если есть external_url
            'title' => $isMedia ? 'nullable|string|max:255' : 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/i', // Только буквы, цифры и дефисы
                Rule::unique('news', 'slug')->ignore($this->route('news')?->id),
            ],
            'excerpt' => 'nullable|string|max:1000',
            'body' => 'nullable|string|min:10', // Для СМИ может быть пустым
            'content' => 'nullable|string|min:10', // Для обратной совместимости
            'cover' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:min_width=800,min_height=400',
            'cover_image_alt' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published',
            'type' => 'nullable|string|in:news,media',
            'external_url' => 'nullable|url|max:512',
            'published_at' => 'nullable|date',
            'media' => 'nullable',
            'section' => 'nullable|string|in:news,media',
        ];

        $allowedCategories = config('news.categories', []);
        $categoryRules = ['nullable', 'array', 'max:5'];
        $categoryItemRules = ['string', 'max:100'];
        if (!empty($allowedCategories)) {
            $categoryItemRules[] = Rule::in($allowedCategories);
        }
        $rules['category'] = $categoryRules;
        $rules['category.*'] = $categoryItemRules;

        // Для материалов СМИ body необязателен
        if ($this->input('type') === 'media' || $this->input('section') === 'media') {
            $rules['body'] = 'nullable|string|min:10';
        }

        // Для обновления некоторые поля необязательны
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = 'sometimes|required|string|max:255';
            // Для СМИ body необязателен даже при обновлении
            if ($this->input('type') !== 'media' && $this->input('section') !== 'media') {
                $rules['body'] = 'sometimes|nullable|string|min:10';
            }
            $rules['cover'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:min_width=800,min_height=400';
            $rules['category'] = array_merge(['sometimes'], $categoryRules);
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
            'category.array' => 'Категории должны быть переданы в виде списка.',
            'category.max' => 'Нельзя выбрать больше 5 категорий.',
            'category.*.max' => 'Название категории не должно превышать 100 символов.',
            'category.*.in' => 'Выбрана недопустимая категория.',
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
            'category' => 'категории',
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
            $isMedia = $this->input('type') === 'media' || $this->input('section') === 'media';
            
            // Для материалов СМИ: если нет заголовка, но есть external_url, используем домен как заголовок
            if ($isMedia && empty($this->input('title')) && !empty($this->input('external_url'))) {
                try {
                    $url = parse_url($this->input('external_url'));
                    $domain = $url['host'] ?? 'Материал из СМИ';
                    $this->merge(['title' => $domain]);
                } catch (\Exception $e) {
                    $this->merge(['title' => 'Материал из СМИ']);
                }
            }
            
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
