<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoredTranslation;
use Illuminate\Support\Facades\File;

class CreateEnglishLanguageFile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:english-lang 
                            {--output=resources/lang/en/common.php : Output file path}
                            {--force : Overwrite existing file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create complete English language file from all translated texts';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $outputFile = $this->option('output');
        $force = $this->option('force');

        $this->info("🔍 Creating English language file...");
        $this->info("Output file: $outputFile");

        // Проверяем существование файла
        if (File::exists($outputFile) && !$force) {
            $this->error("❌ File already exists. Use --force to overwrite.");
            return 1;
        }

        // Получаем все переводы на английский язык
        $this->info("\n📖 Loading English translations from database...");
        $translations = StoredTranslation::where('target_language', 'en')
            ->where('is_verified', true)
            ->get();

        $this->info("📊 Found " . $translations->count() . " verified English translations");

        // Создаем массив переводов
        $englishTranslations = [];
        
        foreach ($translations as $translation) {
            // Создаем ключ на основе оригинального текста
            $key = $this->createKeyFromText($translation->original_text);
            $englishTranslations[$key] = $translation->translated_text;
        }

        // Добавляем базовые переводы, если их нет
        $basicTranslations = [
            'welcome' => 'Welcome',
            'home' => 'Home',
            'about' => 'About',
            'contacts' => 'Contacts',
            'news' => 'News',
            'documents' => 'Documents',
            'more' => 'More',
            'read_more' => 'Read More',
            'search' => 'Search',
            'all_news' => 'All News',
            'all_documents' => 'All Documents',
            'directions' => 'Directions',
            'services' => 'Services',
            'about_center' => 'About Center',
            'branches' => 'Branches',
            'center_name' => 'National Scientific Center for Healthcare named after Salidat Kairbekova',
            'medical_education' => 'Medical Education',
            'medical_science' => 'Medical Science',
            'medical_statistics' => 'Medical Statistics',
            'healthcare_quality' => 'Healthcare Quality',
            'medical_personnel' => 'Medical Personnel Development',
            'healthcare_financing' => 'Healthcare Financing',
            'health_informatization' => 'Health Informatization',
            'pharmaceutical_policy' => 'Pharmaceutical Policy',
            'integrative_medicine' => 'Integrative Medicine',
            'international_cooperation' => 'International Cooperation',
            'education_programs' => 'Education Programs',
            'scientific_projects' => 'Scientific Projects',
            'medical_expertise' => 'Medical Expertise',
            'expert_evaluation' => 'Expert Evaluation',
            'scientific_support' => 'Scientific Support',
            'educational_services' => 'Educational Services',
            'consulting_services' => 'Consulting Services',
            'organizational_services' => 'Organizational and Methodological Services',
            'about_us' => 'About Us',
            'mission_vision' => 'Mission and Vision',
            'history' => 'History',
            'leadership' => 'Leadership',
            'structure' => 'Structure',
            'partners' => 'Partners',
            'projects' => 'Projects',
            'vacancies' => 'Vacancies',
            'press_center' => 'Press Center',
            'accessibility' => 'Accessibility Version for Visually Impaired',
            'normal_view' => 'Normal View',
            'address' => 'Address',
            'phone' => 'Phone',
            'email' => 'Email',
            'social_networks' => 'Social Networks',
            'copyright' => 'All Rights Reserved',
            'privacy_policy' => 'Privacy Policy',
            'terms_of_use' => 'Terms of Use',
            'loading' => 'Loading...',
            'error_occurred' => 'An error occurred',
            'try_again' => 'Try Again',
            'back' => 'Back',
            'next' => 'Next',
            'previous' => 'Previous',
            'submit' => 'Submit',
            'cancel' => 'Cancel',
            'save' => 'Save',
            'delete' => 'Delete',
            'edit' => 'Edit',
            'view' => 'View',
            'download' => 'Download',
            'uploads' => 'Uploads',
            'published_at' => 'Published at',
            'no_results' => 'No results found',
            'toggle_navigation' => 'Toggle Navigation',
            'language' => 'Language',
            'language_ru' => 'Russian',
            'language_kz' => 'Kazakh',
            'language_en' => 'English',
            'recent_news' => 'Recent News',
            'events' => 'Events',
            'upcoming_events' => 'Upcoming Events',
            'date' => 'Date',
            'time' => 'Time',
            'location' => 'Location',
            'categories' => 'Categories',
            'contact_us' => 'Contact Us',
            'send_message' => 'Send Message',
            'your_name' => 'Your Name',
            'your_email' => 'Your Email',
            'subject' => 'Subject',
            'message' => 'Message',
            'required_field' => 'Required field',
            'form_submitted' => 'Form submitted',
            'thank_you' => 'Thank you',
            'login' => 'Login',
            'register' => 'Register',
            'logout' => 'Logout',
            'password' => 'Password',
            'forgot_password' => 'Forgot Password?',
            'remember_me' => 'Remember Me',
            'statistics' => 'Statistics',
            'year' => 'Year',
            'month' => 'Month',
            'quarter' => 'Quarter',
            'total' => 'Total',
            'chart_planned' => 'Planned',
            'chart_emergency' => 'Emergency',
            'chart_visits' => 'Outpatient Visits',
            'chart_diseases' => 'Diseases',
            'chart_hospitalizations' => 'Hospitalizations',
            'visits' => 'Visits',
            'diseases' => 'Diseases',
            'hospitalizations' => 'Hospitalizations',
            'period' => 'Period',
            'indicators' => 'Indicators',
            'dynamics' => 'Dynamics',
            'admin' => 'Admin',
            'news_title' => 'News',
            'news_image' => 'News Image',
            'no_images' => 'No Images',
            'accessibility_mode' => 'Accessibility Version for Visually Impaired',
            'error' => 'Error',
            'success' => 'Success',
            'upload' => 'Upload',
            'filter' => 'Filter',
            'sort' => 'Sort',
            'refresh' => 'Refresh',
            'close' => 'Close',
            'open' => 'Open',
            'first' => 'First',
            'last' => 'Last',
            'page' => 'Page',
            'of' => 'of',
            'items' => 'items',
            'items_per_page' => 'Items per page',
            'showing' => 'Showing',
            'to' => 'to',
            'from' => 'from',
            'no_data' => 'No data available',
            'contact_support' => 'Contact Support',
            'today' => 'Today',
            'yesterday' => 'Yesterday',
            'tomorrow' => 'Tomorrow',
            'this_week' => 'This Week',
            'this_month' => 'This Month',
            'this_year' => 'This Year',
            'last_week' => 'Last Week',
            'last_month' => 'Last Month',
            'last_year' => 'Last Year',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'pending' => 'Pending',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'draft' => 'Draft',
            'published' => 'Published',
            'unpublished' => 'Unpublished',
            'required' => 'Required',
            'optional' => 'Optional',
            'invalid' => 'Invalid',
            'valid' => 'Valid',
            'reset' => 'Reset',
            'clear' => 'Clear',
            'confirm' => 'Confirm',
            'yes' => 'Yes',
            'no' => 'No',
            'ok' => 'OK',
            'apply' => 'Apply',
            'select' => 'Select',
            'choose' => 'Choose',
            'browse' => 'Browse',
            'upload_file' => 'Upload File',
            'drag_drop' => 'Drag and drop files here or click to upload',
            'file_size_limit' => 'File size limit',
            'allowed_formats' => 'Allowed formats',
            'notification' => 'Notification',
            'success_notification' => 'Successfully completed',
            'error_notification' => 'An error occurred',
            'warning_notification' => 'Warning',
            'info_notification' => 'Information',
            'modal_title' => 'Title',
            'modal_message' => 'Message',
            'modal_confirm' => 'Confirm',
            'modal_cancel' => 'Cancel',
            'modal_close' => 'Close',
            'modal_save' => 'Save',
            'modal_delete' => 'Delete',
            'modal_edit' => 'Edit',
            'modal_view' => 'View',
            'modal_add' => 'Add',
            'modal_create' => 'Create',
            'modal_update' => 'Update',
            'modal_remove' => 'Remove',
            'pagination_previous' => 'Previous',
            'pagination_next' => 'Next',
            'pagination_first' => 'First',
            'pagination_last' => 'Last',
            'pagination_page' => 'Page',
            'pagination_of' => 'of',
            'pagination_showing' => 'Showing',
            'pagination_to' => 'to',
            'pagination_from' => 'from',
            'pagination_total' => 'total',
            'pagination_items' => 'items',
            'pagination_items_per_page' => 'Items per page',
            'filter_all' => 'All',
            'filter_none' => 'None',
            'filter_select_all' => 'Select All',
            'filter_clear_all' => 'Clear All',
            'filter_search' => 'Search...',
            'filter_no_options' => 'No options available',
            'filter_loading' => 'Loading...',
            'sort_asc' => 'Ascending',
            'sort_desc' => 'Descending',
            'sort_none' => 'Unsorted',
            'sort_name' => 'By Name',
            'sort_date' => 'By Date',
            'sort_size' => 'By Size',
            'sort_type' => 'By Type',
            'validation_required' => 'This field is required',
            'validation_email' => 'Please enter a valid email address',
            'validation_min' => 'Minimum value: :min',
            'validation_max' => 'Maximum value: :max',
            'validation_between' => 'Value must be between :min and :max',
            'validation_numeric' => 'Please enter a number',
            'validation_integer' => 'Please enter an integer',
            'validation_url' => 'Please enter a valid URL',
            'validation_date' => 'Please enter a valid date',
            'validation_after' => 'Date must be after :date',
            'validation_before' => 'Date must be before :date',
            'validation_confirmed' => 'Confirmation does not match',
            'validation_unique' => 'This value already exists',
            'validation_exists' => 'Selected value is invalid',
            'time_ago' => 'ago',
            'time_just_now' => 'just now',
            'time_minutes' => 'minutes',
            'time_hours' => 'hours',
            'time_days' => 'days',
            'time_weeks' => 'weeks',
            'time_months' => 'months',
            'time_years' => 'years',
            'time_second' => 'second',
            'time_minute' => 'minute',
            'time_hour' => 'hour',
            'time_day' => 'day',
            'time_week' => 'week',
            'time_month' => 'month',
            'time_year' => 'year',
            'media_file' => 'Media File',
            'no_media_files' => 'No media files to display',
            'browser_not_support_video' => 'Your browser does not support the video tag.',
            'video' => 'Video',
            'image' => 'Image',
            'pause' => 'Pause',
            'play' => 'Play',
            'previous_slide' => 'Previous Slide',
            'next_slide' => 'Next Slide',
            'go_to_slide' => 'Go to Slide',
        ];

        // Объединяем базовые переводы с переводами из базы данных
        $englishTranslations = array_merge($basicTranslations, $englishTranslations);

        // Сортируем по ключам
        ksort($englishTranslations);

        // Создаем содержимое файла
        $fileContent = "<?php\n\nreturn array (\n";
        
        foreach ($englishTranslations as $key => $value) {
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

        $this->info("\n✅ English language file created successfully!");
        $this->info("📊 Total translations: " . count($englishTranslations));
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
