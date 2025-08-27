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
        Schema::create('clinic_doctors', function (Blueprint $table) {
            $table->id();
            
            // Связь с клиникой
            $table->foreignId('clinic_id')->constrained('clinics')->onDelete('cascade');
            
            // Основная информация
            $table->string('name_ru');
            $table->string('name_kk')->nullable();
            $table->string('name_en')->nullable();
            $table->string('position_ru')->nullable();
            $table->string('position_kk')->nullable();
            $table->string('position_en')->nullable();
            
            // Фото
            $table->string('photo_path')->nullable();
            
            // Контакты (JSON)
            $table->json('contacts')->nullable();
            
            // Статус
            $table->boolean('is_featured')->default(false);
            
            $table->timestamps();
            
            // Индексы
            $table->index(['clinic_id', 'is_featured']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinic_doctors');
    }
};
