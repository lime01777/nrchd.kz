<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewsManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected MediaService $mediaService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->mediaService = app(MediaService::class);
        
        // Создаем тестовую директорию для медиа
        Storage::fake('public');
    }

    /** @test */
    public function user_can_create_news_with_media()
    {
        $this->actingAs($this->user);

        // Создаем тестовые файлы
        $imageFile = UploadedFile::fake()->image('test-image.jpg', 800, 600);
        $videoFile = UploadedFile::fake()->create('test-video.mp4', 1024, 'video/mp4');

        $newsData = [
            'title' => 'Тестовая новость',
            'content' => 'Это тестовое содержимое новости с достаточным количеством текста для валидации.',
            'category' => ['Медицина', 'Технологии'],
            'tags' => ['тест', 'новости'],
            'status' => 'published',
            'media_files' => [$imageFile, $videoFile]
        ];

        $response = $this->post(route('admin.news.store'), $newsData);

        $response->assertRedirect(route('admin.news'));
        $response->assertSessionHas('success');

        // Проверяем, что новость создана
        $this->assertDatabaseHas('news', [
            'title' => 'Тестовая новость',
            'status' => 'Опубликовано'
        ]);

        $news = News::where('title', 'Тестовая новость')->first();
        $this->assertNotNull($news);
        $this->assertCount(2, $news->images);
        
        // Проверяем, что файлы загружены
        foreach ($news->images as $media) {
            $this->assertArrayHasKey('path', $media);
            $this->assertArrayHasKey('type', $media);
            $this->assertArrayHasKey('name', $media);
        }
    }

    /** @test */
    public function user_can_upload_media_to_existing_news()
    {
        $this->actingAs($this->user);

        // Создаем новость
        $news = News::factory()->create([
            'title' => 'Тестовая новость',
            'images' => []
        ]);

        // Загружаем медиа
        $imageFile = UploadedFile::fake()->image('new-image.jpg', 800, 600);
        
        $response = $this->post(route('admin.news.media.upload', $news->id), [
            'files' => [$imageFile]
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Проверяем, что медиа добавлено
        $news->refresh();
        $this->assertCount(1, $news->images);
    }

    /** @test */
    public function user_can_delete_media_from_news()
    {
        $this->actingAs($this->user);

        // Создаем новость с медиа
        $mediaData = [
            [
                'id' => 'test-media-1',
                'path' => '/storage/news/test-image.jpg',
                'type' => 'image',
                'name' => 'test-image.jpg',
                'size' => 1024
            ]
        ];

        $news = News::factory()->create([
            'title' => 'Тестовая новость',
            'images' => $mediaData
        ]);

        $response = $this->delete(route('admin.news.media.delete', [$news->id, 'test-media-1']));

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Проверяем, что медиа удалено
        $news->refresh();
        $this->assertCount(0, $news->images);
    }

    /** @test */
    public function user_can_set_cover_image()
    {
        $this->actingAs($this->user);

        // Создаем новость с медиа
        $mediaData = [
            [
                'id' => 'test-media-1',
                'path' => '/storage/news/test-image-1.jpg',
                'type' => 'image',
                'name' => 'test-image-1.jpg',
                'size' => 1024,
                'is_cover' => false
            ],
            [
                'id' => 'test-media-2',
                'path' => '/storage/news/test-image-2.jpg',
                'type' => 'image',
                'name' => 'test-image-2.jpg',
                'size' => 2048,
                'is_cover' => false
            ]
        ];

        $news = News::factory()->create([
            'title' => 'Тестовая новость',
            'images' => $mediaData
        ]);

        $response = $this->patch(route('admin.news.cover.set', [$news->id, 'test-media-2']));

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Проверяем, что обложка установлена
        $news->refresh();
        $this->assertFalse($news->images[0]['is_cover']);
        $this->assertTrue($news->images[1]['is_cover']);
    }

    /** @test */
    public function user_can_update_media_order()
    {
        $this->actingAs($this->user);

        // Создаем новость с медиа
        $mediaData = [
            [
                'id' => 'test-media-1',
                'path' => '/storage/news/test-image-1.jpg',
                'type' => 'image',
                'name' => 'test-image-1.jpg',
                'position' => 0
            ],
            [
                'id' => 'test-media-2',
                'path' => '/storage/news/test-image-2.jpg',
                'type' => 'image',
                'name' => 'test-image-2.jpg',
                'position' => 1
            ]
        ];

        $news = News::factory()->create([
            'title' => 'Тестовая новость',
            'images' => $mediaData
        ]);

        // Меняем порядок
        $newOrder = [
            ['id' => 'test-media-2', 'position' => 0],
            ['id' => 'test-media-1', 'position' => 1]
        ];

        $response = $this->patch(route('admin.news.media.order', $news->id), [
            'media' => $newOrder
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Проверяем новый порядок
        $news->refresh();
        $this->assertEquals(0, $news->images[0]['position']);
        $this->assertEquals(1, $news->images[1]['position']);
    }

    /** @test */
    public function user_can_filter_news_by_status()
    {
        $this->actingAs($this->user);

        // Создаем новости с разными статусами
        News::factory()->create(['title' => 'Черновик', 'status' => 'Черновик']);
        News::factory()->create(['title' => 'Опубликовано', 'status' => 'Опубликовано']);
        News::factory()->create(['title' => 'Запланировано', 'status' => 'Запланировано']);

        $response = $this->get(route('admin.news', ['status' => 'Опубликовано']));

        $response->assertStatus(200);
        $response->assertSee('Опубликовано');
        $response->assertDontSee('Черновик');
        $response->assertDontSee('Запланировано');
    }

    /** @test */
    public function user_can_search_news()
    {
        $this->actingAs($this->user);

        // Создаем новости
        News::factory()->create(['title' => 'Новость о медицине', 'content' => 'Содержимое о медицине']);
        News::factory()->create(['title' => 'Новость о технологиях', 'content' => 'Содержимое о технологиях']);

        $response = $this->get(route('admin.news', ['search' => 'медицина']));

        $response->assertStatus(200);
        $response->assertSee('Новость о медицине');
        $response->assertDontSee('Новость о технологиях');
    }

    /** @test */
    public function media_service_validates_file_types()
    {
        // Тестируем валидацию типов файлов
        $validImage = UploadedFile::fake()->image('test.jpg');
        $validVideo = UploadedFile::fake()->create('test.mp4', 1024, 'video/mp4');
        $invalidFile = UploadedFile::fake()->create('test.txt', 1024, 'text/plain');

        // Валидные файлы должны загружаться
        $this->assertIsArray($this->mediaService->uploadMedia($validImage));
        $this->assertIsArray($this->mediaService->uploadMedia($validVideo));

        // Невалидный файл должен вызывать исключение
        $this->expectException(\InvalidArgumentException::class);
        $this->mediaService->uploadMedia($invalidFile);
    }

    /** @test */
    public function media_service_validates_file_size()
    {
        // Создаем файл больше лимита (50MB)
        $largeFile = UploadedFile::fake()->create('large.mp4', 60000, 'video/mp4'); // 60MB

        $this->expectException(\InvalidArgumentException::class);
        $this->mediaService->uploadMedia($largeFile);
    }

    /** @test */
    public function news_can_be_scheduled_for_future_publication()
    {
        $this->actingAs($this->user);

        $futureDate = now()->addDays(7)->toISOString();

        $newsData = [
            'title' => 'Запланированная новость',
            'content' => 'Это новость, которая будет опубликована в будущем.',
            'category' => ['Анонсы'],
            'status' => 'scheduled',
            'publish_date' => $futureDate
        ];

        $response = $this->post(route('admin.news.store'), $newsData);

        $response->assertRedirect(route('admin.news'));
        
        $this->assertDatabaseHas('news', [
            'title' => 'Запланированная новость',
            'status' => 'Запланировано'
        ]);

        $news = News::where('title', 'Запланированная новость')->first();
        $this->assertEquals($futureDate, $news->publish_date->toISOString());
    }

    /** @test */
    public function news_validation_works_correctly()
    {
        $this->actingAs($this->user);

        // Тестируем валидацию с пустыми данными
        $response = $this->post(route('admin.news.store'), []);

        $response->assertSessionHasErrors(['title', 'content', 'category', 'status']);

        // Тестируем валидацию с некорректными данными
        $response = $this->post(route('admin.news.store'), [
            'title' => str_repeat('a', 300), // Слишком длинный заголовок
            'content' => 'Короткий', // Слишком короткое содержимое
            'category' => [], // Пустые категории
            'status' => 'invalid_status' // Невалидный статус
        ]);

        $response->assertSessionHasErrors(['title', 'content', 'category', 'status']);
    }
}
