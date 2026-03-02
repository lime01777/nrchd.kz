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
        Schema::table('clinic_doctors', function (Blueprint $table) {
            if (!Schema::hasColumn('clinic_doctors', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('order');
            }
            if (!Schema::hasColumn('clinic_doctors', 'contacts')) {
                $table->json('contacts')->nullable()->after('photo_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinic_doctors', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'contacts']);
        });
    }
};
