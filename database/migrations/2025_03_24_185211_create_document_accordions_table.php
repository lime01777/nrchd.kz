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
        Schema::create('document_accordions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Название аккордеона для отображения в админке
            $table->string('page_route')->nullable(); // Маршрут страницы, на которой отображается аккордеон
            $table->string('folder_path'); // Путь к папке с документами
            $table->string('title'); // Заголовок аккордеона
            $table->string('bg_color')->default('bg-green-100'); // Цвет фона аккордеона
            $table->boolean('is_active')->default(true); // Активен ли аккордеон
            $table->integer('sort_order')->default(0); // Порядок сортировки
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_accordions');
    }
};
