<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            
            // Основная информация
            $table->string('slug')->unique()->index();
            $table->string('name_ru')->index();
            $table->string('name_kk')->nullable()->index();
            $table->string('name_en')->nullable()->index();
            
            // Описания
            $table->text('short_desc_ru')->nullable();
            $table->text('short_desc_kk')->nullable();
            $table->text('short_desc_en')->nullable();
            $table->longText('full_desc_ru')->nullable();
            $table->longText('full_desc_kk')->nullable();
            $table->longText('full_desc_en')->nullable();
            
            // Локация
            $table->string('city_ru')->nullable();
            $table->string('city_kk')->nullable();
            $table->string('city_en')->nullable();
            $table->string('address_ru')->nullable();
            $table->string('address_kk')->nullable();
            $table->string('address_en')->nullable();
            
            // Контакты
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            
            // Рабочие часы (JSON)
            $table->json('working_hours_ru')->nullable();
            $table->json('working_hours_kk')->nullable();
            $table->json('working_hours_en')->nullable();
            
            // Специализации, услуги, аккредитации, оборудование (JSON массивы)
            $table->json('specialties_ru')->nullable();
            $table->json('specialties_kk')->nullable();
            $table->json('specialties_en')->nullable();
            $table->json('services_ru')->nullable();
            $table->json('services_kk')->nullable();
            $table->json('services_en')->nullable();
            $table->json('accreditations_ru')->nullable();
            $table->json('accreditations_kk')->nullable();
            $table->json('accreditations_en')->nullable();
            $table->json('equipment_ru')->nullable();
            $table->json('equipment_kk')->nullable();
            $table->json('equipment_en')->nullable();
            
            // Координаты карты
            $table->decimal('map_lat', 10, 7)->nullable();
            $table->decimal('map_lng', 10, 7)->nullable();
            
            // Изображения
            $table->string('logo_path')->nullable();
            $table->string('hero_path')->nullable();
            $table->json('gallery')->nullable(); // Массив путей к изображениям
            
            // Статус публикации
            $table->boolean('is_published')->default(false);
            $table->timestamp('publish_at')->nullable()->index();
            
            // SEO
            $table->string('seo_title_ru')->nullable();
            $table->string('seo_title_kk')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->text('seo_desc_ru')->nullable();
            $table->text('seo_desc_kk')->nullable();
            $table->text('seo_desc_en')->nullable();
            
            $table->timestamps();
            
            // Индексы для производительности
            $table->index(['is_published', 'publish_at']);
            $table->index(['city_ru', 'is_published']);
            $table->index(['slug', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};
