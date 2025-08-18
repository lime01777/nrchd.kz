<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class UpdateLanguageFiles extends Command
{
    protected $signature = 'update:language-files';
    protected $description = 'Update language files with new translation keys';

    protected $newTranslations = [
        // Направления
        'directions.medical_education' => [
            'kz' => 'Медициналық білім беру',
            'ru' => 'Медицинское образование',
            'en' => 'Medical Education'
        ],
        'directions.human_resources' => [
            'kz' => 'Денсаулық сақтау кадрлық ресурстары',
            'ru' => 'Кадровые ресурсы здравоохранения',
            'en' => 'Healthcare Human Resources'
        ],
        'directions.electronic_health' => [
            'kz' => 'Электрондық денсаулық сақтау',
            'ru' => 'Электронное здравоохранение',
            'en' => 'Electronic Healthcare'
        ],
        'directions.accreditation' => [
            'kz' => 'Аккредитация',
            'ru' => 'Аккредитация',
            'en' => 'Accreditation'
        ],
        'directions.health_tech_assessment' => [
            'kz' => 'Денсаулық сақтау технологияларын бағалау',
            'ru' => 'Оценка технологий здравоохранения',
            'en' => 'Health Technology Assessment'
        ],
        'directions.clinical_protocols' => [
            'kz' => 'Клиникалық хаттамалар',
            'ru' => 'Клинические протоколы',
            'en' => 'Clinical Protocols'
        ],
        'directions.strategic_initiatives' => [
            'kz' => 'Стратегиялық бастамалар және халықаралық ынтымақтастық',
            'ru' => 'Стратегические инициативы и международное сотрудничество',
            'en' => 'Strategic Initiatives and International Cooperation'
        ],
        'directions.medical_rating' => [
            'kz' => 'Медициналық ұйымдар рейтингі',
            'ru' => 'Рейтинг медицинских организаций',
            'en' => 'Medical Organizations Rating'
        ],
        'directions.medical_science' => [
            'kz' => 'Медициналық ғылым',
            'ru' => 'Медицинская наука',
            'en' => 'Medical Science'
        ],
        'directions.bioethics' => [
            'kz' => 'Биоэтика бойынша орталық комиссия',
            'ru' => 'Центральная комиссия по биоэтике',
            'en' => 'Central Commission on Bioethics'
        ],
        'directions.drug_policy' => [
            'kz' => 'Дәрі-дәрмек саясаты',
            'ru' => 'Лекарственная политика',
            'en' => 'Drug Policy'
        ],
        'directions.primary_healthcare' => [
            'kz' => 'Бастапқы медициналық-санитариялық көмек',
            'ru' => 'Первичная медико-санитарная помощь',
            'en' => 'Primary Healthcare'
        ],
        'directions.health_accounts' => [
            'kz' => 'Денсаулық сақтаудың ұлттық есептері',
            'ru' => 'Национальные счета здравоохранения',
            'en' => 'National Health Accounts'
        ],
        'directions.medical_statistics' => [
            'kz' => 'Медициналық статистика',
            'ru' => 'Медицинская статистика',
            'en' => 'Medical Statistics'
        ],
        'directions.tech_competence' => [
            'kz' => 'Технологиялық құзыреттілік салалық орталығы',
            'ru' => 'Отраслевой центр технологических компетенций',
            'en' => 'Industry Center for Technological Competencies'
        ],
        'directions.center_prevention' => [
            'kz' => 'Денсаулықты сақтау және нығайту орталығы',
            'ru' => 'Центр профилактики и укрепления здоровья',
            'en' => 'Center for Prevention and Health Promotion'
        ],
        
        // О центре
        'about.center' => [
            'kz' => 'Орталық туралы',
            'ru' => 'О Центре',
            'en' => 'About Center'
        ],
        'about.salidat_kairbekova' => [
            'kz' => 'Салидат Кайырбекова',
            'ru' => 'Салидат Каирбекова',
            'en' => 'Salidat Kairbekova'
        ],
        'about.faq' => [
            'kz' => 'Сұрақтар мен жауаптар',
            'ru' => 'Вопросы и ответы',
            'en' => 'FAQ'
        ],
        'about.contact_info' => [
            'kz' => 'Байланыс ақпараты',
            'ru' => 'Контактная информация',
            'en' => 'Contact Information'
        ],
        'about.partners' => [
            'kz' => 'Серіктестер',
            'ru' => 'Партнеры',
            'en' => 'Partners'
        ],
        
        // Услуги
        'services.training' => [
            'kz' => 'Қосымша және бейресми білім беру бойынша оқу циклдарын ұйымдастыру және өткізу',
            'ru' => 'Организация и проведение обучающих циклов по дополнительному и неформальному образованию',
            'en' => 'Organization and Conduct of Training Cycles for Additional and Non-formal Education'
        ],
        'services.ads_evaluation' => [
            'kz' => 'Жарнамалық материалдарды бағалау',
            'ru' => 'Оценка рекламных материалов',
            'en' => 'Advertising Materials Evaluation'
        ],
        'services.health_tech_assessment' => [
            'kz' => 'Денсаулық сақтау технологияларын бағалау',
            'ru' => 'Оценка технологий здравоохранения',
            'en' => 'Health Technology Assessment'
        ],
        'services.drug_expertise' => [
            'kz' => 'Дәрі-дәрмектерді сараптау',
            'ru' => 'Экспертиза лекарственных средств',
            'en' => 'Drug Expertise'
        ],
        'services.education_programs' => [
            'kz' => 'Қосымша білім беру ғылыми-білім беру бағдарламаларын сараптау',
            'ru' => 'Экспертиза научно-образовательных программ дополнительного образования',
            'en' => 'Expertise of Scientific and Educational Programs for Additional Education'
        ],
        'services.medical_expertise' => [
            'kz' => 'Ғылыми-медициналық сараптау',
            'ru' => 'Научно-медицинская экспертиза',
            'en' => 'Scientific and Medical Expertise'
        ],
        'services.accreditation' => [
            'kz' => 'Медициналық ұйымдар мен денсаулық сақтау ұйымдарын аккредитациялау',
            'ru' => 'Аккредитация медицинских организаций и организаций здравоохранения',
            'en' => 'Accreditation of Medical Organizations and Healthcare Organizations'
        ],
        'services.post_accreditation_monitoring' => [
            'kz' => 'Аккредитациядан кейінгі мониторинг',
            'ru' => 'Постаккредитационный мониторинг',
            'en' => 'Post-accreditation Monitoring'
        ],
        
        // Каталог
        'catalog.educational_programs' => [
            'kz' => 'Білім беру бағдарламаларының каталогы',
            'ru' => 'Каталог образовательных программ',
            'en' => 'Educational Programs Catalog'
        ],
        
        // Общие элементы
        'close' => [
            'kz' => 'Жабу',
            'ru' => 'Закрыть',
            'en' => 'Close'
        ],
        'cancel' => [
            'kz' => 'Болдырмау',
            'ru' => 'Отмена',
            'en' => 'Cancel'
        ],
        'confirm' => [
            'kz' => 'Растау',
            'ru' => 'Подтвердить',
            'en' => 'Confirm'
        ],
        'delete' => [
            'kz' => 'Жою',
            'ru' => 'Удалить',
            'en' => 'Delete'
        ],
        'edit' => [
            'kz' => 'Өңдеу',
            'ru' => 'Редактировать',
            'en' => 'Edit'
        ],
        'save' => [
            'kz' => 'Сақтау',
            'ru' => 'Сохранить',
            'en' => 'Save'
        ],
        'upload' => [
            'kz' => 'Жүктеу',
            'ru' => 'Загрузить',
            'en' => 'Upload'
        ],
        'download' => [
            'kz' => 'Жүктеу',
            'ru' => 'Скачать',
            'en' => 'Download'
        ],
        'search' => [
            'kz' => 'Іздеу',
            'ru' => 'Поиск',
            'en' => 'Search'
        ],
        'filter' => [
            'kz' => 'Сүзгі',
            'ru' => 'Фильтр',
            'en' => 'Filter'
        ],
        'sort' => [
            'kz' => 'Сұрыптау',
            'ru' => 'Сортировка',
            'en' => 'Sort'
        ],
        'show' => [
            'kz' => 'Көрсету',
            'ru' => 'Показать',
            'en' => 'Show'
        ],
        'hide' => [
            'kz' => 'Жасыру',
            'ru' => 'Скрыть',
            'en' => 'Hide'
        ],
        'next' => [
            'kz' => 'Келесі',
            'ru' => 'Далее',
            'en' => 'Next'
        ],
        'back' => [
            'kz' => 'Артқа',
            'ru' => 'Назад',
            'en' => 'Back'
        ],
        'first' => [
            'kz' => 'Бірінші',
            'ru' => 'Первый',
            'en' => 'First'
        ],
        'last' => [
            'kz' => 'Соңғы',
            'ru' => 'Последний',
            'en' => 'Last'
        ],
        'previous' => [
            'kz' => 'Алдыңғы',
            'ru' => 'Предыдущий',
            'en' => 'Previous'
        ],
        
        // Статусы
        'status.active' => [
            'kz' => 'Белсенді',
            'ru' => 'Активный',
            'en' => 'Active'
        ],
        'status.inactive' => [
            'kz' => 'Белсенді емес',
            'ru' => 'Неактивный',
            'en' => 'Inactive'
        ],
        'status.pending' => [
            'kz' => 'Күтуде',
            'ru' => 'Ожидает',
            'en' => 'Pending'
        ],
        'status.completed' => [
            'kz' => 'Аяқталды',
            'ru' => 'Завершено',
            'en' => 'Completed'
        ],
        'status.cancelled' => [
            'kz' => 'Болдырылмады',
            'ru' => 'Отменено',
            'en' => 'Cancelled'
        ],
        
        // Время
        'time.today' => [
            'kz' => 'Бүгін',
            'ru' => 'Сегодня',
            'en' => 'Today'
        ],
        'time.yesterday' => [
            'kz' => 'Кеше',
            'ru' => 'Вчера',
            'en' => 'Yesterday'
        ],
        'time.tomorrow' => [
            'kz' => 'Ертең',
            'ru' => 'Завтра',
            'en' => 'Tomorrow'
        ],
        'time.week' => [
            'kz' => 'Апта',
            'ru' => 'Неделя',
            'en' => 'Week'
        ],
        'time.month' => [
            'kz' => 'Ай',
            'ru' => 'Месяц',
            'en' => 'Month'
        ],
        'time.year' => [
            'kz' => 'Жыл',
            'ru' => 'Год',
            'en' => 'Year'
        ],
        
        // Документы
        'document.title' => [
            'kz' => 'Құжат атауы',
            'ru' => 'Название документа',
            'en' => 'Document Title'
        ],
        'document.description' => [
            'kz' => 'Сипаттама',
            'ru' => 'Описание',
            'en' => 'Description'
        ],
        'document.file_size' => [
            'kz' => 'Файл өлшемі',
            'ru' => 'Размер файла',
            'en' => 'File Size'
        ],
        'document.upload_date' => [
            'kz' => 'Жүктеу күні',
            'ru' => 'Дата загрузки',
            'en' => 'Upload Date'
        ],
        'document.file_type' => [
            'kz' => 'Файл түрі',
            'ru' => 'Тип файла',
            'en' => 'File Type'
        ],
        
        // Формы
        'form.name' => [
            'kz' => 'Аты',
            'ru' => 'Имя',
            'en' => 'Name'
        ],
        'form.email' => [
            'kz' => 'Email',
            'ru' => 'Email',
            'en' => 'Email'
        ],
        'form.phone' => [
            'kz' => 'Телефон',
            'ru' => 'Телефон',
            'en' => 'Phone'
        ],
        'form.message' => [
            'kz' => 'Хабарлама',
            'ru' => 'Сообщение',
            'en' => 'Message'
        ],
        'form.subject' => [
            'kz' => 'Тақырып',
            'ru' => 'Тема',
            'en' => 'Subject'
        ],
        'form.submit' => [
            'kz' => 'Жіберу',
            'ru' => 'Отправить',
            'en' => 'Submit'
        ],
        'form.clear' => [
            'kz' => 'Тазалау',
            'ru' => 'Очистить',
            'en' => 'Clear'
        ],
        'form.required_field' => [
            'kz' => 'Міндетті өріс',
            'ru' => 'Обязательное поле',
            'en' => 'Required Field'
        ],
        'form.invalid_format' => [
            'kz' => 'Дұрыс емес формат',
            'ru' => 'Неверный формат',
            'en' => 'Invalid Format'
        ],
        
        // Админ панель
        'admin.panel' => [
            'kz' => 'Әкімші панелі',
            'ru' => 'Админ-панель',
            'en' => 'Admin Panel'
        ],
        'admin.admin' => [
            'kz' => 'Әкімші',
            'ru' => 'Админ',
            'en' => 'Admin'
        ],
        'admin.management' => [
            'kz' => 'Басқару',
            'ru' => 'Управление',
            'en' => 'Management'
        ],
        'admin.settings' => [
            'kz' => 'Баптаулар',
            'ru' => 'Настройки',
            'en' => 'Settings'
        ],
        'admin.users' => [
            'kz' => 'Пайдаланушылар',
            'ru' => 'Пользователи',
            'en' => 'Users'
        ],
        'admin.roles' => [
            'kz' => 'Рөлдер',
            'ru' => 'Роли',
            'en' => 'Roles'
        ],
        'admin.permissions' => [
            'kz' => 'Рұқсаттар',
            'ru' => 'Права доступа',
            'en' => 'Permissions'
        ],
        
        // Регионы
        'regions.astana' => [
            'kz' => 'г. Астана',
            'ru' => 'г. Астана',
            'en' => 'Astana'
        ],
        'regions.almaty' => [
            'kz' => 'г. Алматы',
            'ru' => 'г. Алматы',
            'en' => 'Almaty'
        ],
        'regions.abay' => [
            'kz' => 'Абай облысы',
            'ru' => 'Абайская область',
            'en' => 'Abay Region'
        ],
        'regions.akmola' => [
            'kz' => 'Ақмола облысы',
            'ru' => 'Акмолинская область',
            'en' => 'Akmola Region'
        ],
        'regions.aktobe' => [
            'kz' => 'Ақтөбе облысы',
            'ru' => 'Актюбинская область',
            'en' => 'Aktobe Region'
        ],
        'regions.almaty_region' => [
            'kz' => 'Алматы облысы',
            'ru' => 'Алматинская область',
            'en' => 'Almaty Region'
        ],
        'regions.atyrau' => [
            'kz' => 'Атырау облысы',
            'ru' => 'Атырауская область',
            'en' => 'Atyrau Region'
        ],
        'regions.east_kazakhstan' => [
            'kz' => 'Шығыс Қазақстан облысы',
            'ru' => 'Восточно-Казахстанская область',
            'en' => 'East Kazakhstan Region'
        ],
        'regions.zhambyl' => [
            'kz' => 'Жамбыл облысы',
            'ru' => 'Жамбылская область',
            'en' => 'Zhambyl Region'
        ],
        'regions.zhetisu' => [
            'kz' => 'Жетісу облысы',
            'ru' => 'Жетысуская область',
            'en' => 'Zhetisu Region'
        ],
        'regions.west_kazakhstan' => [
            'kz' => 'Батыс Қазақстан облысы',
            'ru' => 'Западно-Казахстанская область',
            'en' => 'West Kazakhstan Region'
        ],
        'regions.karaganda' => [
            'kz' => 'Қарағанды облысы',
            'ru' => 'Карагандинская область',
            'en' => 'Karaganda Region'
        ],
        'regions.kostanay' => [
            'kz' => 'Қостанай облысы',
            'ru' => 'Костанайская область',
            'en' => 'Kostanay Region'
        ],
        'regions.kyzylorda' => [
            'kz' => 'Қызылорда облысы',
            'ru' => 'Кызылординская область',
            'en' => 'Kyzylorda Region'
        ],
        'regions.mangistau' => [
            'kz' => 'Маңғыстау облысы',
            'ru' => 'Мангистауская область',
            'en' => 'Mangistau Region'
        ],
        'regions.pavlodar' => [
            'kz' => 'Павлодар облысы',
            'ru' => 'Павлодарская область',
            'en' => 'Pavlodar Region'
        ],
        'regions.north_kazakhstan' => [
            'kz' => 'Солтүстік Қазақстан облысы',
            'ru' => 'Северо-Казахстанская область',
            'en' => 'North Kazakhstan Region'
        ],
        'regions.turkestan' => [
            'kz' => 'Түркістан облысы',
            'ru' => 'Туркестанская область',
            'en' => 'Turkestan Region'
        ],
        'regions.ulytau' => [
            'kz' => 'Ұлытау облысы',
            'ru' => 'Улытауская область',
            'en' => 'Ulytau Region'
        ],
        'regions.shymkent' => [
            'kz' => 'г. Шымкент',
            'ru' => 'г. Шымкент',
            'en' => 'Shymkent'
        ],
    ];

    public function handle()
    {
        $this->info('🔍 Updating language files with new translation keys...');
        
        $languages = ['kz', 'ru', 'en'];
        
        foreach ($languages as $lang) {
            $this->updateLanguageFile($lang);
        }
        
        $this->info('✅ Language files updated successfully!');
        
        return 0;
    }
    
    protected function updateLanguageFile($lang)
    {
        $filePath = "resources/lang/{$lang}/common.php";
        
        if (!File::exists($filePath)) {
            $this->warn("File {$filePath} does not exist, skipping...");
            return;
        }
        
        $translations = include $filePath;
        
        // Добавляем новые переводы
        foreach ($this->newTranslations as $key => $langTranslations) {
            if (isset($langTranslations[$lang])) {
                $translations[$key] = $langTranslations[$lang];
            }
        }
        
        // Сортируем переводы по ключам
        ksort($translations);
        
        // Генерируем PHP код
        $phpCode = "<?php\n\nreturn array (\n";
        
        foreach ($translations as $key => $value) {
            $phpCode .= "  '{$key}' => '{$value}',\n";
        }
        
        $phpCode .= ");\n";
        
        // Сохраняем файл
        File::put($filePath, $phpCode);
        
        $this->line("  ✅ Updated {$filePath}");
    }
}
