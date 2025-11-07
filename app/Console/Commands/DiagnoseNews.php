<?php

namespace App\Console\Commands;

use App\Http\Requests\NewsRequest;
use App\Models\News;
use App\Policies\NewsPolicy;
use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DiagnoseNews extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'news:diagnose {--report=}';

    /**
     * The console command description.
     */
    protected $description = 'Проверка модуля "Новости" и генерация отчёта';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $results = [];

        $results[] = $this->check('db_table_news_exists', function () {
            $ok = Schema::hasTable('news');
            return [$ok, $ok ? 'Таблица news существует' : 'Таблица news не найдена', 'Выполните php artisan migrate'];
        });

        $results[] = $this->check('db_table_news_columns', function () {
            if (!Schema::hasTable('news')) {
                return [false, 'Таблица news отсутствует', 'Выполните php artisan migrate'];
            }

            $requiredColumns = [
                'title',
                'slug',
                'excerpt',
                'body',
                'cover_image_path',
                'cover_image_thumb_path',
                'cover_image_alt',
                'seo_title',
                'seo_description',
                'status',
                'published_at',
                'created_by',
                'deleted_at',
                'created_at',
                'updated_at',
            ];

            $missing = [];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn('news', $column)) {
                    $missing[] = $column;
                }
            }

            $ok = empty($missing);

            return [
                $ok,
                $ok ? 'Все обязательные поля присутствуют' : 'Отсутствуют поля: ' . implode(', ', $missing),
                'Обновите миграции и выполните php artisan migrate',
            ];
        });

        $results[] = $this->check('model_news_structure', function () {
            if (!class_exists(News::class)) {
                return [false, 'Класс App\Models\News не найден', 'Создайте модель App\Models\News'];
            }

            $model = new News();
            $uses = class_uses_recursive($model);
            $hasSoftDeletes = in_array('Illuminate\\Database\\Eloquent\\SoftDeletes', $uses, true);
            $fillable = $model->getFillable();
            $requiredFillable = [
                'title',
                'slug',
                'excerpt',
                'body',
                'cover_image_path',
                'cover_image_thumb_path',
                'cover_image_alt',
                'seo_title',
                'seo_description',
                'status',
                'published_at',
                'created_by',
            ];
            $missingFillable = array_diff($requiredFillable, $fillable);
            $hasCoverAccessor = method_exists($model, 'getCoverUrlAttribute');
            $hasThumbAccessor = method_exists($model, 'getCoverThumbUrlAttribute');

            $ok = $hasSoftDeletes && empty($missingFillable) && $hasCoverAccessor && $hasThumbAccessor;

            $details = [];
            if (!$hasSoftDeletes) {
                $details[] = 'отсутствует трейт SoftDeletes';
            }
            if ($missingFillable) {
                $details[] = 'fillable без: ' . implode(', ', $missingFillable);
            }
            if (!$hasCoverAccessor) {
                $details[] = 'нет аксессора getCoverUrlAttribute';
            }
            if (!$hasThumbAccessor) {
                $details[] = 'нет аксессора getCoverThumbUrlAttribute';
            }

            return [
                $ok,
                $ok ? 'Модель News соответствует требованиям' : implode('; ', $details),
                'Проверьте модель App\Models\News',
            ];
        });

        $results[] = $this->check('policy_registered', function () {
            if (!class_exists(NewsPolicy::class)) {
                return [false, 'NewsPolicy не найдена', 'Создайте App\Policies\NewsPolicy'];
            }

            $policy = Gate::getPolicyFor(News::class);
            $ok = $policy instanceof NewsPolicy;

            return [
                $ok,
                $ok ? 'NewsPolicy зарегистрирована для News' : 'NewsPolicy не зарегистрирована в Gate',
                'Добавьте Gate::policy(News::class, NewsPolicy::class) в AppServiceProvider',
            ];
        });

        $results[] = $this->check('routes_exist', function () {
            $router = app('router');
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

            $missing = [];
            foreach ($neededRoutes as $name) {
                if (!$router->has($name)) {
                    $missing[] = $name;
                }
            }

            $ok = empty($missing);

            return [
                $ok,
                $ok ? 'Все необходимые маршруты зарегистрированы' : 'Отсутствуют маршруты: ' . implode(', ', $missing),
                'Добавьте недостающие маршруты в routes/web.php',
            ];
        });

        $results[] = $this->check('components_exist', function () {
            $paths = [
                resource_path('js/Pages/Admin/News/Index.jsx'),
                resource_path('js/Pages/Admin/News/Form.jsx'),
                resource_path('js/Pages/News/Index.jsx'),
                resource_path('js/Pages/News/Show.jsx'),
            ];

            $missing = array_filter($paths, fn ($path) => !File::exists($path));
            $ok = empty($missing);

            return [
                $ok,
                $ok ? 'Компоненты Inertia найдены' : 'Нет файлов: ' . implode(', ', array_map('basename', $missing)),
                'Создайте недостающие компоненты в resources/js/Pages',
            ];
        });

        $results[] = $this->check('validation_rules', function () {
            if (!class_exists(NewsRequest::class)) {
                return [false, 'NewsRequest отсутствует', 'Создайте App\Http\Requests\NewsRequest'];
            }

            $request = app(NewsRequest::class);
            $rules = $request->rules();
            $missingRules = [];
            foreach (['title', 'body', 'status'] as $field) {
                if (!array_key_exists($field, $rules)) {
                    $missingRules[] = $field;
                }
            }

            $coverRules = $rules['cover'] ?? null;
            $coverOk = $coverRules && Str::contains($coverRules, 'image')
                && Str::contains($coverRules, 'mimes:jpg,jpeg,png,webp')
                && (Str::contains($coverRules, 'max:5120') || Str::contains($coverRules, 'max=5120'))
                && Str::contains($coverRules, 'dimensions:min_width=800,min_height=400');

            $ok = empty($missingRules) && $coverOk;

            $details = [];
            if ($missingRules) {
                $details[] = 'Нет правил для: ' . implode(', ', $missingRules);
            }
            if (!$coverOk) {
                $details[] = 'Правила для cover не соответствуют требованиям';
            }

            return [
                $ok,
                $ok ? 'Валидация NewsRequest корректна' : implode('; ', $details),
                'Обновите правила в App\Http\Requests\NewsRequest',
            ];
        });

        $results[] = $this->check('cover_upload_uses_intervention', function () {
            $controllerPath = app_path('Http/Controllers/Admin/NewsController.php');
            if (!File::exists($controllerPath)) {
                return [false, 'Admin/NewsController отсутствует', 'Создайте контроллер администратора'];
            }
            $contents = File::get($controllerPath);
            $hasIntervention = Str::contains($contents, 'Image::read(');
            $writesOriginal = Str::contains($contents, "Storage::disk('public')->put(");
            $writesThumb = Str::contains($contents, '_thumb');

            $ok = $hasIntervention && $writesOriginal && $writesThumb;

            return [
                $ok,
                $ok ? 'Загрузка обложки использует Intervention Image' : 'Не обнаружена генерация превью через Intervention Image',
                'Проверьте метод handleCoverUpload в Admin/NewsController',
            ];
        });

        $results[] = $this->check('storage_link', function () {
            $publicStorage = public_path('storage');
            $ok = is_link($publicStorage) || File::exists($publicStorage);

            return [
                $ok,
                $ok ? 'public/storage доступен' : 'Нет символической ссылки public/storage',
                'Выполните php artisan storage:link',
            ];
        });

        $results[] = $this->check('app_url_https', function () {
            $url = config('app.url');
            $ok = is_string($url) && str_starts_with((string) $url, 'https://');

            return [
                $ok,
                $ok ? "APP_URL={$url}" : 'APP_URL должен начинаться с https://',
                'Установите APP_URL=https://example.com в .env',
            ];
        });

        $results[] = $this->check('write_permissions', function () {
            $dirs = [storage_path(), base_path('bootstrap/cache')];
            $bad = [];
            foreach ($dirs as $dir) {
                if (!is_writable($dir)) {
                    $bad[] = $dir;
                }
            }
            $ok = empty($bad);

            return [
                $ok,
                $ok ? 'Права на каталоги корректны' : 'Недоступны для записи: ' . implode(', ', $bad),
                'Настройте права доступа (chown/chmod) для storage и bootstrap/cache',
            ];
        });

        $results[] = $this->check('news_index_http200', function () {
            /** @var HttpKernel $kernel */
            $kernel = app(HttpKernel::class);
            $request = Request::create('/news', 'GET', [], [], [], ['HTTP_ACCEPT' => 'text/html,application/xhtml+xml']);
            $response = $kernel->handle($request);
            $status = $response->getStatusCode();
            $kernel->terminate($request, $response);

            $ok = $status === 200;

            return [
                $ok,
                $ok ? 'Маршрут /news отвечает 200' : 'Маршрут /news вернул статус ' . $status,
                'Проверьте публичный контроллер новостей и маршруты',
            ];
        });

        $results[] = $this->check('news_detail_http200', function () {
            $news = News::query()->where('status', 'published')->orderByDesc('published_at')->first();
            if (!$news) {
                return [false, 'Нет опубликованных новостей для проверки', 'Создайте и опубликуйте новость'];
            }

            /** @var HttpKernel $kernel */
            $kernel = app(HttpKernel::class);
            $request = Request::create('/news/' . $news->slug, 'GET', [], [], [], ['HTTP_ACCEPT' => 'text/html,application/xhtml+xml']);
            $response = $kernel->handle($request);
            $status = $response->getStatusCode();
            $kernel->terminate($request, $response);

            $ok = $status === 200;

            return [
                $ok,
                $ok ? 'Детальная страница новости отвечает 200' : 'Маршрут /news/{slug} вернул статус ' . $status,
                'Убедитесь, что новость опубликована и существует контроллер',
            ];
        });

        $results[] = $this->check('listing_images_asset', function () {
            $news = News::query()->where('status', 'published')->orderByDesc('published_at')->first();
            if (!$news) {
                return [false, 'Нет опубликованных новостей с обложкой', 'Создайте новость и прикрепите обложку'];
            }

            $thumbUrl = $news->cover_thumb_url;
            $ok = is_string($thumbUrl) && Str::contains($thumbUrl, '/storage/');

            return [
                $ok,
                $ok ? 'Миниатюра ведёт в storage' : 'Миниатюра не использует путь asset("storage/..."), текущее значение: ' . $thumbUrl,
                'Проверьте аксессор getCoverThumbUrlAttribute и контроллер списка',
            ];
        });

        $results[] = $this->check('detail_alt_attribute', function () {
            $controllerPath = app_path('Http/Controllers/NewsPublicController.php');
            if (!File::exists($controllerPath)) {
                return [false, 'NewsPublicController отсутствует', 'Создайте публичный контроллер новостей'];
            }

            $contents = File::get($controllerPath);
            $hasAlt = Str::contains($contents, "'cover_image_alt' => $news->cover_image_alt");

            return [
                $hasAlt,
                $hasAlt ? 'Деталка передаёт cover_image_alt' : 'cover_image_alt не передаётся в представление',
                'Добавьте cover_image_alt в данные NewsPublicController::show',
            ];
        });

        $results[] = $this->check('seo_tags_present', function () {
            $componentPath = resource_path('js/Pages/News/Show.jsx');
            if (!File::exists($componentPath)) {
                return [false, 'News/Show.jsx отсутствует', 'Создайте компонент Show.jsx'];
            }
            $component = File::get($componentPath);
            $hasTitle = Str::contains($component, '<title>');
            $hasDescription = Str::contains($component, 'meta name="description"');
            $hasOgImage = Str::contains($component, 'og:image');
            $ok = $hasTitle && $hasDescription && $hasOgImage;

            return [
                $ok,
                $ok ? 'SEO-теги на деталке присутствуют' : 'Отсутствуют SEO-теги (title/meta/og:image)',
                'Добавьте title, meta description и og:image в News/Show.jsx',
            ];
        });

        $results[] = $this->check('feature_tests_pass', function () {
            try {
                $exitCode = Artisan::call('test', ['--filter' => 'NewsModuleTest']);
                $output = Artisan::output();
                $ok = $exitCode === 0;
                return [
                    $ok,
                    $ok ? 'Feature-тесты NewsModuleTest успешно проходят' : 'Тесты завершились с ошибками: ' . trim($output),
                    'Исправьте тесты NewsModuleTest или модуль новостей',
                ];
            } catch (\Throwable $e) {
                return [false, 'Не удалось запустить phpunit: ' . $e->getMessage(), 'Проверьте окружение тестов'];
            }
        });

        $results[] = $this->check('published_vs_draft_visibility', function () {
            DB::beginTransaction();
            try {
                $slugPublished = 'diagnose-published-' . Str::random(8);
                $slugDraft = 'diagnose-draft-' . Str::random(8);

                $published = News::create([
                    'title' => 'Диагностика опубликованной новости',
                    'slug' => $slugPublished,
                    'excerpt' => 'Диагностическая запись',
                    'body' => 'Контент диагностики',
                    'content' => 'Контент диагностики',
                    'status' => 'published',
                    'published_at' => now(),
                ]);

                $draft = News::create([
                    'title' => 'Диагностика черновика',
                    'slug' => $slugDraft,
                    'excerpt' => 'Диагностическая запись',
                    'body' => 'Контент диагностики',
                    'content' => 'Контент диагностики',
                    'status' => 'draft',
                ]);

                /** @var HttpKernel $kernel */
                $kernel = app(HttpKernel::class);

                $publishedRequest = Request::create('/news/' . $published->slug, 'GET');
                $publishedResponse = $kernel->handle($publishedRequest);
                $publishedStatus = $publishedResponse->getStatusCode();
                $kernel->terminate($publishedRequest, $publishedResponse);

                $draftRequest = Request::create('/news/' . $draft->slug, 'GET');
                $draftResponse = $kernel->handle($draftRequest);
                $draftStatus = $draftResponse->getStatusCode();
                $kernel->terminate($draftRequest, $draftResponse);

                DB::rollBack();

                $ok = $publishedStatus === 200 && $draftStatus === 404;

                return [
                    $ok,
                    $ok ? 'Опубликованная новость доступна, черновик скрыт' : 'Статусы доступа некорректны (published: ' . $publishedStatus . ', draft: ' . $draftStatus . ')',
                    'Проверьте NewsPublicController::show и статус публикации',
                ];
            } catch (\Throwable $e) {
                DB::rollBack();
                return [false, 'Не удалось проверить доступность новостей: ' . $e->getMessage(), 'Проверьте миграции и модель News'];
            }
        });

        $results[] = $this->check('admin_cover_replacement_logic', function () {
            $controllerPath = app_path('Http/Controllers/Admin/NewsController.php');
            if (!File::exists($controllerPath)) {
                return [false, 'Admin/NewsController отсутствует', 'Создайте контроллер администратора'];
            }
            $contents = File::get($controllerPath);
            $hasDelete = Str::contains($contents, "Storage::disk('public')->delete(");
            $hasHandle = Str::contains($contents, 'handleCoverUpload(');
            $ok = $hasDelete && $hasHandle;

            return [
                $ok,
                $ok ? 'Замена обложки удаляет старые файлы и загружает новые' : 'Не обнаружена логика удаления/перезаписи обложки',
                'Добавьте deleteCoverFiles и handleCoverUpload в Admin/NewsController',
            ];
        });

        $results[] = $this->check('listing_sorted_desc', function () {
            $modelPath = app_path('Models/News.php');
            if (!File::exists($modelPath)) {
                return [false, 'Модель News отсутствует', 'Создайте App\Models\News'];
            }
            $contents = File::get($modelPath);
            $hasScope = Str::contains($contents, 'orderByDesc(') && Str::contains($contents, "published_at");

            return [
                $hasScope,
                $hasScope ? 'scopePublished сортирует published_at по убыванию' : 'scopePublished не сортирует по published_at desc',
                'Обновите scopePublished в App\Models\News',
            ];
        });

        $results[] = $this->check('pagination_enabled', function () {
            $adminController = app_path('Http/Controllers/Admin/NewsController.php');
            $publicController = app_path('Http/Controllers/NewsPublicController.php');
            $missing = [];
            if (!File::exists($adminController) || !Str::contains(File::get($adminController), 'paginate(')) {
                $missing[] = 'админский контроллер';
            }
            if (!File::exists($publicController) || !Str::contains(File::get($publicController), 'paginate(')) {
                $missing[] = 'публичный контроллер';
            }
            $ok = empty($missing);

            return [
                $ok,
                $ok ? 'Пагинация в админке и публичной части настроена' : 'Нет paginate() в: ' . implode(', ', $missing),
                'Используйте paginate() для выдачи списка новостей',
            ];
        });

        // Формирование отчёта
        $report = $this->option('report');
        $failed = array_values(array_filter($results, fn ($result) => !$result['passed']));
        File::ensureDirectoryExists(storage_path('logs'));

        if ($report === 'json') {
            $payload = [
                'generated_at' => now()->toIso8601String(),
                'checks' => $results,
                'failed' => $failed,
            ];
            File::put(storage_path('logs/news_diagnose.json'), json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $this->line(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } elseif ($report === 'markdown') {
            $markdown = $this->toMarkdown($results, $failed);
            File::put(storage_path('logs/news_checklist.md'), $markdown);
            $this->line($markdown);
        } else {
            foreach ($results as $result) {
                $prefix = $result['passed'] ? '[OK] ' : '[FAIL] ';
                $this->line($prefix . $result['key'] . ' — ' . $result['details']);
                if (!$result['passed']) {
                    $this->line('  hint: ' . $result['fix_hint']);
                }
            }
        }

        return empty($failed) ? self::SUCCESS : self::FAILURE;
    }

    /**
     * Вспомогательный метод для выполнения проверки.
     *
     * @return array{key:string,passed:bool,details:string,fix_hint:string}
     */
    private function check(string $key, \Closure $closure): array
    {
        try {
            [$ok, $details, $hint] = $closure();
        } catch (\Throwable $e) {
            $ok = false;
            $details = 'Ошибка проверки: ' . $e->getMessage();
            $hint = 'См. логи приложения';
        }

        return [
            'key' => $key,
            'passed' => (bool) $ok,
            'details' => (string) $details,
            'fix_hint' => (string) $hint,
        ];
    }

    /**
     * Формирование Markdown-отчёта.
     */
    private function toMarkdown(array $results, array $failed): string
    {
        $lines = [];
        $lines[] = '# Чек-лист модуля «Новости»';
        $lines[] = ''; $lines[] = '## Проверки';
        foreach ($results as $result) {
            $lines[] = sprintf('- [%s] **%s** — %s', $result['passed'] ? 'x' : ' ', $result['key'], $result['details']);
        }
        $lines[] = '';
        $lines[] = '## Не выполнено';
        if (empty($failed)) {
            $lines[] = '- Всё выполнено';
        } else {
            foreach ($failed as $result) {
                $lines[] = sprintf('- **%s** → %s', $result['key'], $result['fix_hint']);
            }
        }

        return implode("\n", $lines);
    }
}
