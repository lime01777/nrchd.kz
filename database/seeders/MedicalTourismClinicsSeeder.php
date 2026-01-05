<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use Carbon\Carbon;

/**
 * Сидер для добавления клиник, аккредитованных Joint Commission International (JCI) в Казахстане
 * 
 * Данные взяты с: https://www.jointcommission.org/en/about-us/recognizing-excellence/find-accredited-international-organizations
 * Фильтр: country:eq:Kazakhstan
 */
class MedicalTourismClinicsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Массив клиник, аккредитованных JCI в Казахстане
        $clinics = [
            [
                'name_en' => 'CDL OLYMP Astana LLP',
                'name_ru' => 'ТОО "CDL OLYMP Astana"',
                'name_kk' => 'ТОО "CDL OLYMP Astana"',
                'short_desc_en' => 'Accredited medical laboratory providing high-quality diagnostic services',
                'short_desc_ru' => 'Аккредитованная медицинская лаборатория, предоставляющая качественные диагностические услуги',
                'short_desc_kk' => 'Сапалы диагностикалық қызметтер көрсететін аккредиттелген медициналық зертхана',
                'full_desc_en' => 'CDL OLYMP Astana LLP is a JCI accredited medical laboratory providing high-quality diagnostic services.',
                'full_desc_ru' => 'ТОО "CDL OLYMP Astana" - это аккредитованная JCI медицинская лаборатория, предоставляющая качественные диагностические услуги.',
                'full_desc_kk' => 'ТОО "CDL OLYMP Astana" - сапалы диагностикалық қызметтер көрсететін JCI аккредиттелген медициналық зертхана.',
                'city_en' => 'Astana',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'address_ru' => 'г. Астана',
                'address_kk' => 'Астана қ.',
                'address_en' => 'Astana, Kazakhstan',
                'phone' => '',
                'website' => 'https://www.kdlolymp.kz/',
                'specialties_ru' => ['Лабораторная диагностика'],
                'specialties_kk' => ['Зертханалық диагностика'],
                'specialties_en' => ['Laboratory Diagnostics'],
                'accreditations_ru' => ['JCI - Laboratory'],
                'accreditations_kk' => ['JCI - Зертхана'],
                'accreditations_en' => ['JCI - Laboratory'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Corporate Fund University Medical Center',
                'name_ru' => 'Корпоративный фонд "Университетский медицинский центр"',
                'name_kk' => 'Корпоративтік қор "Университеттік медициналық орталық"',
                'short_desc_en' => 'Academic medical center with JCI accreditation for hospital program and heart failure/ventricular assist device certification',
                'short_desc_ru' => 'Академический медицинский центр с аккредитацией JCI по программе больниц и сертификацией по сердечной недостаточности и вспомогательным устройствам желудочков',
                'short_desc_kk' => 'Аурухана бағдарламасы бойынша JCI аккредитациясы және жүрек жеткіліксіздігі/желудочек көмекші құрылғылары сертификаты бар академиялық медициналық орталық',
                'full_desc_en' => 'Corporate Fund University Medical Center is a JCI accredited academic medical center with hospital program accreditation and heart failure/ventricular assist device certification.',
                'full_desc_ru' => 'Корпоративный фонд "Университетский медицинский центр" - это аккредитованный JCI академический медицинский центр с аккредитацией по программе больниц и сертификацией по сердечной недостаточности и вспомогательным устройствам желудочков.',
                'full_desc_kk' => 'Корпоративтік қор "Университеттік медициналық орталық" - аурухана бағдарламасы бойынша аккредитациясы және жүрек жеткіліксіздігі/желудочек көмекші құрылғылары сертификаты бар JCI аккредиттелген академиялық медициналық орталық.',
                'city_en' => 'Astana',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'address_ru' => 'г. Астана',
                'address_kk' => 'Астана қ.',
                'address_en' => 'Astana, Kazakhstan',
                'phone' => '',
                'website' => 'http://umc.org.kz/',
                'specialties_ru' => ['Кардиология', 'Кардиохирургия', 'Трансплантология'],
                'specialties_kk' => ['Кардиология', 'Кардиохирургия', 'Трансплантология'],
                'specialties_en' => ['Cardiology', 'Cardiac Surgery', 'Transplantology'],
                'accreditations_ru' => ['JCI - Academic Medical Center Hospital Program', 'JCI - Heart Failure', 'JCI - Ventricular Assist Device'],
                'accreditations_kk' => ['JCI - Академиялық медициналық орталық аурухана бағдарламасы', 'JCI - Жүрек жеткіліксіздігі', 'JCI - Желудочек көмекші құрылғысы'],
                'accreditations_en' => ['JCI - Academic Medical Center Hospital Program', 'JCI - Heart Failure', 'JCI - Ventricular Assist Device'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'The Central Clinical Hospital',
                'name_ru' => 'Центральная клиническая больница',
                'name_kk' => 'Орталық клиникалық аурухана',
                'short_desc_en' => 'JCI accredited hospital providing comprehensive medical care',
                'short_desc_ru' => 'Аккредитованная JCI больница, предоставляющая комплексную медицинскую помощь',
                'short_desc_kk' => 'Кешенді медициналық көмек көрсететін JCI аккредиттелген аурухана',
                'full_desc_en' => 'The Central Clinical Hospital is a JCI accredited hospital providing comprehensive medical care.',
                'full_desc_ru' => 'Центральная клиническая больница - это аккредитованная JCI больница, предоставляющая комплексную медицинскую помощь.',
                'full_desc_kk' => 'Орталық клиникалық аурухана - кешенді медициналық көмек көрсететін JCI аккредиттелген аурухана.',
                'city_en' => 'Almaty',
                'city_ru' => 'Алматы',
                'city_kk' => 'Алматы',
                'address_ru' => 'г. Алматы',
                'address_kk' => 'Алматы қ.',
                'address_en' => 'Almaty, Kazakhstan',
                'phone' => '',
                'website' => 'http://www.sovminka.kz',
                'specialties_ru' => ['Терапия', 'Хирургия', 'Диагностика'],
                'specialties_kk' => ['Терапия', 'Хирургия', 'Диагностика'],
                'specialties_en' => ['Therapy', 'Surgery', 'Diagnostics'],
                'accreditations_ru' => ['JCI - Hospital Program'],
                'accreditations_kk' => ['JCI - Аурухана бағдарламасы'],
                'accreditations_en' => ['JCI - Hospital Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'JSC "National Centre for Neurosurgery"',
                'name_ru' => 'АО "Национальный центр нейрохирургии"',
                'name_kk' => 'АҚ "Нейрохирургия ұлттық орталығы"',
                'short_desc_en' => 'Specialized neurosurgery center with JCI accreditation',
                'short_desc_ru' => 'Специализированный центр нейрохирургии с аккредитацией JCI',
                'short_desc_kk' => 'JCI аккредитациясы бар мамандандырылған нейрохирургия орталығы',
                'full_desc_en' => 'JSC "National Centre for Neurosurgery" is a specialized neurosurgery center with JCI accreditation.',
                'full_desc_ru' => 'АО "Национальный центр нейрохирургии" - это специализированный центр нейрохирургии с аккредитацией JCI.',
                'full_desc_kk' => 'АҚ "Нейрохирургия ұлттық орталығы" - JCI аккредитациясы бар мамандандырылған нейрохирургия орталығы.',
                'city_en' => 'Astana',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'address_ru' => 'г. Астана, пр. Туран, 34/1',
                'address_kk' => 'Астана қ., Туран даңғылы, 34/1',
                'address_en' => 'Turan Ave. 34/1, Astana, Kazakhstan',
                'phone' => '',
                'website' => 'http://neuroclinic.kz',
                'specialties_ru' => ['Нейрохирургия', 'Неврология'],
                'specialties_kk' => ['Нейрохирургия', 'Неврология'],
                'specialties_en' => ['Neurosurgery', 'Neurology'],
                'accreditations_ru' => ['JCI - Hospital Program'],
                'accreditations_kk' => ['JCI - Аурухана бағдарламасы'],
                'accreditations_en' => ['JCI - Hospital Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'JSC "Research Institute of Cardiology and Internal Medicine"',
                'name_ru' => 'АО "Научно-исследовательский институт кардиологии и внутренних болезней"',
                'name_kk' => 'АҚ "Кардиология және ішкі аурулар ғылыми-зерттеу институты"',
                'short_desc_en' => 'Research institute specializing in cardiology and internal medicine with JCI accreditation',
                'short_desc_ru' => 'Научно-исследовательский институт, специализирующийся на кардиологии и внутренних болезнях с аккредитацией JCI',
                'short_desc_kk' => 'JCI аккредитациясы бар кардиология және ішкі аурулар бойынша маманданған ғылыми-зерттеу институты',
                'full_desc_en' => 'JSC "Research Institute of Cardiology and Internal Medicine" is a research institute specializing in cardiology and internal medicine with JCI accreditation.',
                'full_desc_ru' => 'АО "Научно-исследовательский институт кардиологии и внутренних болезней" - это научно-исследовательский институт, специализирующийся на кардиологии и внутренних болезнях с аккредитацией JCI.',
                'full_desc_kk' => 'АҚ "Кардиология және ішкі аурулар ғылыми-зерттеу институты" - JCI аккредитациясы бар кардиология және ішкі аурулар бойынша маманданған ғылыми-зерттеу институты.',
                'city_en' => 'Almaty',
                'city_ru' => 'Алматы',
                'city_kk' => 'Алматы',
                'address_ru' => 'г. Алматы',
                'address_kk' => 'Алматы қ.',
                'address_en' => 'Almaty, Kazakhstan',
                'phone' => '',
                'website' => 'http://ncvb.kz/',
                'specialties_ru' => ['Кардиология', 'Терапия', 'Внутренние болезни'],
                'specialties_kk' => ['Кардиология', 'Терапия', 'Ішкі аурулар'],
                'specialties_en' => ['Cardiology', 'Therapy', 'Internal Medicine'],
                'accreditations_ru' => ['JCI - Hospital Program'],
                'accreditations_kk' => ['JCI - Аурухана бағдарламасы'],
                'accreditations_en' => ['JCI - Hospital Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'National Children\'s Rehabilitation Center Non-Profit Joint Stock Company',
                'name_ru' => 'АО "Национальный центр детской реабилитации"',
                'name_kk' => 'АҚ "Балалар реабилитациясы ұлттық орталығы"',
                'short_desc_en' => 'Children\'s rehabilitation center with JCI accreditation for long-term care',
                'short_desc_ru' => 'Центр детской реабилитации с аккредитацией JCI по программе долгосрочного ухода',
                'short_desc_kk' => 'Ұзақ мерзімді күтім бағдарламасы бойынша JCI аккредитациясы бар балалар реабилитациясы орталығы',
                'full_desc_en' => 'National Children\'s Rehabilitation Center is a children\'s rehabilitation center with JCI accreditation for long-term care program.',
                'full_desc_ru' => 'Национальный центр детской реабилитации - это центр детской реабилитации с аккредитацией JCI по программе долгосрочного ухода.',
                'full_desc_kk' => 'Балалар реабилитациясы ұлттық орталығы - ұзақ мерзімді күтім бағдарламасы бойынша JCI аккредитациясы бар балалар реабилитациясы орталығы.',
                'city_en' => 'Astana',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'address_ru' => 'г. Астана, пр. Туран, 36',
                'address_kk' => 'Астана қ., Туран даңғылы, 36',
                'address_en' => '36 Turan Avenue, Astana, Kazakhstan',
                'phone' => '',
                'website' => 'http://umc.org.kz/',
                'specialties_ru' => ['Детская реабилитация', 'Педиатрия'],
                'specialties_kk' => ['Балалар реабилитациясы', 'Педиатрия'],
                'specialties_en' => ['Children\'s Rehabilitation', 'Pediatrics'],
                'accreditations_ru' => ['JCI - Long Term Care Program'],
                'accreditations_kk' => ['JCI - Ұзақ мерзімді күтім бағдарламасы'],
                'accreditations_en' => ['JCI - Long Term Care Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Research Clinical Center of Cardiac Surgery and Transplantology',
                'name_ru' => 'Научно-клинический центр кардиохирургии и трансплантологии',
                'name_kk' => 'Кардиохирургия және трансплантология ғылыми-клиникалық орталығы',
                'short_desc_en' => 'Specialized center for cardiac surgery and transplantology with JCI accreditation',
                'short_desc_ru' => 'Специализированный центр кардиохирургии и трансплантологии с аккредитацией JCI',
                'short_desc_kk' => 'JCI аккредитациясы бар кардиохирургия және трансплантология мамандандырылған орталығы',
                'full_desc_en' => 'Research Clinical Center of Cardiac Surgery and Transplantology is a specialized center for cardiac surgery and transplantology with JCI accreditation.',
                'full_desc_ru' => 'Научно-клинический центр кардиохирургии и трансплантологии - это специализированный центр кардиохирургии и трансплантологии с аккредитацией JCI.',
                'full_desc_kk' => 'Кардиохирургия және трансплантология ғылыми-клиникалық орталығы - JCI аккредитациясы бар кардиохирургия және трансплантология мамандандырылған орталығы.',
                'city_en' => 'Taraz',
                'city_ru' => 'Тараз',
                'city_kk' => 'Тараз',
                'address_ru' => 'г. Тараз',
                'address_kk' => 'Тараз қ.',
                'address_en' => 'Taraz, Kazakhstan',
                'phone' => '',
                'website' => 'https://tarazcardio.kz/',
                'specialties_ru' => ['Кардиохирургия', 'Трансплантология', 'Кардиология'],
                'specialties_kk' => ['Кардиохирургия', 'Трансплантология', 'Кардиология'],
                'specialties_en' => ['Cardiac Surgery', 'Transplantology', 'Cardiology'],
                'accreditations_ru' => ['JCI - Hospital Program'],
                'accreditations_kk' => ['JCI - Аурухана бағдарламасы'],
                'accreditations_en' => ['JCI - Hospital Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Umit International Oncological Center of TomoTherapy Limited Liability Partnership',
                'name_ru' => 'ТОО "Международный онкологический центр томотерапии "Умит"',
                'name_kk' => 'ТОО "Томотерапия халықаралық онкологиялық орталығы "Үміт"',
                'short_desc_en' => 'Oncological center specializing in tomotherapy with JCI accreditation for ambulatory care',
                'short_desc_ru' => 'Онкологический центр, специализирующийся на томотерапии с аккредитацией JCI по программе амбулаторной помощи',
                'short_desc_kk' => 'Амбулаториялық көмек бағдарламасы бойынша JCI аккредитациясы бар томотерапия бойынша маманданған онкологиялық орталық',
                'full_desc_en' => 'Umit International Oncological Center of TomoTherapy is an oncological center specializing in tomotherapy with JCI accreditation for ambulatory care program.',
                'full_desc_ru' => 'Международный онкологический центр томотерапии "Умит" - это онкологический центр, специализирующийся на томотерапии с аккредитацией JCI по программе амбулаторной помощи.',
                'full_desc_kk' => 'Томотерапия халықаралық онкологиялық орталығы "Үміт" - амбулаториялық көмек бағдарламасы бойынша JCI аккредитациясы бар томотерапия бойынша маманданған онкологиялық орталық.',
                'city_en' => 'Nur-Sultan',
                'city_ru' => 'Нур-Султан',
                'city_kk' => 'Нұр-Сұлтан',
                'address_ru' => 'г. Нур-Султан',
                'address_kk' => 'Нұр-Сұлтан қ.',
                'address_en' => 'Nur Sultan, Kazakhstan',
                'phone' => '',
                'website' => 'http://tomo.kz',
                'specialties_ru' => ['Онкология', 'Томотерапия', 'Лучевая терапия'],
                'specialties_kk' => ['Онкология', 'Томотерапия', 'Сәуле терапиясы'],
                'specialties_en' => ['Oncology', 'Tomotherapy', 'Radiation Therapy'],
                'accreditations_ru' => ['JCI - Ambulatory Care Program'],
                'accreditations_kk' => ['JCI - Амбулаториялық көмек бағдарламасы'],
                'accreditations_en' => ['JCI - Ambulatory Care Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
            [
                'name_en' => 'The Hospital of the Medical Center of President\'s Affairs Administration of the Republic of Kazakhstan',
                'name_ru' => 'Больница Медицинского центра Управления делами Президента Республики Казахстан',
                'name_kk' => 'Қазақстан Республикасы Президенті Істерін Басқару Медициналық орталығының ауруханасы',
                'short_desc_en' => 'Hospital of the Medical Center of President\'s Affairs Administration with JCI accreditation',
                'short_desc_ru' => 'Больница Медицинского центра Управления делами Президента с аккредитацией JCI',
                'short_desc_kk' => 'JCI аккредитациясы бар Президент Істерін Басқару Медициналық орталығының ауруханасы',
                'full_desc_en' => 'The Hospital of the Medical Center of President\'s Affairs Administration of the Republic of Kazakhstan is a hospital with JCI accreditation.',
                'full_desc_ru' => 'Больница Медицинского центра Управления делами Президента Республики Казахстан - это больница с аккредитацией JCI.',
                'full_desc_kk' => 'Қазақстан Республикасы Президенті Істерін Басқару Медициналық орталығының ауруханасы - JCI аккредитациясы бар аурухана.',
                'city_en' => 'Astana',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'address_ru' => 'г. Астана, Е-495, здание №2',
                'address_kk' => 'Астана қ., Е-495, №2 ғимарат',
                'address_en' => 'E495 build №2, Nur-Sultan, Astana, Kazakhstan',
                'phone' => '',
                'website' => 'http://bmcudp.kz/en/',
                'specialties_ru' => ['Терапия', 'Хирургия', 'Диагностика'],
                'specialties_kk' => ['Терапия', 'Хирургия', 'Диагностика'],
                'specialties_en' => ['Therapy', 'Surgery', 'Diagnostics'],
                'accreditations_ru' => ['JCI - Hospital Program'],
                'accreditations_kk' => ['JCI - Аурухана бағдарламасы'],
                'accreditations_en' => ['JCI - Hospital Program'],
                'is_published' => true,
                'is_medical_tourism' => true,
                'publish_at' => Carbon::now(),
            ],
        ];

        $created = 0;
        $updated = 0;

        foreach ($clinics as $clinicData) {
            // Проверяем, существует ли клиника с таким названием (по name_en)
            $existingClinic = Clinic::where('name_en', $clinicData['name_en'])->first();
            
            if ($existingClinic) {
                // Обновляем существующую клинику, устанавливаем флаг медицинского туризма
                $updateData = $clinicData;
                unset($updateData['name_en']); // Не обновляем name_en (используется для поиска)
                
                $existingClinic->update($updateData);
                $updated++;
                $this->command->info("✓ Обновлена клиника: {$clinicData['name_ru']}");
            } else {
                // Создаем новую клинику
                Clinic::create($clinicData);
                $created++;
                $this->command->info("✓ Создана клиника: {$clinicData['name_ru']}");
            }
        }

        $this->command->info("");
        $this->command->info("Готово! Создано: {$created}, Обновлено: {$updated}");
        $this->command->info("Всего клиник с флагом is_medical_tourism=true: " . Clinic::where('is_medical_tourism', true)->count());
    }
}
