<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Проверяем доступ к маршруту админки создания новостей и отсутствие устаревших ссылок.
 */
class AdminNewsAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Гость должен быть перенаправлен на страницу входа.
     */
    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.news.create', 'news'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Пользователь с ролью user получает 403 при попытке доступа.
     */
    public function test_regular_user_gets_forbidden_response(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get(route('admin.news.create', 'news'));

        $response->assertForbidden();
    }

    /**
     * Редактор имеет доступ к форме создания новости.
     */
    public function test_editor_can_open_create_form(): void
    {
        $editor = User::factory()->create([
            'role' => 'editor',
        ]);

        $response = $this->actingAs($editor)->get(route('admin.news.create', 'news'));

        $response->assertOk();
    }

    /**
     * Администратор имеет доступ к форме создания новости.
     */
    public function test_admin_can_open_create_form(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.news.create', 'news'));

        $response->assertOk();
    }

    /**
     * Проверяем, что оба сегмента news и media доступны для привилегированных ролей.
     */
    #[DataProvider('sectionProvider')]
    public function test_privileged_roles_can_access_both_sections(string $section, string $role): void
    {
        $user = User::factory()->create([
            'role' => $role,
        ]);

        $response = $this->actingAs($user)->get(route('admin.news.create', $section));

        $response->assertOk();
    }

    /**
     * Убеждаемся, что в проекте не осталось ссылок на admin.news.create с query-параметром type.
     */
    public function test_no_admin_news_create_links_with_type_query(): void
    {
        $paths = [
            resource_path('js'),
            resource_path('views'),
        ];

        $violations = [];
        $patterns = [
            "/route\\(['\"]admin\\.news\\.create['\"],\\s*\\{/u",
            "/route\\(['\"]admin\\.news\\.create['\"],\\s*\\[[^\\]]*['\"]type['\"]/u",
            "/admin\\/news\\/create\\?type=/u",
        ];

        foreach ($paths as $path) {
            if (! File::isDirectory($path)) {
                continue;
            }

            foreach (File::allFiles($path) as $file) {
                $contents = File::get($file->getPathname());

                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $contents)) {
                        $violations[] = Str::after($file->getPathname(), base_path() . DIRECTORY_SEPARATOR);
                        break;
                    }
                }
            }
        }

        $this->assertEmpty($violations, 'Найдены ссылки с ?type=: ' . implode(', ', $violations));
    }

    /**
     * Провайдер секций для теста доступа.
     *
     * @return array<int, array<int, string>>
     */
    public static function sectionProvider(): array
    {
        return [
            ['news', 'editor'],
            ['media', 'editor'],
            ['news', 'admin'],
            ['media', 'admin'],
        ];
    }
}

