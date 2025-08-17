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
        if (!Schema::hasTable('stored_translations')) {
            Schema::create('stored_translations', function (Blueprint $table) {
                $table->id();
                $table->text('original_text');
                $table->text('translated_text');
                $table->string('target_language', 10);
                $table->string('page_url')->nullable();
                $table->string('hash', 32)->unique();
                $table->boolean('is_verified')->default(false);
                $table->timestamps();
                
                // Индексы для быстрого поиска
                $table->index(['hash']);
                $table->index(['target_language']);
                $table->index(['page_url']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stored_translations');
    }
};
