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

        // Проверяем существование колонки main_image и обновляем пути
        $hasMainImageColumn = Schema::hasColumn('news', 'main_image');
        if ($hasMainImageColumn) {
            DB::table('news')
                ->whereNotNull('main_image')
                ->where('main_image', 'like', '%/storage/news/%')
                ->update([
                    'main_image' => DB::raw("REPLACE(main_image, '/storage/news/', '/img/news/')")
                ]);
        }

        // Проверяем существование колонки image и обновляем пути
        $hasImageColumn = Schema::hasColumn('news', 'image');
        if ($hasImageColumn) {
            DB::table('news')
                ->whereNotNull('image')
                ->where('image', 'like', '%/storage/news/%')
                ->update([
                    'image' => DB::raw("REPLACE(image, '/storage/news/', '/img/news/')")
                ]);
        }

        // Логируем результат
        $query = DB::table('news')->where('images', 'like', '%/img/news/%');
        
        if ($hasMainImageColumn) {
            $query->orWhere('main_image', 'like', '%/img/news/%');
        }
        
        if ($hasImageColumn) {
            $query->orWhere('image', 'like', '%/img/news/%');
        }
        
        $updatedCount = $query->count();

        Log::info('Миграция: Обновлены пути к изображениям', [
            'updated_records' => $updatedCount,
            'has_main_image_column' => $hasMainImageColumn,
            'has_image_column' => $hasImageColumn,
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

        // Проверяем существование колонки main_image и возвращаем старые пути
        $hasMainImageColumn = Schema::hasColumn('news', 'main_image');
        if ($hasMainImageColumn) {
            DB::table('news')
                ->whereNotNull('main_image')
                ->where('main_image', 'like', '%/img/news/%')
                ->update([
                    'main_image' => DB::raw("REPLACE(main_image, '/img/news/', '/storage/news/')")
                ]);
        }

        // Проверяем существование колонки image и возвращаем старые пути
        $hasImageColumn = Schema::hasColumn('news', 'image');
        if ($hasImageColumn) {
            DB::table('news')
                ->whereNotNull('image')
                ->where('image', 'like', '%/img/news/%')
                ->update([
                    'image' => DB::raw("REPLACE(image, '/img/news/', '/storage/news/')")
                ]);
        }

        Log::info('Миграция: Откат путей к изображениям', [
            'migration' => 'update_news_image_paths_to_img_folder'
        ]);
    }
};
