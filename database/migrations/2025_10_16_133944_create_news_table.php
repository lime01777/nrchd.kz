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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->json('category')->nullable(); // Массив категорий
            $table->string('status')->default('Черновик'); // Опубликовано / Черновик
            $table->timestamp('publish_date')->nullable();
            $table->string('image')->nullable(); // Старое поле для обратной совместимости
            $table->string('main_image')->nullable(); // Главное изображение
            $table->json('images')->nullable(); // Массив медиафайлов (изображения и видео)
            $table->integer('views')->default(0);
            $table->timestamps();
            
            // Индексы для оптимизации запросов
            $table->index('status');
            $table->index('publish_date');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
