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
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('key')->index(); // For example: "home.title" or "about.description"
            $table->text('ru')->nullable();
            $table->text('kk')->nullable();
            $table->text('en')->nullable();
            $table->string('group')->index(); // Group translations by page or component
            $table->timestamps();
            
            // Add composite unique index for key and group
            $table->unique(['key', 'group']);
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
