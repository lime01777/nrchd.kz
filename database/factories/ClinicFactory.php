<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ClinicFactory extends Factory
{
    protected $model = Clinic::class;

    public function definition()
    {
        $name = $this->faker->company . ' Medical Center';
        
        return [
            'name_ru' => $name,
            'name_kk' => $name,
            'name_en' => $name,
            'short_desc_ru' => $this->faker->sentence(10),
            'short_desc_kk' => $this->faker->sentence(10),
            'short_desc_en' => $this->faker->sentence(10),
            'full_desc_ru' => $this->faker->paragraphs(3, true),
            'full_desc_kk' => $this->faker->paragraphs(3, true),
            'full_desc_en' => $this->faker->paragraphs(3, true),
            'city_ru' => $this->faker->randomElement(['Астана', 'Алматы', 'Шымкент', 'Актобе', 'Караганда']),
            'city_kk' => $this->faker->randomElement(['Астана', 'Алматы', 'Шымкент', 'Актобе', 'Караганда']),
            'city_en' => $this->faker->randomElement(['Astana', 'Almaty', 'Shymkent', 'Aktobe', 'Karaganda']),
            'address_ru' => $this->faker->address,
            'address_kk' => $this->faker->address,
            'address_en' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->email,
            'website' => $this->faker->url,
            'working_hours_ru' => [
                'Понедельник - Пятница' => '08:00 - 18:00',
                'Суббота' => '09:00 - 16:00',
                'Воскресенье' => '10:00 - 14:00'
            ],
            'working_hours_kk' => [
                'Дүйсенбі - Жұма' => '08:00 - 18:00',
                'Сенбі' => '09:00 - 16:00',
                'Жексенбі' => '10:00 - 14:00'
            ],
            'working_hours_en' => [
                'Monday - Friday' => '08:00 - 18:00',
                'Saturday' => '09:00 - 16:00',
                'Sunday' => '10:00 - 14:00'
            ],
            'specialties_ru' => $this->faker->randomElements([
                'Кардиология', 'Неврология', 'Ортопедия', 'Гинекология', 
                'Онкология', 'Педиатрия', 'Терапия', 'Хирургия'
            ], $this->faker->numberBetween(2, 4)),
            'specialties_kk' => $this->faker->randomElements([
                'Кардиология', 'Неврология', 'Ортопедия', 'Гинекология', 
                'Онкология', 'Педиатрия', 'Терапия', 'Хирургия'
            ], $this->faker->numberBetween(2, 4)),
            'specialties_en' => $this->faker->randomElements([
                'Cardiology', 'Neurology', 'Orthopedics', 'Gynecology', 
                'Oncology', 'Pediatrics', 'Therapy', 'Surgery'
            ], $this->faker->numberBetween(2, 4)),
            'services_ru' => $this->faker->randomElements([
                'ЭКГ', 'УЗИ', 'МРТ', 'КТ', 'Лабораторные анализы', 
                'Консультации', 'Диагностика', 'Лечение'
            ], $this->faker->numberBetween(3, 6)),
            'services_kk' => $this->faker->randomElements([
                'ЭКГ', 'УЗИ', 'МРТ', 'КТ', 'Зертханалық талдаулар', 
                'Кеңес беру', 'Диагностика', 'Емдеу'
            ], $this->faker->numberBetween(3, 6)),
            'services_en' => $this->faker->randomElements([
                'ECG', 'Ultrasound', 'MRI', 'CT', 'Laboratory tests', 
                'Consultations', 'Diagnostics', 'Treatment'
            ], $this->faker->numberBetween(3, 6)),
            'accreditations_ru' => $this->faker->randomElements([
                'ISO 9001', 'JCI', 'Министерство здравоохранения РК'
            ], $this->faker->numberBetween(1, 3)),
            'accreditations_kk' => $this->faker->randomElements([
                'ISO 9001', 'JCI', 'ҚР Денсаулық сақтау министрлігі'
            ], $this->faker->numberBetween(1, 3)),
            'accreditations_en' => $this->faker->randomElements([
                'ISO 9001', 'JCI', 'Ministry of Health of RK'
            ], $this->faker->numberBetween(1, 3)),
            'equipment_ru' => $this->faker->randomElements([
                'МРТ 3.0 Тесла', 'КТ 128 срезов', 'УЗИ экспертного класса',
                'Рентген аппарат', 'Эндоскоп'
            ], $this->faker->numberBetween(2, 4)),
            'equipment_kk' => $this->faker->randomElements([
                'МРТ 3.0 Тесла', 'КТ 128 кесінді', 'Эксперттік классты УЗИ',
                'Рентген аппараты', 'Эндоскоп'
            ], $this->faker->numberBetween(2, 4)),
            'equipment_en' => $this->faker->randomElements([
                'MRI 3.0 Tesla', 'CT 128 slices', 'Expert class ultrasound',
                'X-ray machine', 'Endoscope'
            ], $this->faker->numberBetween(2, 4)),
            'map_lat' => $this->faker->latitude,
            'map_lng' => $this->faker->longitude,
            'logo_path' => null,
            'hero_path' => null,
            'gallery' => [],
            'is_published' => $this->faker->boolean(80),
            'publish_at' => $this->faker->optional()->dateTimeBetween('-1 month', '+1 month'),
            'seo_title_ru' => $this->faker->sentence,
            'seo_title_kk' => $this->faker->sentence,
            'seo_title_en' => $this->faker->sentence,
            'seo_desc_ru' => $this->faker->sentence(10),
            'seo_desc_kk' => $this->faker->sentence(10),
            'seo_desc_en' => $this->faker->sentence(10),
        ];
    }

    public function published()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_published' => true,
                'publish_at' => now(),
            ];
        });
    }

    public function unpublished()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_published' => false,
                'publish_at' => null,
            ];
        });
    }
}
