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
        Schema::create('okk_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('КП'); // КП или ОТЗ
            $table->string('folder_path')->nullable();
            $table->string('status')->default('Ознакомление'); // Ознакомление, Заседание, Доработка, Одобрен, На публикацию
            $table->timestamp('meeting_time')->nullable(); // Время заседания
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('okk_projects');
    }
};
