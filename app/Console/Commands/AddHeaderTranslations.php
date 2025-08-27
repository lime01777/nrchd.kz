<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class AddHeaderTranslations extends Command
{
    protected $signature = 'add:header-translations';
    protected $description = 'Add missing translations for Header component';

    public function handle()
    {
        $this->info('🔧 Adding missing Header translations...');
        
        // Переводы для филиалов
        $branchesTranslations = [
            'kz' => [
                'branchesSubLinks.astana' => 'г. Астана',
                'branchesSubLinks.almaty' => 'г. Алматы',
                'branchesSubLinks.abay' => 'Абай облысы',
                'branchesSubLinks.akmola' => 'Ақмола облысы',
                'branchesSubLinks.aktobe' => 'Ақтөбе облысы',
                'branchesSubLinks.almatyregion' => 'Алматы облысы',
                'branchesSubLinks.atyrau' => 'Атырау облысы',
                'branchesSubLinks.east' => 'Шығыс Қазақстан облысы',
                'branchesSubLinks.zhambyl' => 'Жамбыл облысы',
                'branchesSubLinks.zhetisu' => 'Жетісу облысы',
                'branchesSubLinks.west' => 'Батыс Қазақстан облысы',
                'branchesSubLinks.karaganda' => 'Қарағанды облысы',
                'branchesSubLinks.kostanay' => 'Қостанай облысы',
                'branchesSubLinks.kyzylorda' => 'Қызылорда облысы',
                'branchesSubLinks.mangistau' => 'Маңғыстау облысы',
                'branchesSubLinks.pavlodar' => 'Павлодар облысы',
                'branchesSubLinks.north' => 'Солтүстік Қазақстан облысы',
                'branchesSubLinks.turkestan' => 'Түркістан облысы',
                'branchesSubLinks.ulytau' => 'Ұлытау облысы',
                'branchesSubLinks.shymkent' => 'г. Шымкент',
            ],
            'ru' => [
                'branchesSubLinks.astana' => 'г. Астана',
                'branchesSubLinks.almaty' => 'г. Алматы',
                'branchesSubLinks.abay' => 'Абайская область',
                'branchesSubLinks.akmola' => 'Акмолинская область',
                'branchesSubLinks.aktobe' => 'Актюбинская область',
                'branchesSubLinks.almatyregion' => 'Алматинская область',
                'branchesSubLinks.atyrau' => 'Атырауская область',
                'branchesSubLinks.east' => 'Восточно-Казахстанская область',
                'branchesSubLinks.zhambyl' => 'Жамбылская область',
                'branchesSubLinks.zhetisu' => 'Жетысуская область',
                'branchesSubLinks.west' => 'Западно-Казахстанская область',
                'branchesSubLinks.karaganda' => 'Карагандинская область',
                'branchesSubLinks.kostanay' => 'Костанайская область',
                'branchesSubLinks.kyzylorda' => 'Кызылординская область',
                'branchesSubLinks.mangistau' => 'Мангистауская область',
                'branchesSubLinks.pavlodar' => 'Павлодарская область',
                'branchesSubLinks.north' => 'Северо-Казахстанская область',
                'branchesSubLinks.turkestan' => 'Туркестанская область',
                'branchesSubLinks.ulytau' => 'Улытауская область',
                'branchesSubLinks.shymkent' => 'г. Шымкент',
            ],
            'en' => [
                'branchesSubLinks.astana' => 'Astana',
                'branchesSubLinks.almaty' => 'Almaty',
                'branchesSubLinks.abay' => 'Abay Region',
                'branchesSubLinks.akmola' => 'Akmola Region',
                'branchesSubLinks.aktobe' => 'Aktobe Region',
                'branchesSubLinks.almatyregion' => 'Almaty Region',
                'branchesSubLinks.atyrau' => 'Atyrau Region',
                'branchesSubLinks.east' => 'East Kazakhstan Region',
                'branchesSubLinks.zhambyl' => 'Zhambyl Region',
                'branchesSubLinks.zhetisu' => 'Zhetisu Region',
                'branchesSubLinks.west' => 'West Kazakhstan Region',
                'branchesSubLinks.karaganda' => 'Karaganda Region',
                'branchesSubLinks.kostanay' => 'Kostanay Region',
                'branchesSubLinks.kyzylorda' => 'Kyzylorda Region',
                'branchesSubLinks.mangistau' => 'Mangistau Region',
                'branchesSubLinks.pavlodar' => 'Pavlodar Region',
                'branchesSubLinks.north' => 'North Kazakhstan Region',
                'branchesSubLinks.turkestan' => 'Turkestan Region',
                'branchesSubLinks.ulytau' => 'Ulytau Region',
                'branchesSubLinks.shymkent' => 'Shymkent',
            ]
        ];
        
        // Переводы для направлений
        $directionsTranslations = [
            'kz' => [
                'directionsSubLinks.medical_education' => 'Медициналық білім беру',
                'directionsSubLinks.human_resources' => 'Денсаулық сақтау кадрлық ресурстары',
                'directionsSubLinks.electronic_health' => 'Электрондық денсаулық сақтау',
                'directionsSubLinks.medical_accreditation' => 'Аккредитация',
                'directionsSubLinks.health_rate' => 'Денсаулық сақтау технологияларын бағалау',
                'directionsSubLinks.clinical_protocols' => 'Клиникалық хаттамалар',
                'directionsSubLinks.strategic_initiatives' => 'Стратегиялық бастамалар және халықаралық ынтымақтастық',
                'directionsSubLinks.medical_rating' => 'Медициналық ұйымдар рейтингі',
                'directionsSubLinks.medical_science' => 'Медициналық ғылым',
                'directionsSubLinks.bioethics' => 'Биоэтика бойынша орталық комиссия',
                'directionsSubLinks.drug_policy' => 'Дәрі-дәрмек саясаты',
                'directionsSubLinks.primary_healthcare' => 'Бастапқы медициналық-санитариялық көмек',
                'directionsSubLinks.health_accounts' => 'Денсаулық сақтаудың ұлттық есептері',
                'directionsSubLinks.medical_statistics' => 'Медициналық статистика',
                'directionsSubLinks.direction_tech_competence' => 'Технологиялық құзыреттілік салалық орталығы',
                'directionsSubLinks.center_prevention' => 'Денсаулықты сақтау және нығайту орталығы',
                'directionsSubLinks.medical_tourism' => 'Медициналық туризм',
            ],
            'ru' => [
                'directionsSubLinks.medical_education' => 'Медицинское образование',
                'directionsSubLinks.human_resources' => 'Кадровые ресурсы здравоохранения',
                'directionsSubLinks.electronic_health' => 'Электронное здравоохранение',
                'directionsSubLinks.medical_accreditation' => 'Аккредитация',
                'directionsSubLinks.health_rate' => 'Оценка технологий здравоохранения',
                'directionsSubLinks.clinical_protocols' => 'Клинические протоколы',
                'directionsSubLinks.strategic_initiatives' => 'Стратегические инициативы и международное сотрудничество',
                'directionsSubLinks.medical_rating' => 'Рейтинг медицинских организаций',
                'directionsSubLinks.medical_science' => 'Медицинская наука',
                'directionsSubLinks.bioethics' => 'Центральная комиссия по биоэтике',
                'directionsSubLinks.drug_policy' => 'Лекарственная политика',
                'directionsSubLinks.primary_healthcare' => 'Первичная медико-санитарная помощь',
                'directionsSubLinks.health_accounts' => 'Национальные счета здравоохранения',
                'directionsSubLinks.medical_statistics' => 'Медицинская статистика',
                'directionsSubLinks.direction_tech_competence' => 'Отраслевой центр технологических компетенций',
                'directionsSubLinks.center_prevention' => 'Центр профилактики и укрепления здоровья',
                'directionsSubLinks.medical_tourism' => 'Медицинский туризм',
            ],
            'en' => [
                'directionsSubLinks.medical_education' => 'Medical Education',
                'directionsSubLinks.human_resources' => 'Healthcare Human Resources',
                'directionsSubLinks.electronic_health' => 'Electronic Healthcare',
                'directionsSubLinks.medical_accreditation' => 'Accreditation',
                'directionsSubLinks.health_rate' => 'Healthcare Technology Assessment',
                'directionsSubLinks.clinical_protocols' => 'Clinical Protocols',
                'directionsSubLinks.strategic_initiatives' => 'Strategic Initiatives and International Cooperation',
                'directionsSubLinks.medical_rating' => 'Medical Organizations Rating',
                'directionsSubLinks.medical_science' => 'Medical Science',
                'directionsSubLinks.bioethics' => 'Central Commission on Bioethics',
                'directionsSubLinks.drug_policy' => 'Drug Policy',
                'directionsSubLinks.primary_healthcare' => 'Primary Healthcare',
                'directionsSubLinks.health_accounts' => 'National Health Accounts',
                'directionsSubLinks.medical_statistics' => 'Medical Statistics',
                'directionsSubLinks.direction_tech_competence' => 'Industry Center for Technological Competencies',
                'directionsSubLinks.center_prevention' => 'Center for Prevention and Health Promotion',
                'directionsSubLinks.medical_tourism' => 'Medical Tourism',
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
            
            // Добавляем переводы филиалов
            foreach ($branchesTranslations[$lang] as $key => $value) {
                $translations[$key] = $value;
            }
            
            // Добавляем переводы направлений
            foreach ($directionsTranslations[$lang] as $key => $value) {
                $translations[$key] = $value;
            }
            
            // Сохраняем файл
            $content = "<?php\n\nreturn " . var_export($translations, true) . ";\n";
            File::put($langFile, $content);
            
            $this->info("✅ Added translations for {$lang}");
        }
        
        $this->info('🎉 Header translations added successfully!');
        return 0;
    }
}
