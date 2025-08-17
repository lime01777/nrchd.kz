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
        // Безопасное создание таблицы translations
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
        } else {
            // Если таблица существует, добавляем недостающие колонки
            Schema::table('translations', function (Blueprint $table) {
                if (!Schema::hasColumn('translations', 'source_language')) {
                    $table->string('source_language', 10)->default('ru')->after('translated_text');
                }
                if (!Schema::hasColumn('translations', 'content_type')) {
                    $table->string('content_type')->nullable()->after('target_language');
                }
                if (!Schema::hasColumn('translations', 'content_id')) {
                    $table->unsignedBigInteger('content_id')->nullable()->after('content_type');
                }
            });
        }

        // Безопасное создание таблицы stored_translations
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
        // Не удаляем таблицы в down(), так как они могут содержать важные данные
        // Schema::dropIfExists('translations');
        // Schema::dropIfExists('stored_translations');
    }
};
