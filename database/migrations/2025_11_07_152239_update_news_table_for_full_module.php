<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Обновляет таблицу news для полноценного модуля новостей
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Добавляем новые поля только если их ещё нет (поддержка повторного запуска миграций)
            if (!Schema::hasColumn('news', 'body')) {
                $table->longText('body')->nullable()->after('content');
            }

            if (!Schema::hasColumn('news', 'excerpt')) {
                $table->text('excerpt')->nullable()->after('slug');
            }

            if (!Schema::hasColumn('news', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('publish_date');
            }

            if (!Schema::hasColumn('news', 'cover_image_path')) {
                $table->string('cover_image_path', 512)->nullable()->after('body');
            }

            if (!Schema::hasColumn('news', 'cover_image_thumb_path')) {
                $table->string('cover_image_thumb_path', 512)->nullable()->after('cover_image_path');
            }

            if (!Schema::hasColumn('news', 'cover_image_alt')) {
                $table->string('cover_image_alt', 255)->nullable()->after('cover_image_thumb_path');
            }

            if (!Schema::hasColumn('news', 'seo_title')) {
                $table->string('seo_title', 255)->nullable()->after('cover_image_alt');
            }

            if (!Schema::hasColumn('news', 'seo_description')) {
                $table->string('seo_description', 255)->nullable()->after('seo_title');
            }

            if (!Schema::hasColumn('news', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('seo_description')->constrained('users')->nullOnDelete();
            }

            if (!Schema::hasColumn('news', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // Обновляем данные: копируем content в body и publish_date в published_at при наличии столбцов
        if (Schema::hasColumn('news', 'body') && Schema::hasColumn('news', 'content')) {
            DB::statement('UPDATE news SET body = content WHERE body IS NULL');
        }

        if (Schema::hasColumn('news', 'published_at') && Schema::hasColumn('news', 'publish_date')) {
            DB::statement('UPDATE news SET published_at = publish_date WHERE published_at IS NULL');
        }

        // Приводим статусы к новым значениям (draft/published)
        if (Schema::hasColumn('news', 'status')) {
            DB::statement("UPDATE news SET status = CASE 
                WHEN status IN ('Опубликовано', 'published', 'Published', 'опубликовано') THEN 'published'
                ELSE 'draft'
            END");
        }

        // Добавляем индекс на published_at, если его ещё нет
        if (Schema::hasColumn('news', 'published_at') && !$this->hasIndex('news', 'news_published_at_index')) {
            Schema::table('news', function (Blueprint $table) {
                $table->index('published_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Возвращаем статусы в старый формат
        if (Schema::hasColumn('news', 'status')) {
            DB::statement("UPDATE news SET status = CASE 
                WHEN status = 'published' THEN 'Опубликовано'
                ELSE 'Черновик'
            END");
        }

        // Удаляем индекс, если он существует
        if ($this->hasIndex('news', 'news_published_at_index')) {
            Schema::table('news', function (Blueprint $table) {
                $table->dropIndex('news_published_at_index');
            });
        }

        // Удаляем добавленные поля при откате, если они есть
        Schema::table('news', function (Blueprint $table) {
            if (Schema::hasColumn('news', 'created_by')) {
                $table->dropForeign('news_created_by_foreign');
                $table->dropColumn('created_by');
            }

            if (Schema::hasColumn('news', 'seo_description')) {
                $table->dropColumn('seo_description');
            }

            if (Schema::hasColumn('news', 'seo_title')) {
                $table->dropColumn('seo_title');
            }

            if (Schema::hasColumn('news', 'cover_image_alt')) {
                $table->dropColumn('cover_image_alt');
            }

            if (Schema::hasColumn('news', 'cover_image_thumb_path')) {
                $table->dropColumn('cover_image_thumb_path');
            }

            if (Schema::hasColumn('news', 'cover_image_path')) {
                $table->dropColumn('cover_image_path');
            }

            if (Schema::hasColumn('news', 'excerpt')) {
                $table->dropColumn('excerpt');
            }

            if (Schema::hasColumn('news', 'published_at')) {
                $table->dropColumn('published_at');
            }

            if (Schema::hasColumn('news', 'body')) {
                $table->dropColumn('body');
            }

            if (Schema::hasColumn('news', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
    
    /**
     * Проверяет наличие индекса в таблице
     */
    private function hasIndex(string $table, string $indexName): bool
    {
        $connection = Schema::getConnection();
        $database = $connection->getDatabaseName();
        
        $result = DB::select(
            "SELECT COUNT(*) as count 
             FROM information_schema.statistics 
             WHERE table_schema = ? 
             AND table_name = ? 
             AND index_name = ?",
            [$database, $table, $indexName]
        );
        
        return $result[0]->count > 0;
    }
};
