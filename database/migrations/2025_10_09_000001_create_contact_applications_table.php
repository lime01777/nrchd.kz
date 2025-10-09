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
        Schema::create('contact_applications', function (Blueprint $table) {
            $table->id();
            // Категория/источник заявки
            $table->string('category'); // general, tech_competence, medical_tourism, medical_accreditation, health_rate, etc.
            
            // Основные поля
            $table->string('name'); // Имя заявителя
            $table->string('email'); // Email
            $table->string('phone', 20); // Телефон
            
            // Дополнительные поля в зависимости от категории
            $table->string('subject')->nullable(); // Тема (для общих обращений)
            $table->text('message'); // Сообщение
            $table->string('organization')->nullable(); // Организация
            $table->string('project_name')->nullable(); // Название проекта (для тех.компетенции)
            $table->string('attachment_path')->nullable(); // Путь к вложению
            
            // Управление заявкой
            $table->string('status')->default('new'); // Статус: new, in_progress, resolved, rejected
            $table->text('admin_notes')->nullable(); // Заметки администратора
            $table->timestamp('reviewed_at')->nullable(); // Когда просмотрена
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete(); // Назначена пользователю
            
            $table->timestamps();
            
            // Индексы для быстрого поиска и фильтрации
            $table->index('category');
            $table->index('email');
            $table->index('status');
            $table->index('created_at');
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_applications');
    }
};

