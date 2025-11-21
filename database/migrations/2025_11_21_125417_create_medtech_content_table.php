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
        Schema::create('medtech_content', function (Blueprint $table) {
            $table->id();
            $table->string('section'); // Раздел (overview, algorithm_steps, algorithm_indicators)
            $table->string('key'); // Ключ контента
            $table->text('content_ru')->nullable(); // Содержимое на русском
            $table->text('content_kz')->nullable(); // Содержимое на казахском
            $table->text('content_en')->nullable(); // Содержимое на английском
            $table->string('image_path')->nullable(); // Путь к изображению (для алгоритма)
            $table->integer('order')->default(0); // Порядок сортировки
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtech_content');
    }
};
