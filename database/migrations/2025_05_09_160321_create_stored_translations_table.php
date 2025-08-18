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
        Schema::create('stored_translations', function (Blueprint $table) {
            $table->id();
            $table->text('original_text'); // Оригинальный текст на русском
            $table->text('translated_text'); // Переведенный текст
            $table->string('target_language', 5); // Язык перевода (en, kz, etc.)
            $table->string('page_url')->nullable(); // URL страницы для контекста
            $table->string('hash', 64)->index(); // Хеш для быстрого поиска
            $table->boolean('is_verified')->default(false); // Был ли перевод проверен вручную
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index(['target_language', 'hash']);
            $table->index('page_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stored_translations');
    }
};
