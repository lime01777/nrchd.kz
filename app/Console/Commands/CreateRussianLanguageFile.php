<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoredTranslation;
use Illuminate\Support\Facades\File;

class CreateRussianLanguageFile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:russian-lang 
                            {--output=resources/lang/ru/common.php : Output file path}
                            {--force : Overwrite existing file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create complete Russian language file from all translated texts';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $outputFile = $this->option('output');
        $force = $this->option('force');

        $this->info("🔍 Creating Russian language file...");
        $this->info("Output file: $outputFile");

        // Проверяем существование файла
        if (File::exists($outputFile) && !$force) {
            $this->error("❌ File already exists. Use --force to overwrite.");
            return 1;
        }

        // Получаем все переводы на русский язык
        $this->info("\n📖 Loading Russian translations from database...");
        $translations = StoredTranslation::where('target_language', 'ru')
            ->where('is_verified', true)
            ->get();

        $this->info("📊 Found " . $translations->count() . " verified Russian translations");

        // Создаем массив переводов
        $russianTranslations = [];
        
        foreach ($translations as $translation) {
            // Создаем ключ на основе оригинального текста
            $key = $this->createKeyFromText($translation->original_text);
            $russianTranslations[$key] = $translation->translated_text;
        }

        // Добавляем базовые переводы, если их нет
        $basicTranslations = [
            'welcome' => 'Добро пожаловать',
            'home' => 'Главная',
            'about' => 'О нас',
            'contacts' => 'Контакты',
            'news' => 'Новости',
            'documents' => 'Документы',
            'more' => 'Подробнее',
            'read_more' => 'Читать далее',
            'search' => 'Поиск',
            'all_news' => 'Все новости',
            'all_documents' => 'Все документы',
            'directions' => 'Направления',
            'services' => 'Услуги',
            'about_center' => 'О центре',
            'branches' => 'Территориальные департаменты',
            'center_name' => 'Национальный научный центр охраны здоровья имени Салидат Каирбековой',
            'medical_education' => 'Медицинское образование',
            'medical_science' => 'Медицинская наука',
            'medical_statistics' => 'Медицинская статистика',
            'healthcare_quality' => 'Качество здравоохранения',
            'medical_personnel' => 'Развитие медицинских кадров',
            'healthcare_financing' => 'Финансирование здравоохранения',
            'health_informatization' => 'Информатизация здравоохранения',
            'pharmaceutical_policy' => 'Фармацевтическая политика',
            'integrative_medicine' => 'Интегративная медицина',
            'international_cooperation' => 'Международное сотрудничество',
            'education_programs' => 'Образовательные программы',
            'scientific_projects' => 'Научные проекты',
            'medical_expertise' => 'Медицинская экспертиза',
            'expert_evaluation' => 'Экспертная оценка',
            'scientific_support' => 'Научная поддержка',
            'educational_services' => 'Образовательные услуги',
            'consulting_services' => 'Консультационные услуги',
            'organizational_services' => 'Организационно-методические услуги',
            'about_us' => 'О нас',
            'mission_vision' => 'Миссия и видение',
            'history' => 'История',
            'leadership' => 'Руководство',
            'structure' => 'Структура',
            'partners' => 'Партнеры',
            'projects' => 'Проекты',
            'vacancies' => 'Вакансии',
            'press_center' => 'Пресс-центр',
            'accessibility' => 'Версия для слабовидящих',
            'normal_view' => 'Обычная версия',
            'address' => 'Адрес',
            'phone' => 'Телефон',
            'email' => 'Электронная почта',
            'social_networks' => 'Социальные сети',
            'copyright' => 'Все права защищены',
            'privacy_policy' => 'Политика конфиденциальности',
            'terms_of_use' => 'Условия использования',
            'loading' => 'Загрузка...',
            'error_occurred' => 'Произошла ошибка',
            'try_again' => 'Попробуйте снова',
            'back' => 'Назад',
            'next' => 'Далее',
            'previous' => 'Предыдущий',
            'submit' => 'Отправить',
            'cancel' => 'Отмена',
            'save' => 'Сохранить',
            'delete' => 'Удалить',
            'edit' => 'Редактировать',
            'view' => 'Просмотр',
            'download' => 'Скачать',
            'uploads' => 'Загрузки',
            'published_at' => 'Опубликовано',
            'no_results' => 'Результаты не найдены',
            'toggle_navigation' => 'Переключить навигацию',
            'language' => 'Язык',
            'language_ru' => 'Русский',
            'language_kz' => 'Казахский',
            'language_en' => 'Английский',
            'recent_news' => 'Последние новости',
            'events' => 'События',
            'upcoming_events' => 'Предстоящие события',
            'date' => 'Дата',
            'time' => 'Время',
            'location' => 'Место',
            'categories' => 'Категории',
            'contact_us' => 'Свяжитесь с нами',
            'send_message' => 'Отправить сообщение',
            'your_name' => 'Ваше имя',
            'your_email' => 'Ваш email',
            'subject' => 'Тема',
            'message' => 'Сообщение',
            'required_field' => 'Обязательное поле',
            'form_submitted' => 'Форма отправлена',
            'thank_you' => 'Спасибо',
            'login' => 'Войти',
            'register' => 'Регистрация',
            'logout' => 'Выйти',
            'password' => 'Пароль',
            'forgot_password' => 'Забыли пароль?',
            'remember_me' => 'Запомнить меня',
            'statistics' => 'Статистика',
            'year' => 'Год',
            'month' => 'Месяц',
            'quarter' => 'Квартал',
            'total' => 'Всего',
            'chart_planned' => 'Плановые',
            'chart_emergency' => 'Экстренные',
            'chart_visits' => 'Амбулаторные посещения',
            'chart_diseases' => 'Заболевания',
            'chart_hospitalizations' => 'Госпитализации',
            'visits' => 'Посещения',
            'diseases' => 'Заболевания',
            'hospitalizations' => 'Госпитализации',
            'period' => 'Период',
            'indicators' => 'Показатели',
            'dynamics' => 'Динамика',
            'admin' => 'Администратор',
            'news_title' => 'Новости',
            'news_image' => 'Изображение новости',
            'no_images' => 'Нет изображений',
            'accessibility_mode' => 'Версия для слабовидящих',
            'error' => 'Ошибка',
            'success' => 'Успешно',
            'upload' => 'Загрузить',
            'filter' => 'Фильтр',
            'sort' => 'Сортировка',
            'refresh' => 'Обновить',
            'close' => 'Закрыть',
            'open' => 'Открыть',
            'first' => 'Первая',
            'last' => 'Последняя',
            'page' => 'Страница',
            'of' => 'из',
            'items' => 'элементов',
            'items_per_page' => 'Элементов на странице',
            'showing' => 'Показано',
            'to' => 'до',
            'from' => 'с',
            'no_data' => 'Нет данных',
            'contact_support' => 'Обратиться в поддержку',
            'today' => 'Сегодня',
            'yesterday' => 'Вчера',
            'tomorrow' => 'Завтра',
            'this_week' => 'На этой неделе',
            'this_month' => 'В этом месяце',
            'this_year' => 'В этом году',
            'last_week' => 'На прошлой неделе',
            'last_month' => 'В прошлом месяце',
            'last_year' => 'В прошлом году',
            'active' => 'Активный',
            'inactive' => 'Неактивный',
            'pending' => 'В ожидании',
            'completed' => 'Завершено',
            'cancelled' => 'Отменено',
            'draft' => 'Черновик',
            'published' => 'Опубликовано',
            'unpublished' => 'Не опубликовано',
            'required' => 'Обязательно',
            'optional' => 'Необязательно',
            'invalid' => 'Недействительно',
            'valid' => 'Действительно',
            'reset' => 'Сбросить',
            'clear' => 'Очистить',
            'confirm' => 'Подтвердить',
            'yes' => 'Да',
            'no' => 'Нет',
            'ok' => 'ОК',
            'apply' => 'Применить',
            'select' => 'Выбрать',
            'choose' => 'Выбрать',
            'browse' => 'Обзор',
            'upload_file' => 'Загрузить файл',
            'drag_drop' => 'Перетащите файлы сюда или нажмите для загрузки',
            'file_size_limit' => 'Ограничение размера файла',
            'allowed_formats' => 'Разрешенные форматы',
            'notification' => 'Уведомление',
            'success_notification' => 'Успешно выполнено',
            'error_notification' => 'Произошла ошибка',
            'warning_notification' => 'Предупреждение',
            'info_notification' => 'Информация',
            'modal_title' => 'Заголовок',
            'modal_message' => 'Сообщение',
            'modal_confirm' => 'Подтвердить',
            'modal_cancel' => 'Отмена',
            'modal_close' => 'Закрыть',
            'modal_save' => 'Сохранить',
            'modal_delete' => 'Удалить',
            'modal_edit' => 'Редактировать',
            'modal_view' => 'Просмотр',
            'modal_add' => 'Добавить',
            'modal_create' => 'Создать',
            'modal_update' => 'Обновить',
            'modal_remove' => 'Удалить',
            'pagination_previous' => 'Предыдущая',
            'pagination_next' => 'Следующая',
            'pagination_first' => 'Первая',
            'pagination_last' => 'Последняя',
            'pagination_page' => 'Страница',
            'pagination_of' => 'из',
            'pagination_showing' => 'Показано',
            'pagination_to' => 'до',
            'pagination_from' => 'с',
            'pagination_total' => 'всего',
            'pagination_items' => 'элементов',
            'pagination_items_per_page' => 'Элементов на странице',
            'filter_all' => 'Все',
            'filter_none' => 'Ничего',
            'filter_select_all' => 'Выбрать все',
            'filter_clear_all' => 'Очистить все',
            'filter_search' => 'Поиск...',
            'filter_no_options' => 'Нет доступных опций',
            'filter_loading' => 'Загрузка...',
            'sort_asc' => 'По возрастанию',
            'sort_desc' => 'По убыванию',
            'sort_none' => 'Без сортировки',
            'sort_name' => 'По имени',
            'sort_date' => 'По дате',
            'sort_size' => 'По размеру',
            'sort_type' => 'По типу',
            'validation_required' => 'Это поле обязательно для заполнения',
            'validation_email' => 'Пожалуйста, введите корректный email адрес',
            'validation_min' => 'Минимальное значение: :min',
            'validation_max' => 'Максимальное значение: :max',
            'validation_between' => 'Значение должно быть между :min и :max',
            'validation_numeric' => 'Пожалуйста, введите число',
            'validation_integer' => 'Пожалуйста, введите целое число',
            'validation_url' => 'Пожалуйста, введите корректный URL',
            'validation_date' => 'Пожалуйста, введите корректную дату',
            'validation_after' => 'Дата должна быть после :date',
            'validation_before' => 'Дата должна быть до :date',
            'validation_confirmed' => 'Подтверждение не совпадает',
            'validation_unique' => 'Это значение уже существует',
            'validation_exists' => 'Выбранное значение недействительно',
            'time_ago' => 'назад',
            'time_just_now' => 'только что',
            'time_minutes' => 'минут',
            'time_hours' => 'часов',
            'time_days' => 'дней',
            'time_weeks' => 'недель',
            'time_months' => 'месяцев',
            'time_years' => 'лет',
            'time_second' => 'секунда',
            'time_minute' => 'минута',
            'time_hour' => 'час',
            'time_day' => 'день',
            'time_week' => 'неделя',
            'time_month' => 'месяц',
            'time_year' => 'год',
            'media_file' => 'Медиа файл',
            'no_media_files' => 'Нет медиа файлов для отображения',
            'browser_not_support_video' => 'Ваш браузер не поддерживает тег видео.',
            'video' => 'Видео',
            'image' => 'Изображение',
            'pause' => 'Пауза',
            'play' => 'Воспроизвести',
            'previous_slide' => 'Предыдущий слайд',
            'next_slide' => 'Следующий слайд',
            'go_to_slide' => 'Перейти к слайду',
        ];

        // Объединяем базовые переводы с переводами из базы данных
        $russianTranslations = array_merge($basicTranslations, $russianTranslations);

        // Сортируем по ключам
        ksort($russianTranslations);

        // Создаем содержимое файла
        $fileContent = "<?php\n\nreturn array (\n";
        
        foreach ($russianTranslations as $key => $value) {
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

        $this->info("\n✅ Russian language file created successfully!");
        $this->info("📊 Total translations: " . count($russianTranslations));
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
