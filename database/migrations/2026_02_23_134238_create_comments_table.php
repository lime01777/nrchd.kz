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
        Schema::create('comments', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('news_id')->constrained()->onDelete('cascade');
            $blueprint->string('name');
            $blueprint->string('email');
            $blueprint->text('content');
            $blueprint->boolean('is_approved')->default(false);
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
