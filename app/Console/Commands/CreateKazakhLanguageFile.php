<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoredTranslation;
use Illuminate\Support\Facades\File;

class CreateKazakhLanguageFile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:kazakh-lang 
                            {--output=resources/lang/kz/common.php : Output file path}
                            {--force : Overwrite existing file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create complete Kazakh language file from all translated texts';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $outputFile = $this->option('output');
        $force = $this->option('force');

        $this->info("🔍 Creating Kazakh language file...");
        $this->info("Output file: $outputFile");

        // Проверяем существование файла
        if (File::exists($outputFile) && !$force) {
            $this->error("❌ File already exists. Use --force to overwrite.");
            return 1;
        }

        // Получаем все переводы на казахский язык
        $this->info("\n📖 Loading Kazakh translations from database...");
        $translations = StoredTranslation::where('target_language', 'kz')
            ->where('is_verified', true)
            ->get();

        $this->info("📊 Found " . $translations->count() . " verified Kazakh translations");

        // Создаем массив переводов
        $kazakhTranslations = [];
        
        foreach ($translations as $translation) {
            // Создаем ключ на основе оригинального текста
            $key = $this->createKeyFromText($translation->original_text);
            $kazakhTranslations[$key] = $translation->translated_text;
        }

        // Добавляем базовые переводы, если их нет
        $basicTranslations = [
            'welcome' => 'Хош келдіңіз',
            'home' => 'Басты бет',
            'about' => 'Біз туралы',
            'contacts' => 'Байланыстар',
            'news' => 'Жаңалықтар',
            'documents' => 'Құжаттар',
            'more' => 'Толығырақ',
            'read_more' => 'Толығырақ оқу',
            'search' => 'Іздеу',
            'all_news' => 'Барлық жаңалықтар',
            'all_documents' => 'Барлық құжаттар',
            'directions' => 'Бағыттар',
            'services' => 'Қызметтер',
            'about_center' => 'Орталық туралы',
            'branches' => 'Территориальный департаментдар',
            'center_name' => 'Салидат Каирбекова атындағы Ұлттық денсаулық сақтаудың ұлттық ғылыми орталығы',
            'medical_education' => 'Медициналық білім беру',
            'medical_science' => 'Медициналық ғылым',
            'medical_statistics' => 'Медициналық статистика',
            'healthcare_quality' => 'Денсаулық сақтау сапасы',
            'medical_personnel' => 'Медициналық кадрларды дамыту',
            'healthcare_financing' => 'Денсаулық сақтауды қаржыландыру',
            'health_informatization' => 'Денсаулық сақтауды ақпараттандыру',
            'pharmaceutical_policy' => 'Дәрілік саясат',
            'integrative_medicine' => 'Интегративті медицина',
            'international_cooperation' => 'Халықаралық ынтымақтастық',
            'education_programs' => 'Білім беру бағдарламалары',
            'scientific_projects' => 'Ғылыми жобалар',
            'medical_expertise' => 'Медициналық сараптама',
            'expert_evaluation' => 'Сараптамалық бағалау',
            'scientific_support' => 'Ғылыми қолдау',
            'educational_services' => 'Білім беру қызметтері',
            'consulting_services' => 'Кеңес беру қызметтері',
            'organizational_services' => 'Ұйымдастыру-әдістемелік қызметтер',
            'about_us' => 'Біз туралы',
            'mission_vision' => 'Миссия және көзқарас',
            'history' => 'Тарих',
            'leadership' => 'Басқару',
            'structure' => 'Құрылым',
            'partners' => 'Серіктестер',
            'projects' => 'Жобалар',
            'vacancies' => 'Бос орындар',
            'press_center' => 'Баспасөз орталығы',
            'accessibility' => 'Көру қабілеті нашар адамдарға арналған нұсқа',
            'normal_view' => 'Кәдімгі көрініс',
            'address' => 'Мекен-жай',
            'phone' => 'Телефон',
            'email' => 'Электрондық пошта',
            'social_networks' => 'Әлеуметтік желілер',
            'copyright' => 'Барлық құқықтар қорғалған',
            'privacy_policy' => 'Құпиялылық саясаты',
            'terms_of_use' => 'Пайдалану шарттары',
            'loading' => 'Жүктелуде...',
            'error_occurred' => 'Қате пайда болды',
            'try_again' => 'Қайталап көріңіз',
            'back' => 'Артқа',
            'next' => 'Келесі',
            'previous' => 'Алдыңғы',
            'submit' => 'Жіберу',
            'cancel' => 'Болдырмау',
            'save' => 'Сақтау',
            'delete' => 'Жою',
            'edit' => 'Өңдеу',
            'view' => 'Көру',
            'download' => 'Жүктеу',
            'uploads' => 'Жүктеулер',
            'published_at' => 'Жарияланған күні',
            'no_results' => 'Нәтижелер жоқ',
            'toggle_navigation' => 'Навигацияны ауыстыру',
            'language' => 'Тіл',
            'language_ru' => 'Орыс',
            'language_kz' => 'Қазақ',
            'language_en' => 'Ағылшын',
            'recent_news' => 'Соңғы жаңалықтар',
            'events' => 'Оқиғалар',
            'upcoming_events' => 'Алдағы оқиғалар',
            'date' => 'Күні',
            'time' => 'Уақыт',
            'location' => 'Орны',
            'categories' => 'Санаттар',
            'contact_us' => 'Бізбен хабарласыңыз',
            'send_message' => 'Хабарлама жіберу',
            'your_name' => 'Сіздің атыңыз',
            'your_email' => 'Сіздің электрондық поштаңыз',
            'subject' => 'Тақырып',
            'message' => 'Хабарлама',
            'required_field' => 'Міндетті өріс',
            'form_submitted' => 'Пішін жіберілді',
            'thank_you' => 'Рақмет сізге',
            'login' => 'Кіру',
            'register' => 'Тіркеу',
            'logout' => 'Шығыс',
            'password' => 'Құпия сөз',
            'forgot_password' => 'Құпия сөзді ұмыттыңыз ба?',
            'remember_me' => 'Мені есте сақтау',
            'statistics' => 'Статистика',
            'year' => 'Жыл',
            'month' => 'Ай',
            'quarter' => 'Тоқсан',
            'total' => 'Жалпы',
            'chart_planned' => 'Жоспарланған',
            'chart_emergency' => 'Жедел',
            'chart_visits' => 'Амбулаториялық келулер',
            'chart_diseases' => 'Аурулар',
            'chart_hospitalizations' => 'Ауруханаға жатқызу',
            'visits' => 'Келулер',
            'diseases' => 'Аурулар',
            'hospitalizations' => 'Ауруханаға жатқызу',
            'period' => 'Кезең',
            'indicators' => 'Көрсеткіштер',
            'dynamics' => 'Динамика',
            'admin' => 'Әкімші',
            'news_title' => 'Жаңалықтар',
            'news_image' => 'Жаңалық суреті',
            'no_images' => 'Суреттер жоқ',
            'accessibility_mode' => 'Көру қабілеті нашар адамдарға арналған нұсқа',
            'error' => 'Қате',
            'success' => 'Сәтті',
            'upload' => 'Жүктеу',
            'filter' => 'Сүзгі',
            'sort' => 'Сұрыптау',
            'refresh' => 'Жаңарту',
            'close' => 'Жабу',
            'open' => 'Ашу',
            'first' => 'Бірінші',
            'last' => 'Соңғы',
            'page' => 'Бет',
            'of' => '/',
            'items' => 'элемент',
            'items_per_page' => 'Бетке элементтер',
            'showing' => 'Көрсетілуде',
            'to' => 'дейін',
            'from' => 'бастап',
            'no_data' => 'Деректер жоқ',
            'contact_support' => 'Қолдау қызметіне хабарласыңыз',
            'today' => 'Бүгін',
            'yesterday' => 'Кеше',
            'tomorrow' => 'Ертең',
            'this_week' => 'Осы апта',
            'this_month' => 'Осы ай',
            'this_year' => 'Осы жыл',
            'last_week' => 'Өткен апта',
            'last_month' => 'Өткен ай',
            'last_year' => 'Өткен жыл',
            'active' => 'Белсенді',
            'inactive' => 'Белсенді емес',
            'pending' => 'Күтуде',
            'completed' => 'Аяқталды',
            'cancelled' => 'Болдырылмады',
            'draft' => 'Жоба',
            'published' => 'Жарияланды',
            'unpublished' => 'Жарияланбады',
            'required' => 'Міндетті',
            'optional' => 'Қосымша',
            'invalid' => 'Жарамсыз',
            'valid' => 'Жарамды',
            'reset' => 'Қалпына келтіру',
            'clear' => 'Тазалау',
            'confirm' => 'Растау',
            'yes' => 'Иә',
            'no' => 'Жоқ',
            'ok' => 'Жарайды',
            'apply' => 'Қолдану',
            'select' => 'Таңдау',
            'choose' => 'Таңдау',
            'browse' => 'Шолу',
            'upload_file' => 'Файл жүктеу',
            'drag_drop' => 'Файлды осында тастаңыз немесе жүктеу үшін басыңыз',
            'file_size_limit' => 'Файл өлшемі шектеуі',
            'allowed_formats' => 'Рұқсат етілген форматтар',
            'notification' => 'Хабарландыру',
            'success_notification' => 'Сәтті орындалды',
            'error_notification' => 'Қате пайда болды',
            'warning_notification' => 'Ескерту',
            'info_notification' => 'Ақпарат',
            'modal_title' => 'Тақырып',
            'modal_message' => 'Хабарлама',
            'modal_confirm' => 'Растау',
            'modal_cancel' => 'Болдырмау',
            'modal_close' => 'Жабу',
            'modal_save' => 'Сақтау',
            'modal_delete' => 'Жою',
            'modal_edit' => 'Өңдеу',
            'modal_view' => 'Көру',
            'modal_add' => 'Қосу',
            'modal_create' => 'Құру',
            'modal_update' => 'Жаңарту',
            'modal_remove' => 'Алып тастау',
            'pagination_previous' => 'Алдыңғы',
            'pagination_next' => 'Келесі',
            'pagination_first' => 'Бірінші',
            'pagination_last' => 'Соңғы',
            'pagination_page' => 'Бет',
            'pagination_of' => '/',
            'pagination_showing' => 'Көрсетілуде',
            'pagination_to' => 'дейін',
            'pagination_from' => 'бастап',
            'pagination_total' => 'барлығы',
            'pagination_items' => 'элемент',
            'pagination_items_per_page' => 'Бетке элементтер',
            'filter_all' => 'Барлығы',
            'filter_none' => 'Ешқайсысы',
            'filter_select_all' => 'Барлығын таңдау',
            'filter_clear_all' => 'Барлығын тазалау',
            'filter_search' => 'Іздеу...',
            'filter_no_options' => 'Опциялар жоқ',
            'filter_loading' => 'Жүктелуде...',
            'sort_asc' => 'Өсу бойынша',
            'sort_desc' => 'Кему бойынша',
            'sort_none' => 'Сұрыпталмаған',
            'sort_name' => 'Атау бойынша',
            'sort_date' => 'Күн бойынша',
            'sort_size' => 'Өлшем бойынша',
            'sort_type' => 'Түр бойынша',
            'validation_required' => 'Бұл өріс міндетті',
            'validation_email' => 'Жарамды электрондық пошта енгізіңіз',
            'validation_min' => 'Минималды мән: :min',
            'validation_max' => 'Максималды мән: :max',
            'validation_between' => 'Мән :min мен :max арасында болуы керек',
            'validation_numeric' => 'Сан енгізіңіз',
            'validation_integer' => 'Бүтін сан енгізіңіз',
            'validation_url' => 'Жарамды URL енгізіңіз',
            'validation_date' => 'Жарамды күн енгізіңіз',
            'validation_after' => 'Күн :date кейін болуы керек',
            'validation_before' => 'Күн :date бұрын болуы керек',
            'validation_confirmed' => 'Растау сәйкес емес',
            'validation_unique' => 'Бұл мән бұрыннан бар',
            'validation_exists' => 'Таңдалған мән жарамсыз',
            'time_ago' => 'бұрын',
            'time_just_now' => 'дәл қазір',
            'time_minutes' => 'минут',
            'time_hours' => 'сағат',
            'time_days' => 'күн',
            'time_weeks' => 'апта',
            'time_months' => 'ай',
            'time_years' => 'жыл',
            'time_second' => 'секунд',
            'time_minute' => 'минут',
            'time_hour' => 'сағат',
            'time_day' => 'күн',
            'time_week' => 'апта',
            'time_month' => 'ай',
            'time_year' => 'жыл',
            'media_file' => 'Медиа файл',
            'no_media_files' => 'Көрсету үшін медиа файлдары жоқ',
            'browser_not_support_video' => 'Сіздің браузеріңіз бейнені қолдамайды.',
            'video' => 'Бейне',
            'image' => 'Сурет',
            'pause' => 'Тоқтату',
            'play' => 'Ойнату',
            'previous_slide' => 'Алдыңғы слайд',
            'next_slide' => 'Келесі слайд',
            'go_to_slide' => 'Слайдқа өту',
        ];

        // Объединяем базовые переводы с переводами из базы данных
        $kazakhTranslations = array_merge($basicTranslations, $kazakhTranslations);

        // Сортируем по ключам
        ksort($kazakhTranslations);

        // Создаем содержимое файла
        $fileContent = "<?php\n\nreturn array (\n";
        
        foreach ($kazakhTranslations as $key => $value) {
            $escapedValue = str_replace("'", "\\'", $value);
            $fileContent .= "  '$key' => '$escapedValue',\n";
        }
        
        $fileContent .= ");\n";

        // Создаем директорию, если её нет
        $directory = dirname($outputFile);
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Сохраняем файл
        File::put($outputFile, $fileContent);

        $this->info("\n✅ Kazakh language file created successfully!");
        $this->info("📊 Total translations: " . count($kazakhTranslations));
        $this->info("💾 File saved to: $outputFile");

        return 0;
    }

    /**
     * Создает ключ на основе текста
     *
     * @param string $text
     * @return string
     */
    protected function createKeyFromText(string $text): string
    {
        // Убираем лишние символы и приводим к нижнему регистру
        $key = strtolower(trim($text));
        
        // Заменяем пробелы и специальные символы на подчеркивания
        $key = preg_replace('/[^a-zа-яё0-9\s]/ui', '', $key);
        $key = preg_replace('/\s+/', '_', $key);
        
        // Ограничиваем длину ключа
        if (mb_strlen($key) > 50) {
            $key = mb_substr($key, 0, 50);
        }
        
        // Убираем лишние подчеркивания
        $key = trim($key, '_');
        
        // Если ключ пустой, создаем хэш
        if (empty($key)) {
            $key = 'key_' . substr(md5($text), 0, 8);
        }
        
        return $key;
    }
}
