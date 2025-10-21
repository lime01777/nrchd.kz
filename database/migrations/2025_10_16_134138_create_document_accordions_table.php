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
            $table->string('name'); // Имя аккордеона
            $table->string('page_route'); // Маршрут страницы, где отображается
            $table->string('folder_path')->nullable(); // Путь к папке с документами
            $table->string('title'); // Заголовок аккордеона
            $table->string('bg_color')->nullable(); // Цвет фона
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            // Индексы
            $table->index('page_route');
            $table->index('is_active');
            $table->index('sort_order');
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
