<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class AddAllRoutesToLocalized extends Command
{
    protected $signature = 'add:all-routes-to-localized';
    protected $description = 'Add all main routes to localized.php with language prefixes';

    public function handle()
    {
        $this->info('🔧 Adding all main routes to localized.php...');
        
        // Читаем текущий localized.php
        $localizedContent = File::get('routes/localized.php');
        
        // Добавляем все основные маршруты
        $newRoutes = $this->getAllRoutes();
        
        // Находим место для вставки
        $insertPosition = strrpos($localizedContent, '    // Добавьте другие маршруты здесь с тем же паттерном');
        
        if ($insertPosition === false) {
            $insertPosition = strrpos($localizedContent, '});');
        }
        
        $updatedContent = substr_replace($localizedContent, $newRoutes, $insertPosition, 0);
        
        // Сохраняем обновленный файл
        File::put('routes/localized.php', $updatedContent);
        
        $this->info("🎉 Successfully added all routes to localized.php!");
        
        return 0;
    }
    
    private function getAllRoutes()
    {
        return "
    // === НАПРАВЛЕНИЯ ===
    
    // Медицинское образование
    Route::get('/medical-education', function (\$locale) {
        return Inertia::render('Direction/MedicalEducation', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_education', \$locale),
        ]);
    })->name('medical.education');
    
    // Кадровые ресурсы
    Route::get('/human-resources', function (\$locale) {
        return Inertia::render('Direction/HumanResources', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('human_resources', \$locale),
        ]);
    })->name('human.resources');
    
    // Электронное здравоохранение
    Route::get('/electronic-health', function (\$locale) {
        return Inertia::render('Direction/ElectronicHealth', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('electronic_health', \$locale),
        ]);
    })->name('electronic.health');
    
    // Аккредитация
    Route::get('/medical-accreditation', function (\$locale) {
        return Inertia::render('Direction/MedicalAccreditation', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_accreditation', \$locale),
        ]);
    })->name('medical.accreditation');
    
    // Оценка технологий здравоохранения
    Route::get('/health-rate', function (\$locale) {
        return Inertia::render('Direction/HealthRate', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('health_rate', \$locale),
        ]);
    })->name('health.rate');
    
    // Стратегические инициативы
    Route::get('/strategic-initiatives', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives', \$locale),
        ]);
    })->name('strategic.initiatives');
    
    // Рейтинг медицинских организаций
    Route::get('/medical-rating', function (\$locale) {
        return Inertia::render('Direction/MedicalRating', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_rating', \$locale),
        ]);
    })->name('medical.rating');
    
    // Медицинская наука
    Route::get('/medical-science', function (\$locale) {
        return Inertia::render('Direction/MedicalScience', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_science', \$locale),
        ]);
    })->name('medical.science');
    
    // Биоэтика
    Route::get('/bioethics', function (\$locale) {
        return Inertia::render('Direction/Bioethics', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics', \$locale),
        ]);
    })->name('bioethics');
    
    // Лекарственная политика
    Route::get('/drug-policy', function (\$locale) {
        return Inertia::render('Direction/DrugPolicy', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('drug_policy', \$locale),
        ]);
    })->name('drug.policy');
    
    // Первичная медико-санитарная помощь
    Route::get('/primary-healthcare', function (\$locale) {
        return Inertia::render('Direction/PrimaryHealthCare', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('primary_healthcare', \$locale),
        ]);
    })->name('primary.healthcare');
    
    // Национальные счета здравоохранения
    Route::get('/health-accounts', function (\$locale) {
        return Inertia::render('Direction/HealthAccounts', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('health_accounts', \$locale),
        ]);
    })->name('health.accounts');
    
    // Медицинская статистика
    Route::get('/medical-statistics', function (\$locale) {
        return Inertia::render('Direction/MedicalStatistics', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_statistics', \$locale),
        ]);
    })->name('medical.statistics');
    
    // Технологические компетенции
    Route::get('/direction/tech-competence', function (\$locale) {
        return Inertia::render('Direction/TechCompetence', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('direction_tech_competence', \$locale),
        ]);
    })->name('direction.tech.competence');
    
    // Центр профилактики
    Route::get('/center-prevention', function (\$locale) {
        return Inertia::render('Direction/CenterPrevention', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('center_prevention', \$locale),
        ]);
    })->name('center.prevention');
    
    // === О ЦЕНТРЕ ===
    
    // О центре
    Route::get('/about-centre', function (\$locale) {
        return Inertia::render('AboutCentre/AboutCentre', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('about_centre', \$locale),
        ]);
    })->name('about.centre');
    
    // Салидат Каирбекова
    Route::get('/salidat-kairbekova', function (\$locale) {
        return Inertia::render('AboutCentre/SalidatKairbekova', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('salidat_kairbekova', \$locale),
        ]);
    })->name('salidat.kairbekova');
    
    // Вакансии
    Route::get('/vacancy-jobs', function (\$locale) {
        return Inertia::render('AboutCentre/Vacancy', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('vacancy_jobs', \$locale),
        ]);
    })->name('about.vacancy');
    
    // FAQ
    Route::get('/about-faq', function (\$locale) {
        return Inertia::render('AboutCentre/FAQ', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('about_faq', \$locale),
        ]);
    })->name('about.faq');
    
    // Контакты
    Route::get('/about-contacts', function (\$locale) {
        return Inertia::render('AboutCentre/Contacts', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('about_contacts', \$locale),
        ]);
    })->name('about.contacts');
    
    // Партнеры
    Route::get('/about-partners', function (\$locale) {
        return Inertia::render('AboutCentre/Partners', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('about_partners', \$locale),
        ]);
    })->name('about.partners');
    
    // === УСЛУГИ ===
    
    // Обучение
    Route::get('/training', function (\$locale) {
        return Inertia::render('Services/Training', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_training', \$locale),
        ]);
    })->name('services.training');
    
    // Оценка рекламных материалов
    Route::get('/ads-evaluation', function (\$locale) {
        return Inertia::render('Services/AdsEvaluation', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_ads_evaluation', \$locale),
        ]);
    })->name('services.adsEvaluation');
    
    // Оценка технологий здравоохранения
    Route::get('/health-tech-assessment', function (\$locale) {
        return Inertia::render('Services/HealthTechAssessment', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_health_tech_assessment', \$locale),
        ]);
    })->name('services.healthTechAssessment');
    
    // Экспертиза лекарственных средств
    Route::get('/drug-expertise', function (\$locale) {
        return Inertia::render('Services/DrugExpertise', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_drug_expertise', \$locale),
        ]);
    })->name('services.drugExpertise');
    
    // Образовательные программы
    Route::get('/education-programs', function (\$locale) {
        return Inertia::render('Services/EducationPrograms', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_education_programs', \$locale),
        ]);
    })->name('services.educationPrograms');
    
    // Медицинская экспертиза
    Route::get('/medical-expertise', function (\$locale) {
        return Inertia::render('Services/MedicalExpertise', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_medical_expertise', \$locale),
        ]);
    })->name('services.medicalExpertise');
    
    // Аккредитация
    Route::get('/accreditation', function (\$locale) {
        return Inertia::render('Services/Accreditation', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_accreditation', \$locale),
        ]);
    })->name('services.accreditation');
    
    // Постаккредитационный мониторинг
    Route::get('/post-accreditation-monitoring', function (\$locale) {
        return Inertia::render('Services/PostAccreditationMonitoring', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('services_post_accreditation_monitoring', \$locale),
        ]);
    })->name('services.postAccreditationMonitoring');
    
    // === ФИЛИАЛЫ ===
    
    // Астана
    Route::get('/astana', function (\$locale) {
        return Inertia::render('Branches/Astana', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_astana', \$locale),
        ]);
    })->name('branches.astana');
    
    // Алматы
    Route::get('/almaty', function (\$locale) {
        return Inertia::render('Branches/Almaty', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_almaty', \$locale),
        ]);
    })->name('branches.almaty');
    
    // Абай
    Route::get('/abay', function (\$locale) {
        return Inertia::render('Branches/Abay', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_abay', \$locale),
        ]);
    })->name('branches.abay');
    
    // Акмола
    Route::get('/akmola', function (\$locale) {
        return Inertia::render('Branches/Akmola', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_akmola', \$locale),
        ]);
    })->name('branches.akmola');
    
    // Актобе
    Route::get('/aktobe', function (\$locale) {
        return Inertia::render('Branches/Aktobe', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_aktobe', \$locale),
        ]);
    })->name('branches.aktobe');
    
    // Алматинская область
    Route::get('/almaty_region', function (\$locale) {
        return Inertia::render('Branches/AlmatyRegion', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_almatyregion', \$locale),
        ]);
    })->name('branches.almatyregion');
    
    // Атырау
    Route::get('/atyrau', function (\$locale) {
        return Inertia::render('Branches/Atyrau', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_atyrau', \$locale),
        ]);
    })->name('branches.atyrau');
    
    // Восточно-Казахстанская область
    Route::get('/east', function (\$locale) {
        return Inertia::render('Branches/East', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_east', \$locale),
        ]);
    })->name('branches.east');
    
    // Жамбылская область
    Route::get('/zhambyl', function (\$locale) {
        return Inertia::render('Branches/Zhambyl', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_zhambyl', \$locale),
        ]);
    })->name('branches.zhambyl');
    
    // Жетысуская область
    Route::get('/zhetisu', function (\$locale) {
        return Inertia::render('Branches/Zhetisu', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_zhetisu', \$locale),
        ]);
    })->name('branches.zhetisu');
    
    // Западно-Казахстанская область
    Route::get('/west', function (\$locale) {
        return Inertia::render('Branches/West', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_west', \$locale),
        ]);
    })->name('branches.west');
    
    // Карагандинская область
    Route::get('/karaganda', function (\$locale) {
        return Inertia::render('Branches/Karaganda', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_karaganda', \$locale),
        ]);
    })->name('branches.karaganda');
    
    // Костанайская область
    Route::get('/kostanay', function (\$locale) {
        return Inertia::render('Branches/Kostanay', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_kostanay', \$locale),
        ]);
    })->name('branches.kostanay');
    
    // Кызылординская область
    Route::get('/kyzylorda', function (\$locale) {
        return Inertia::render('Branches/Kyzylorda', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_kyzylorda', \$locale),
        ]);
    })->name('branches.kyzylorda');
    
    // Мангистауская область
    Route::get('/mangistau', function (\$locale) {
        return Inertia::render('Branches/Mangistau', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_mangistau', \$locale),
        ]);
    })->name('branches.mangistau');
    
    // Павлодарская область
    Route::get('/pavlodar', function (\$locale) {
        return Inertia::render('Branches/Pavlodar', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_pavlodar', \$locale),
        ]);
    })->name('branches.pavlodar');
    
    // Северо-Казахстанская область
    Route::get('/north', function (\$locale) {
        return Inertia::render('Branches/North', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_north', \$locale),
        ]);
    })->name('branches.north');
    
    // Туркестанская область
    Route::get('/turkestan', function (\$locale) {
        return Inertia::render('Branches/Turkestan', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_turkestan', \$locale),
        ]);
    })->name('branches.turkestan');
    
    // Улытауская область
    Route::get('/ulytau', function (\$locale) {
        return Inertia::render('Branches/Ulytau', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_ulytau', \$locale),
        ]);
    })->name('branches.ulytau');
    
    // Шымкент
    Route::get('/shymkent', function (\$locale) {
        return Inertia::render('Branches/Shymkent', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('branches_shymkent', \$locale),
        ]);
    })->name('branches.shymkent');
    
";
    }
}
