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
        if (!Schema::hasTable('translations')) {
            Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->text('original_text')->index();
            $table->text('translated_text');
            $table->string('source_language', 5)->index();
            $table->string('target_language', 5)->index();
            $table->string('content_type', 50)->default('general')->index();
            $table->unsignedBigInteger('content_id')->nullable()->index();
            $table->timestamps();
            
            // Создаем индекс для быстрого поиска переводов
            $table->index(['source_language', 'target_language', 'content_type']);
            
            // Добавляем уникальный индекс для предотвращения дублирования переводов
            // Используем длину индекса для текстового поля, так как MySQL имеет ограничение на длину индекса
            $table->unique(['original_text(190)', 'source_language', 'target_language'], 'unique_translation');
        });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
