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
        Schema::create('medtech_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Название документа
            $table->text('description')->nullable(); // Краткое описание
            $table->string('type')->nullable(); // Тип/категория (Правила, Методика, Приказ и др.)
            $table->string('file_path')->nullable(); // Путь к файлу PDF/DOCX
            $table->string('file_name')->nullable(); // Имя файла для отображения
            $table->integer('order')->default(0); // Порядок сортировки
            $table->boolean('is_active')->default(true); // Активен ли документ
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtech_documents');
    }
};
