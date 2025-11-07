<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Feature-тесты для модуля новостей
 */
class NewsModuleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест: создание новости администратором
     */
    public function test_admin_can_create_news(): void
    {
        // Arrange: создаём администратора
        $admin = User::factory()->create(['role' => 'admin']);

        // Act: выполняем запрос на создание
        $response = $this->actingAs($admin)->post(route('admin.news.store'), [
            'title' => 'Тестовая новость',
            'slug' => 'testovaya-novost',
            'body' => 'Содержимое тестовой новости',
            'status' => 'draft',
        ]);

        // Assert: проверяем редирект и наличие записи
        $response->assertRedirect(route('admin.news.index'));
        $this->assertDatabaseHas('news', [
            'title' => 'Тестовая новость',
            'status' => 'draft',
        ]);
    }

    /**
     * Тест: загрузка обложки и генерация превью
     */
    public function test_cover_upload_and_thumbnail_generation(): void
    {
        // Arrange: создаём администратора и фейковое хранилище
        $admin = User::factory()->create(['role' => 'admin']);
        Storage::fake('public');

        // Act: отправляем форму с изображением
        $image = UploadedFile::fake()->image('cover.jpg', 1200, 600);
        $response = $this->actingAs($admin)->post(route('admin.news.store'), [
            'title' => 'Новость с обложкой',
            'slug' => 'novost-s-oblozhkoi',
            'body' => 'Содержимое',
            'status' => 'draft',
            'cover' => $image,
        ]);

        // Assert: проверяем статус и наличие файлов
        $response->assertRedirect(route('admin.news.index'));
        $news = News::where('title', 'Новость с обложкой')->firstOrFail();
        $this->assertTrue(Storage::disk('public')->exists($news->cover_image_path));
        $this->assertTrue(Storage::disk('public')->exists($news->cover_image_thumb_path));
    }

    /**
     * Тест: публичные маршруты существуют
     */
    public function test_named_routes_exist(): void
    {
        // Assert: проверяем наличие ключевых маршрутов
        $neededRoutes = [
            'news.index',
            'news.show',
            'admin.news.index',
            'admin.news.create',
            'admin.news.store',
            'admin.news.edit',
            'admin.news.update',
            'admin.news.destroy',
            'admin.news.toggle',
        ];

        foreach ($neededRoutes as $name) {
            $this->assertTrue(Route::has($name), "Маршрут {$name} должен существовать");
        }
    }

    /**
     * Тест: публичный доступ только к опубликованным новостям
     */
    public function test_public_can_only_view_published_news(): void
    {
        // Arrange: создаём опубликованную и черновую новости
        $published = News::factory()->create([
            'status' => 'published',
            'published_at' => now(),
        ]);

        $draft = News::factory()->create([
            'status' => 'draft',
            'published_at' => null,
        ]);

        // Assert: опубликованная доступна
        $this->get(route('news.show', $published->slug))->assertStatus(200);

        // Assert: черновик недоступен
        $this->get(route('news.show', $draft->slug))->assertStatus(404);
    }

    /**
     * Тест: только admin и editor могут создавать новости
     */
    public function test_only_admin_and_editor_can_create_news(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $editor = User::factory()->create(['role' => 'editor']);
        $user = User::factory()->create(['role' => 'user']);

        // Admin может создать
        $response = $this->actingAs($admin)->get(route('admin.news.create'));
        $response->assertStatus(200);

        // Editor может создать
        $response = $this->actingAs($editor)->get(route('admin.news.create'));
        $response->assertStatus(200);

        // Обычный пользователь не может
        $response = $this->actingAs($user)->get(route('admin.news.create'));
        $response->assertStatus(403);
    }

    /**
     * Тест: автогенерация slug при создании
     */
    public function test_slug_auto_generation(): void
    {
        // Arrange: создаём администратора
        $admin = User::factory()->create(['role' => 'admin']);

        // Act: отправляем форму без явного slug
        $this->actingAs($admin)->post(route('admin.news.store'), [
            'title' => 'Тестовая новость с заголовком',
            'body' => 'Содержимое',
            'status' => 'draft',
        ]);

        // Assert: slug сгенерирован автоматически
        $news = News::where('title', 'Тестовая новость с заголовком')->firstOrFail();
        $this->assertEquals('testovaya-novost-s-zagolovkom', $news->slug);
    }

    /**
     * Тест: уникальность slug поддерживается автоматически
     */
    public function test_slug_uniqueness(): void
    {
        // Arrange: создаём новость с целевым slug
        News::factory()->create(['slug' => 'test-slug']);
        $admin = User::factory()->create(['role' => 'admin']);

        // Act: создаём новость с тем же заголовком
        $this->actingAs($admin)->post(route('admin.news.store'), [
            'title' => 'Test Slug',
            'body' => 'Содержимое',
            'status' => 'draft',
        ]);

        // Assert: slug уникализирован
        $news = News::where('title', 'Test Slug')->firstOrFail();
        $this->assertNotEquals('test-slug', $news->slug);
        $this->assertTrue(Str::startsWith($news->slug, 'test-slug'));
    }

    /**
     * Тест: soft delete работает корректно
     */
    public function test_news_soft_delete(): void
    {
        // Arrange: создаём администратора и новость
        $admin = User::factory()->create(['role' => 'admin']);
        $news = News::factory()->create();

        // Act: удаляем новость
        $response = $this->actingAs($admin)->delete(route('admin.news.destroy', $news->id));

        // Assert: проверяем soft delete
        $response->assertRedirect(route('admin.news.index'));
        $this->assertSoftDeleted('news', ['id' => $news->id]);
    }

    /**
     * Тест: toggle-переключатель статуса работает
     */
    public function test_toggle_status(): void
    {
        // Arrange: создаём администратора и черновик
        $admin = User::factory()->create(['role' => 'admin']);
        $news = News::factory()->create(['status' => 'draft']);

        // Act: переключаем статус
        $response = $this->actingAs($admin)->patch(route('admin.news.toggle', $news->id));

        // Assert: проверяем новое состояние
        $response->assertRedirect();
        $news->refresh();
        $this->assertEquals('published', $news->status);
        $this->assertNotNull($news->published_at);
    }
}
