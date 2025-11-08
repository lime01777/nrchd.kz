<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Добавляем тип публикации к новостям.
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Тип публикации: обычная новость или материал из СМИ о нас.
            $table->string('type')
                ->default('news')
                ->after('status');
        });
    }

    /**
     * Откат миграции.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};

