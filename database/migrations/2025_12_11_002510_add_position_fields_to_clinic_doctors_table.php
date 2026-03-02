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
            if (!Schema::hasColumn('clinic_doctors', 'position_ru')) {
                $table->string('position_ru')->nullable()->after('name_en');
            }
            if (!Schema::hasColumn('clinic_doctors', 'position_kk')) {
                $table->string('position_kk')->nullable()->after('position_ru');
            }
            if (!Schema::hasColumn('clinic_doctors', 'position_en')) {
                $table->string('position_en')->nullable()->after('position_kk');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinic_doctors', function (Blueprint $table) {
            $table->dropColumn(['position_ru', 'position_kk', 'position_en']);
        });
    }
};
