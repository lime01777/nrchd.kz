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
        Schema::create('vacancy_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained('vacancies')->onDelete('cascade');
            $table->string('name'); // Имя кандидата
            $table->string('email'); // Email кандидата
            $table->string('phone', 20); // Телефон кандидата
            $table->text('cover_letter')->nullable(); // Сопроводительное письмо
            $table->string('resume_path'); // Путь к файлу резюме
            $table->string('status')->default('new'); // Статус: new, reviewed, contacted, rejected, hired
            $table->text('notes')->nullable(); // Заметки HR
            $table->timestamp('reviewed_at')->nullable(); // Когда просмотрена
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index('vacancy_id');
            $table->index('email');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancy_applications');
    }
};
