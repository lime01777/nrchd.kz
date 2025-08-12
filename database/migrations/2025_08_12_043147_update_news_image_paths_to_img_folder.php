<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Обновляем пути в поле images (JSON массив)
        $newsWithImages = DB::table('news')
            ->whereNotNull('images')
            ->where('images', '!=', '[]')
            ->get();

        foreach ($newsWithImages as $news) {
            $images = json_decode($news->images, true);
            
            if (is_array($images)) {
                $updatedImages = [];
                foreach ($images as $image) {
                    if (is_string($image)) {
                        // Заменяем старые пути на новые
                        $updatedImage = str_replace('/storage/news/', '/img/news/', $image);
                        $updatedImages[] = $updatedImage;
                    } else {
                        $updatedImages[] = $image;
                    }
                }
                
                // Обновляем запись в БД
                DB::table('news')
                    ->where('id', $news->id)
                    ->update(['images' => json_encode($updatedImages)]);
            }
        }

        // Обновляем пути в поле main_image
        DB::table('news')
            ->whereNotNull('main_image')
            ->where('main_image', 'like', '%/storage/news/%')
            ->update([
                'main_image' => DB::raw("REPLACE(main_image, '/storage/news/', '/img/news/')")
            ]);

        // Обновляем пути в поле image
        DB::table('news')
            ->whereNotNull('image')
            ->where('image', 'like', '%/storage/news/%')
            ->update([
                'image' => DB::raw("REPLACE(image, '/storage/news/', '/img/news/')")
            ]);

        // Логируем результат
        $updatedCount = DB::table('news')
            ->where(function($query) {
                $query->where('images', 'like', '%/img/news/%')
                      ->orWhere('main_image', 'like', '%/img/news/%')
                      ->orWhere('image', 'like', '%/img/news/%');
            })
            ->count();

        Log::info('Миграция: Обновлены пути к изображениям', [
            'updated_records' => $updatedCount,
            'migration' => 'update_news_image_paths_to_img_folder'
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Возвращаем старые пути в поле images (JSON массив)
        $newsWithImages = DB::table('news')
            ->whereNotNull('images')
            ->where('images', '!=', '[]')
            ->get();

        foreach ($newsWithImages as $news) {
            $images = json_decode($news->images, true);
            
            if (is_array($images)) {
                $updatedImages = [];
                foreach ($images as $image) {
                    if (is_string($image)) {
                        // Возвращаем старые пути
                        $updatedImage = str_replace('/img/news/', '/storage/news/', $image);
                        $updatedImages[] = $updatedImage;
                    } else {
                        $updatedImages[] = $image;
                    }
                }
                
                // Обновляем запись в БД
                DB::table('news')
                    ->where('id', $news->id)
                    ->update(['images' => json_encode($updatedImages)]);
            }
        }

        // Возвращаем старые пути в поле main_image
        DB::table('news')
            ->whereNotNull('main_image')
            ->where('main_image', 'like', '%/img/news/%')
            ->update([
                'main_image' => DB::raw("REPLACE(main_image, '/img/news/', '/storage/news/')")
            ]);

        // Возвращаем старые пути в поле image
        DB::table('news')
            ->whereNotNull('image')
            ->where('image', 'like', '%/img/news/%')
            ->update([
                'image' => DB::raw("REPLACE(image, '/img/news/', '/storage/news/')")
            ]);

        Log::info('Миграция: Откат путей к изображениям', [
            'migration' => 'update_news_image_paths_to_img_folder'
        ]);
    }
};
