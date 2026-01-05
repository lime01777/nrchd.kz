<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClinicRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_ru' => 'required|string|max:255',
            'name_kk' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'short_desc_ru' => 'nullable|string|max:1000',
            'short_desc_kk' => 'nullable|string|max:1000',
            'short_desc_en' => 'nullable|string|max:1000',
            'full_desc_ru' => 'nullable|string',
            'full_desc_kk' => 'nullable|string',
            'full_desc_en' => 'nullable|string',
            'city_ru' => 'nullable|string|max:255',
            'city_kk' => 'nullable|string|max:255',
            'city_en' => 'nullable|string|max:255',
            'address_ru' => 'nullable|string|max:500',
            'address_kk' => 'nullable|string|max:500',
            'address_en' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'working_hours_ru' => 'nullable|array',
            'working_hours_kk' => 'nullable|array',
            'working_hours_en' => 'nullable|array',
            'specialties_ru' => 'nullable|array',
            'specialties_ru.*' => 'string|max:255',
            'specialties_kk' => 'nullable|array',
            'specialties_kk.*' => 'string|max:255',
            'specialties_en' => 'nullable|array',
            'specialties_en.*' => 'string|max:255',
            'services_ru' => 'nullable|array',
            'services_ru.*' => 'string|max:255',
            'services_kk' => 'nullable|array',
            'services_kk.*' => 'string|max:255',
            'services_en' => 'nullable|array',
            'services_en.*' => 'string|max:255',
            'accreditations_ru' => 'nullable|array',
            'accreditations_ru.*' => 'string|max:255',
            'accreditations_kk' => 'nullable|array',
            'accreditations_kk.*' => 'string|max:255',
            'accreditations_en' => 'nullable|array',
            'accreditations_en.*' => 'string|max:255',
            'equipment_ru' => 'nullable|array',
            'equipment_ru.*' => 'string|max:255',
            'equipment_kk' => 'nullable|array',
            'equipment_kk.*' => 'string|max:255',
            'equipment_en' => 'nullable|array',
            'equipment_en.*' => 'string|max:255',
            'map_lat' => 'nullable|numeric|between:-90,90',
            'map_lng' => 'nullable|numeric|between:-180,180',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'hero' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gallery_files' => 'nullable|array',
            'gallery_files.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_published' => 'boolean',
            'publish_at' => 'nullable|date',
            'seo_title_ru' => 'nullable|string|max:255',
            'seo_title_kk' => 'nullable|string|max:255',
            'seo_title_en' => 'nullable|string|max:255',
            'seo_desc_ru' => 'nullable|string|max:500',
            'seo_desc_kk' => 'nullable|string|max:500',
            'seo_desc_en' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name_ru.required' => 'Название на русском языке обязательно для заполнения',
            'name_ru.max' => 'Название на русском языке не может быть длиннее 255 символов',
            'email.email' => 'Введите корректный email адрес',
            'website.url' => 'Введите корректный URL сайта',
            'map_lat.between' => 'Широта должна быть в диапазоне от -90 до 90',
            'map_lng.between' => 'Долгота должна быть в диапазоне от -180 до 180',
            'logo.image' => 'Логотип должен быть изображением',
            'logo.mimes' => 'Логотип должен быть в формате: jpeg, png, jpg, gif, webp',
            'logo.max' => 'Размер логотипа не должен превышать 2MB',
            'hero.image' => 'Главное изображение должно быть изображением',
            'hero.mimes' => 'Главное изображение должно быть в формате: jpeg, png, jpg, gif, webp',
            'hero.max' => 'Размер главного изображения не должен превышать 2MB',
            'gallery_files.*.image' => 'Все файлы в галерее должны быть изображениями',
            'gallery_files.*.mimes' => 'Изображения в галерее должны быть в формате: jpeg, png, jpg, gif, webp',
            'gallery_files.*.max' => 'Размер каждого изображения в галерее не должен превышать 2MB',
        ];
    }
}
