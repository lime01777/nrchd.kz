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
        Schema::create('glossary_terms', function (Blueprint $table) {
            $table->id();
            $table->string('term', 255)->comment('Термин или имя собственное, которое не нужно переводить');
            $table->string('locale', 5)->default('ru')->comment('Язык термина (ru, kk, en)');
            $table->boolean('case_sensitive')->default(false)->comment('Учитывать регистр при поиске');
            $table->json('tags')->nullable()->comment('Теги для категоризации (ФИО, названия, и т.д.)');
            $table->boolean('active')->default(true)->comment('Активен ли термин');
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index(['term', 'locale']);
            $table->index('active');
        });
        
        // Добавляем базовые термины по умолчанию
        DB::table('glossary_terms')->insert([
            [
                'term' => 'Салидат Каирбекова',
                'locale' => 'ru',
                'case_sensitive' => false,
                'tags' => json_encode(['person', 'name']),
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'term' => 'Салидат Каирбекова',
                'locale' => 'kk',
                'case_sensitive' => false,
                'tags' => json_encode(['person', 'name']),
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'term' => 'Salidat Kairbekova',
                'locale' => 'en',
                'case_sensitive' => false,
                'tags' => json_encode(['person', 'name']),
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('glossary_terms');
    }
};

