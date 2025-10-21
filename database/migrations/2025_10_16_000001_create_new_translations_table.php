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
        // Удаляем старую таблицу, если существует
        Schema::dropIfExists('translations');
        
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('scope', 120)->index();
            $table->string('key', 190);
            $table->text('ru');
            $table->text('kk')->nullable();
            $table->text('en')->nullable();
            $table->string('hash', 64)->index()->comment('Hash от RU текста для определения изменений');
            $table->json('meta')->nullable()->comment('Дополнительные метаданные');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            // Уникальный индекс для scope + key
            $table->unique(['scope', 'key']);
            
            // Индекс для быстрого поиска по scope и дате
            $table->index(['scope', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};

