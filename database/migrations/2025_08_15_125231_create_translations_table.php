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
        // Проверяем, существует ли таблица уже
        if (!Schema::hasTable('translations')) {
            Schema::create('translations', function (Blueprint $table) {
                $table->id();
                $table->text('original_text');
                $table->text('translated_text');
                $table->string('source_language', 10)->default('ru');
                $table->string('target_language', 10);
                $table->string('content_type')->nullable();
                $table->unsignedBigInteger('content_id')->nullable();
                $table->timestamps();
                
                // Индексы для быстрого поиска
                $table->index(['original_text', 'source_language', 'target_language']);
                $table->index(['content_type', 'content_id']);
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
