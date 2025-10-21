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
            $table->string('name'); // Имя отправителя
            $table->string('email'); // Email отправителя
            $table->string('phone')->nullable(); // Телефон
            $table->string('category')->nullable(); // Категория обращения
            $table->text('message'); // Текст сообщения
            $table->string('status')->default('new'); // new, in_progress, resolved, closed
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Назначено пользователю
            $table->text('notes')->nullable(); // Заметки администратора
            $table->timestamp('responded_at')->nullable(); // Время ответа
            $table->timestamps();
            
            // Индексы
            $table->index('status');
            $table->index('category');
            $table->index('email');
            $table->index('assigned_to');
            $table->index('created_at');
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
