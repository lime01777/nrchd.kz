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
            $table->string('slug')->unique();
            
            // Названия на разных языках
            $table->string('name_ru');
            $table->string('name_kk')->nullable();
            $table->string('name_en')->nullable();
            
            // Краткое описание
            $table->text('short_desc_ru')->nullable();
            $table->text('short_desc_kk')->nullable();
            $table->text('short_desc_en')->nullable();
            
            // Полное описание
            $table->longText('full_desc_ru')->nullable();
            $table->longText('full_desc_kk')->nullable();
            $table->longText('full_desc_en')->nullable();
            
            // Местоположение
            $table->string('city_ru')->nullable();
            $table->string('city_kk')->nullable();
            $table->string('city_en')->nullable();
            $table->text('address_ru')->nullable();
            $table->text('address_kk')->nullable();
            $table->text('address_en')->nullable();
            
            // Контакты
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            
            // Рабочие часы (JSON)
            $table->json('working_hours_ru')->nullable();
            $table->json('working_hours_kk')->nullable();
            $table->json('working_hours_en')->nullable();
            
            // Специализации (JSON array)
            $table->json('specialties_ru')->nullable();
            $table->json('specialties_kk')->nullable();
            $table->json('specialties_en')->nullable();
            
            // Услуги (JSON array)
            $table->json('services_ru')->nullable();
            $table->json('services_kk')->nullable();
            $table->json('services_en')->nullable();
            
            // Аккредитации (JSON array)
            $table->json('accreditations_ru')->nullable();
            $table->json('accreditations_kk')->nullable();
            $table->json('accreditations_en')->nullable();
            
            // Оборудование (JSON array)
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
            
            // Публикация
            $table->boolean('is_published')->default(false);
            $table->timestamp('publish_at')->nullable();
            
            // SEO
            $table->string('seo_title_ru')->nullable();
            $table->string('seo_title_kk')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->text('seo_desc_ru')->nullable();
            $table->text('seo_desc_kk')->nullable();
            $table->text('seo_desc_en')->nullable();
            
            $table->timestamps();
            
            // Индексы
            $table->index('slug');
            $table->index('is_published');
            $table->index('city_ru');
        });

        // Таблица врачей клиник
        Schema::create('clinic_doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            
            // ФИО на разных языках
            $table->string('name_ru');
            $table->string('name_kk')->nullable();
            $table->string('name_en')->nullable();
            
            // Специальность
            $table->string('specialty_ru');
            $table->string('specialty_kk')->nullable();
            $table->string('specialty_en')->nullable();
            
            // Описание
            $table->text('bio_ru')->nullable();
            $table->text('bio_kk')->nullable();
            $table->text('bio_en')->nullable();
            
            // Изображение
            $table->string('photo_path')->nullable();
            
            // Квалификация и образование (JSON array)
            $table->json('qualifications_ru')->nullable();
            $table->json('qualifications_kk')->nullable();
            $table->json('qualifications_en')->nullable();
            
            // Порядок отображения
            $table->integer('order')->default(0);
            
            $table->timestamps();
            
            // Индексы
            $table->index('clinic_id');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinic_doctors');
        Schema::dropIfExists('clinics');
    }
};
