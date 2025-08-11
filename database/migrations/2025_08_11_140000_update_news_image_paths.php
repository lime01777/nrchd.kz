<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateNewsImagePaths extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Обновляем пути к изображениям в таблице news
        $news = DB::table('news')->whereNotNull('images')->get();
        
        foreach ($news as $item) {
            if ($item->images) {
                $images = json_decode($item->images, true);
                $updatedImages = [];
                
                if (is_array($images)) {
                    foreach ($images as $image) {
                        if (is_string($image)) {
                            // Заменяем старые пути /storage/news/ на новые /img/news/
                            $updatedImage = str_replace('/storage/news/', '/img/news/', $image);
                            $updatedImages[] = $updatedImage;
                        } else {
                            $updatedImages[] = $image;
                        }
                    }
                }
                
                // Обновляем запись в базе данных
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['images' => json_encode($updatedImages)]);
            }
        }
        
        // Также обновляем main_image если есть
        $newsWithMainImage = DB::table('news')->whereNotNull('main_image')->get();
        
        foreach ($newsWithMainImage as $item) {
            if ($item->main_image && is_string($item->main_image)) {
                $updatedMainImage = str_replace('/storage/news/', '/img/news/', $item->main_image);
                
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['main_image' => $updatedMainImage]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Возвращаем старые пути
        $news = DB::table('news')->whereNotNull('images')->get();
        
        foreach ($news as $item) {
            if ($item->images) {
                $images = json_decode($item->images, true);
                $updatedImages = [];
                
                if (is_array($images)) {
                    foreach ($images as $image) {
                        if (is_string($image)) {
                            // Заменяем новые пути /img/news/ на старые /storage/news/
                            $updatedImage = str_replace('/img/news/', '/storage/news/', $image);
                            $updatedImages[] = $updatedImage;
                        } else {
                            $updatedImages[] = $image;
                        }
                    }
                }
                
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['images' => json_encode($updatedImages)]);
            }
        }
        
        // Также возвращаем main_image
        $newsWithMainImage = DB::table('news')->whereNotNull('main_image')->get();
        
        foreach ($newsWithMainImage as $item) {
            if ($item->main_image && is_string($item->main_image)) {
                $updatedMainImage = str_replace('/img/news/', '/storage/news/', $item->main_image);
                
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['main_image' => $updatedMainImage]);
            }
        }
    }
}
