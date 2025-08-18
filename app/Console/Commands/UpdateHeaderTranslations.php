<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class UpdateHeaderTranslations extends Command
{
    protected $signature = 'update:header-translations';
    protected $description = 'Update Header component to use translations for all texts';

    public function handle()
    {
        $this->info('🔧 Updating Header component translations...');
        
        // Читаем Header компонент
        $headerContent = File::get('resources/js/Components/Header.jsx');
        
        // Замены для текстов, которые не используют переводы
        $replacements = [
            // О Центре
            '"О Центре"' => 't(\'about.center\', "О Центре")',
            '"Салидат Каирбекова"' => 't(\'about.salidat_kairbekova\', "Салидат Каирбекова")',
            '"Вакансии"' => 't(\'vacancies\', "Вакансии")',
            '"Вопросы и ответы"' => 't(\'about.faq\', "Вопросы и ответы")',
            '"Контактная информация"' => 't(\'about.contact_info\', "Контактная информация")',
            '"Партнеры"' => 't(\'about.partners\', "Партнеры")',
            
            // Услуги
            '"Организация и проведение обучающих циклов по дополнительному и неформальному образованию"' => 't(\'services.training\', "Организация и проведение обучающих циклов по дополнительному и неформальному образованию")',
            '"Оценка рекламных материалов"' => 't(\'services.ads_evaluation\', "Оценка рекламных материалов")',
            '"Оценка технологий здравоохранения"' => 't(\'services.health_tech_assessment\', "Оценка технологий здравоохранения")',
            '"Экспертиза лекарственных средств"' => 't(\'services.drug_expertise\', "Экспертиза лекарственных средств")',
            '"Экспертиза научно-образовательных программ дополнительного образования"' => 't(\'services.education_programs\', "Экспертиза научно-образовательных программ дополнительного образования")',
            '"Научно-медицинская экспертиза"' => 't(\'services.medical_expertise\', "Научно-медицинская экспертиза")',
            '"Аккредитация медицинских организаций и организаций здравоохранения"' => 't(\'services.accreditation\', "Аккредитация медицинских организаций и организаций здравоохранения")',
            '"Постаккредитационный мониторинг"' => 't(\'services.post_accreditation_monitoring\', "Постаккредитационный мониторинг")',
            
            // Основные тексты
            '"Направления"' => 't(\'directions\', "Направления")',
            '"Услуги"' => 't(\'services\', "Услуги")',
            '"О центре"' => 't(\'about.center\', "О центре")',
            '"Филиалы"' => 't(\'branches\', "Филиалы")',
            '"Новости"' => 't(\'news\', "Новости")',
            '"Админ"' => 't(\'admin\', "Админ")',
            '"Версия для слабовидящих"' => 't(\'accessibility_mode\', "Версия для слабовидящих")',
            
            // Название центра
            '"национальный научный центр развития <br />здравоохранения им. салидат каирбековой"' => 't(\'center_name\', "национальный научный центр развития <br />здравоохранения им. салидат каирбековой")',
        ];
        
        // Применяем замены
        foreach ($replacements as $search => $replace) {
            $headerContent = str_replace($search, $replace, $headerContent);
        }
        
        // Сохраняем обновленный файл
        File::put('resources/js/Components/Header.jsx', $headerContent);
        
        $this->info('✅ Header component updated successfully!');
        
        // Добавляем недостающие переводы
        $this->addMissingTranslations();
        
        return 0;
    }
    
    private function addMissingTranslations()
    {
        $this->info('🔧 Adding missing translations...');
        
        $missingTranslations = [
            'kz' => [
                'about.center' => 'Орталық туралы',
                'about.salidat_kairbekova' => 'Салидат Кайырбекова',
                'vacancies' => 'Бос орындар',
                'about.faq' => 'Сұрақтар мен жауаптар',
                'about.contact_info' => 'Байланыс ақпараты',
                'about.partners' => 'Серіктестер',
                'services.training' => 'Қосымша және бейресми білім беру бойынша оқу циклдарын ұйымдастыру және өткізу',
                'services.ads_evaluation' => 'Жарнама материалдарын бағалау',
                'services.health_tech_assessment' => 'Денсаулық сақтау технологияларын бағалау',
                'services.drug_expertise' => 'Дәрі-дәрмектерді сараптау',
                'services.education_programs' => 'Қосымша білім беру ғылыми-білім беру бағдарламаларын сараптау',
                'services.medical_expertise' => 'Ғылыми-медициналық сараптама',
                'services.accreditation' => 'Медициналық ұйымдар мен денсаулық сақтау ұйымдарын аккредитациялау',
                'services.post_accreditation_monitoring' => 'Постаккредитациялық мониторинг',
                'directions' => 'Бағыттар',
                'services' => 'Қызметтер',
                'branches' => 'Филиалдар',
                'news' => 'Жаңалықтар',
                'admin' => 'Әкімші',
                'accessibility_mode' => 'Көру қабілеті нашар адамдарға арналған нұсқа',
                'center_name' => 'Салидат Кайырбекова атындағы денсаулық сақтауды дамытудың ұлттық ғылыми орталығы',
            ],
            'ru' => [
                'about.center' => 'О Центре',
                'about.salidat_kairbekova' => 'Салидат Каирбекова',
                'vacancies' => 'Вакансии',
                'about.faq' => 'Вопросы и ответы',
                'about.contact_info' => 'Контактная информация',
                'about.partners' => 'Партнеры',
                'services.training' => 'Организация и проведение обучающих циклов по дополнительному и неформальному образованию',
                'services.ads_evaluation' => 'Оценка рекламных материалов',
                'services.health_tech_assessment' => 'Оценка технологий здравоохранения',
                'services.drug_expertise' => 'Экспертиза лекарственных средств',
                'services.education_programs' => 'Экспертиза научно-образовательных программ дополнительного образования',
                'services.medical_expertise' => 'Научно-медицинская экспертиза',
                'services.accreditation' => 'Аккредитация медицинских организаций и организаций здравоохранения',
                'services.post_accreditation_monitoring' => 'Постаккредитационный мониторинг',
                'directions' => 'Направления',
                'services' => 'Услуги',
                'branches' => 'Филиалы',
                'news' => 'Новости',
                'admin' => 'Админ',
                'accessibility_mode' => 'Версия для слабовидящих',
                'center_name' => 'национальный научный центр развития здравоохранения им. салидат каирбековой',
            ],
            'en' => [
                'about.center' => 'About Center',
                'about.salidat_kairbekova' => 'Salidat Kairbekova',
                'vacancies' => 'Vacancies',
                'about.faq' => 'Questions and Answers',
                'about.contact_info' => 'Contact Information',
                'about.partners' => 'Partners',
                'services.training' => 'Organization and conduct of training cycles for additional and non-formal education',
                'services.ads_evaluation' => 'Evaluation of advertising materials',
                'services.health_tech_assessment' => 'Healthcare technology assessment',
                'services.drug_expertise' => 'Expertise of medicines',
                'services.education_programs' => 'Expertise of scientific and educational programs of additional education',
                'services.medical_expertise' => 'Scientific and medical expertise',
                'services.accreditation' => 'Accreditation of medical organizations and healthcare organizations',
                'services.post_accreditation_monitoring' => 'Post-accreditation monitoring',
                'directions' => 'Directions',
                'services' => 'Services',
                'branches' => 'Branches',
                'news' => 'News',
                'admin' => 'Admin',
                'accessibility_mode' => 'Accessibility mode',
                'center_name' => 'National Scientific Center for Healthcare Development named after Salidat Kairbekova',
            ]
        ];
        
        // Добавляем переводы для каждого языка
        foreach (['kz', 'ru', 'en'] as $lang) {
            $langFile = "resources/lang/{$lang}/common.php";
            
            if (!File::exists($langFile)) {
                $this->error("Language file {$langFile} not found!");
                continue;
            }
            
            $translations = include $langFile;
            
            // Добавляем недостающие переводы
            foreach ($missingTranslations[$lang] as $key => $value) {
                $translations[$key] = $value;
            }
            
            // Сохраняем файл
            $content = "<?php\n\nreturn " . var_export($translations, true) . ";\n";
            File::put($langFile, $content);
            
            $this->info("✅ Added missing translations for {$lang}");
        }
        
        $this->info('🎉 All translations added successfully!');
    }
}
