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
        Schema::create('youth_health_centers', function (Blueprint $table) {
            $table->id();
            
            // Название МЦЗ
            $table->string('name');
            
            // Организация
            $table->string('organization');
            
            // Адрес
            $table->text('address');
            
            // Регион/Область
            $table->string('region');
            
            // Координаты для карты
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            
            // Активность
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index('region');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('youth_health_centers');
    }
};

