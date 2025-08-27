<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UpdateComponentTranslations extends Command
{
    protected $signature = 'update:component-translations {--dry-run : Show what would be changed without making changes}';
    protected $description = 'Update component translations to use the new translation system';

    protected $translations = [
        // Основные навигационные элементы
        'Направления' => 'directions',
        'О нас' => 'about',
        'Новости' => 'news',
        'Документы' => 'documents',
        'Услуги' => 'services',
        'Контакты' => 'contacts',
        'Вакансии' => 'vacancies',
        'Язык' => 'language',
        'Войти' => 'login',
        'Выйти' => 'logout',
        
        // Направления
        'Медицинское образование' => 'directions.medical_education',
        'Кадровые ресурсы здравоохранения' => 'directions.human_resources',
        'Электронное здравоохранение' => 'directions.electronic_health',
        'Аккредитация' => 'directions.accreditation',
        'Оценка технологий здравоохранения' => 'directions.health_tech_assessments',
        'Клинические протоколы' => 'directions.clinical_protocols',
        'Стратегические инициативы и международное сотрудничество' => 'directions.strategic_initiatives',
        'Рейтинг медицинских организаций' => 'directions.medical_rating',
        'Медицинская наука' => 'directions.medical_science',
        'Центральная комиссия по биоэтике' => 'directions.bioethics',
        'Лекарственная политика' => 'directions.drug_policy',
        'Первичная медико-санитарная помощь' => 'directions.primary_healthcare',
        'Национальные счета здравоохранения' => 'directions.health_accounts',
        'Медицинская статистика' => 'directions.medical_statistics',
        'Отраслевой центр технологических компетенций' => 'directions.tech_competence',
        'Центр профилактики и укрепления здоровья' => 'directions.center_prevention',
        
        // О центре
        'О Центре' => 'about.center',
        'Салидат Каирбекова' => 'about.salidat_kairbekova',
        'Вопросы и ответы' => 'about.faq',
        'Контактная информация' => 'about.contact_info',
        'Партнеры' => 'about.partners',
        
        // Услуги
        'Организация и проведение обучающих циклов по дополнительному и неформальному образованию' => 'services.training',
        'Оценка рекламных материалов' => 'services.ads_evaluation',
        'Оценка технологии здравоохранения' => 'services.health_tech_assessment',
        'Экспертиза лекарственных средств' => 'services.drug_expertise',
        'Экспертиза научно-образовательных программ дополнительного образования' => 'services.education_programs',
        'Научно-медицинская экспертиза' => 'services.medical_expertise',
        'Аккредитация медицинских организаций и организаций здравоохранения' => 'services.accreditation',
        'Постаккредитационный мониторинг' => 'services.post_accreditation_monitoring',
        
        // Каталог
        'Каталог образовательных программ' => 'catalog.educational_programs',
        
        // Общие элементы
        'Закрыть' => 'close',
        'Отмена' => 'cancel',
        'Подтвердить' => 'confirm',
        'Удалить' => 'delete',
        'Редактировать' => 'edit',
        'Сохранить' => 'save',
        'Загрузить' => 'upload',
        'Скачать' => 'download',
        'Поиск' => 'search',
        'Фильтр' => 'filter',
        'Сортировка' => 'sort',
        'Показать' => 'show',
        'Скрыть' => 'hide',
        'Далее' => 'next',
        'Назад' => 'back',
        'Первый' => 'first',
        'Последний' => 'last',
        'Предыдущий' => 'previous',
        'Следующий' => 'next_page',
        
        // Статусы
        'Активный' => 'status.active',
        'Неактивный' => 'status.inactive',
        'Ожидает' => 'status.pending',
        'Завершено' => 'status.completed',
        'Отменено' => 'status.cancelled',
        
        // Время
        'Сегодня' => 'time.today',
        'Вчера' => 'time.yesterday',
        'Завтра' => 'time.tomorrow',
        'Неделя' => 'time.week',
        'Месяц' => 'time.month',
        'Год' => 'time.year',
        
        // Документы
        'Название документа' => 'document.title',
        'Описание' => 'document.description',
        'Размер файла' => 'document.file_size',
        'Дата загрузки' => 'document.upload_date',
        'Тип файла' => 'document.file_type',
        
        // Формы
        'Имя' => 'form.name',
        'Email' => 'form.email',
        'Телефон' => 'form.phone',
        'Сообщение' => 'form.message',
        'Тема' => 'form.subject',
        'Отправить' => 'form.submit',
        'Очистить' => 'form.clear',
        'Обязательное поле' => 'form.required_field',
        'Неверный формат' => 'form.invalid_format',
        
        // Админ панель
        'Админ-панель' => 'admin.panel',
        'Админ' => 'admin.admin',
        'Управление' => 'admin.management',
        'Настройки' => 'admin.settings',
        'Пользователи' => 'admin.users',
        'Роли' => 'admin.roles',
        'Права доступа' => 'admin.permissions',
        
        // Регионы
        'г. Астана' => 'regions.astana',
        'г. Алматы' => 'regions.almaty',
        'Абайская область' => 'regions.abay',
        'Акмолинская область' => 'regions.akmola',
        'Актюбинская область' => 'regions.aktobe',
        'Алматинская область' => 'regions.almaty_region',
        'Атырауская область' => 'regions.atyrau',
        'Восточно-Казахстанская область' => 'regions.east_kazakhstan',
        'Жамбылская область' => 'regions.zhambyl',
        'Жетысуская область' => 'regions.zhetisu',
        'Западно-Казахстанская область' => 'regions.west_kazakhstan',
        'Карагандинская область' => 'regions.karaganda',
        'Костанайская область' => 'regions.kostanay',
        'Кызылординская область' => 'regions.kyzylorda',
        'Мангистауская область' => 'regions.mangistau',
        'Павлодарская область' => 'regions.pavlodar',
        'Северо-Казахстанская область' => 'regions.north_kazakhstan',
        'Туркестанская область' => 'regions.turkestan',
        'Улытауская область' => 'regions.ulytau',
        'г. Шымкент' => 'regions.shymkent',
    ];

    public function handle()
    {
        $this->info('🔍 Updating component translations...');
        
        $jsxFiles = $this->findJsxFiles();
        $this->info("Found " . count($jsxFiles) . " JSX files to process");
        
        $totalChanges = 0;
        
        foreach ($jsxFiles as $file) {
            $changes = $this->processFile($file);
            $totalChanges += $changes;
            
            if ($changes > 0) {
                $this->line("  ✅ {$file}: {$changes} changes");
            }
        }
        
        if ($this->option('dry-run')) {
            $this->info("🔍 Dry run completed. Would make {$totalChanges} changes.");
        } else {
            $this->info("✅ Completed! Made {$totalChanges} changes.");
        }
        
        return 0;
    }
    
    protected function findJsxFiles()
    {
        $files = [];
        $directories = [
            'resources/js/Components',
            'resources/js/Pages',
            'resources/js/Layouts'
        ];
        
        foreach ($directories as $dir) {
            if (File::exists($dir)) {
                $jsxFiles = File::glob($dir . '/**/*.jsx');
                $files = array_merge($files, $jsxFiles);
            }
        }
        
        return $files;
    }
    
    protected function processFile($filePath)
    {
        $content = File::get($filePath);
        $originalContent = $content;
        $changes = 0;
        
        // Добавляем импорт usePage если его нет
        if (!str_contains($content, 'usePage') && !str_contains($content, 'translations')) {
            $content = $this->addUsePageImport($content);
        }
        
        // Добавляем функцию перевода если её нет
        if (!str_contains($content, 'const t =') && !str_contains($content, 'translations')) {
            $content = $this->addTranslationFunction($content);
        }
        
        // Заменяем русский текст на переводы
        foreach ($this->translations as $russianText => $translationKey) {
            $patterns = [
                // title="Русский текст"
                '/title\s*=\s*["\']' . preg_quote($russianText, '/') . '["\']/',
                // title={"Русский текст"}
                '/title\s*=\s*\{["\']' . preg_quote($russianText, '/') . '["\']\}/',
                // "Русский текст" в JSX
                '/["\']' . preg_quote($russianText, '/') . '["\']/',
            ];
            
            foreach ($patterns as $pattern) {
                $replacement = $this->getReplacement($pattern, $russianText, $translationKey);
                $newContent = preg_replace($pattern, $replacement, $content);
                if ($newContent !== $content) {
                    $content = $newContent;
                    $changes++;
                }
            }
        }
        
        // Сохраняем файл если есть изменения и не dry-run
        if ($changes > 0 && !$this->option('dry-run')) {
            File::put($filePath, $content);
        }
        
        return $changes;
    }
    
    protected function addUsePageImport($content)
    {
        // Проверяем, есть ли уже импорт usePage
        if (str_contains($content, 'usePage')) {
            return $content;
        }
        
        // Добавляем импорт usePage
        $importPattern = '/import\s+.*?from\s+[\'"]@inertiajs\/react[\'"];?/';
        if (preg_match($importPattern, $content)) {
            $content = preg_replace($importPattern, '$0', $content);
            $content = str_replace('from \'@inertiajs/react\';', 'from \'@inertiajs/react\';', $content);
            $content = str_replace('from "@inertiajs/react";', 'from "@inertiajs/react";', $content);
        } else {
            // Добавляем новый импорт
            $content = "import { usePage } from '@inertiajs/react';\n" . $content;
        }
        
        return $content;
    }
    
    protected function addTranslationFunction($content)
    {
        // Ищем функцию компонента
        $functionPattern = '/function\s+(\w+)\s*\(/';
        if (preg_match($functionPattern, $content, $matches)) {
            $functionName = $matches[1];
            
            // Добавляем usePage и функцию перевода после объявления функции
            $translationCode = "
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
";
            
            $content = str_replace(
                "function {$functionName}(",
                "function {$functionName}(" . $translationCode,
                $content
            );
        }
        
        return $content;
    }
    
    protected function getReplacement($pattern, $russianText, $translationKey)
    {
        if (str_contains($pattern, 'title=')) {
            return "title={t('{$translationKey}', '{$russianText}')}";
        } else {
            return "{t('{$translationKey}', '{$russianText}')}";
        }
    }
}
