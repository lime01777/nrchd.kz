<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Добавляем поддержку мягкого удаления для таблицы новостей.
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Колонка deleted_at требуется трейтам SoftDeletes
            if (!Schema::hasColumn('news', 'deleted_at')) {
                $table->softDeletes()->after('updated_at');
            }
        });
    }

    /**
     * Откат изменений.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            if (Schema::hasColumn('news', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};

