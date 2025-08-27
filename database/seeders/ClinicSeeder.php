<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\ClinicDoctor;
use Carbon\Carbon;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinics = [
            [
                'name_ru' => 'Медицинский центр "Здоровье"',
                'name_kk' => '"Денсаулық" медициналық орталығы',
                'name_en' => '"Health" Medical Center',
                'short_desc_ru' => 'Современный медицинский центр с высококвалифицированными специалистами и передовым оборудованием.',
                'short_desc_kk' => 'Жоғары білікті мамандар мен заманауи жабдықтармен жабдықталған заманауи медициналық орталық.',
                'short_desc_en' => 'Modern medical center with highly qualified specialists and advanced equipment.',
                'full_desc_ru' => '<p>Медицинский центр "Здоровье" - это современное медицинское учреждение, предоставляющее широкий спектр медицинских услуг. Наш центр оснащен самым современным диагностическим и лечебным оборудованием.</p><p>Мы гордимся нашей командой высококвалифицированных врачей, которые имеют многолетний опыт работы и регулярно повышают свою квалификацию.</p>',
                'full_desc_kk' => '<p>"Денсаулық" медициналық орталығы - кең ауқымды медициналық қызметтер көрсететін заманауи медициналық мекеме. Біздің орталық ең заманауи диагностикалық және емдеу жабдықтарымен жабдықталған.</p><p>Біз көп жылдық тәжірибесі бар және біліктілігін үнемі арттыратын жоғары білікті дәрігерлер тобымызға мақтанамыз.</p>',
                'full_desc_en' => '<p>"Health" Medical Center is a modern medical institution providing a wide range of medical services. Our center is equipped with the most modern diagnostic and treatment equipment.</p><p>We are proud of our team of highly qualified doctors who have many years of experience and regularly improve their qualifications.</p>',
                'city_ru' => 'Астана',
                'city_kk' => 'Астана',
                'city_en' => 'Astana',
                'address_ru' => 'ул. Республики, 15',
                'address_kk' => 'Республика көшесі, 15',
                'address_en' => 'Republic Street, 15',
                'phone' => '+7 (717) 123-45-67',
                'email' => 'info@health-center.kz',
                'website' => 'https://health-center.kz',
                'working_hours_ru' => [
                    'Понедельник - Пятница' => '08:00 - 20:00',
                    'Суббота' => '09:00 - 18:00',
                    'Воскресенье' => '10:00 - 16:00'
                ],
                'working_hours_kk' => [
                    'Дүйсенбі - Жұма' => '08:00 - 20:00',
                    'Сенбі' => '09:00 - 18:00',
                    'Жексенбі' => '10:00 - 16:00'
                ],
                'working_hours_en' => [
                    'Monday - Friday' => '08:00 - 20:00',
                    'Saturday' => '09:00 - 18:00',
                    'Sunday' => '10:00 - 16:00'
                ],
                'specialties_ru' => ['Кардиология', 'Неврология', 'Ортопедия', 'Гинекология'],
                'specialties_kk' => ['Кардиология', 'Неврология', 'Ортопедия', 'Гинекология'],
                'specialties_en' => ['Cardiology', 'Neurology', 'Orthopedics', 'Gynecology'],
                'services_ru' => ['ЭКГ', 'УЗИ', 'МРТ', 'КТ', 'Лабораторные анализы'],
                'services_kk' => ['ЭКГ', 'УЗИ', 'МРТ', 'КТ', 'Зертханалық талдаулар'],
                'services_en' => ['ECG', 'Ultrasound', 'MRI', 'CT', 'Laboratory tests'],
                'accreditations_ru' => ['ISO 9001', 'JCI', 'Министерство здравоохранения РК'],
                'accreditations_kk' => ['ISO 9001', 'JCI', 'ҚР Денсаулық сақтау министрлігі'],
                'accreditations_en' => ['ISO 9001', 'JCI', 'Ministry of Health of RK'],
                'equipment_ru' => ['МРТ 3.0 Тесла', 'КТ 128 срезов', 'УЗИ экспертного класса'],
                'equipment_kk' => ['МРТ 3.0 Тесла', 'КТ 128 кесінді', 'Эксперттік классты УЗИ'],
                'equipment_en' => ['MRI 3.0 Tesla', 'CT 128 slices', 'Expert class ultrasound'],
                'map_lat' => 51.1801,
                'map_lng' => 71.446,
                'logo_path' => 'logo-health.png',
                'hero_path' => 'hero-health.jpg',
                'gallery' => [
                    'gallery-1.jpg',
                    'gallery-2.jpg',
                    'gallery-3.jpg',
                    'gallery-4.jpg',
                    'gallery-5.jpg',
                    'gallery-6.jpg'
                ],
                'is_published' => true,
                'publish_at' => Carbon::now(),
                'seo_title_ru' => 'Медицинский центр "Здоровье" в Астане - Современная медицина',
                'seo_title_kk' => '"Денсаулық" медициналық орталығы Астанада - Заманауи медицина',
                'seo_title_en' => '"Health" Medical Center in Astana - Modern Medicine',
                'seo_desc_ru' => 'Медицинский центр "Здоровье" в Астане предлагает современные медицинские услуги с использованием передового оборудования.',
                'seo_desc_kk' => '"Денсаулық" медициналық орталығы Астанада заманауи жабдықтарды пайдалана отырып заманауи медициналық қызметтер ұсынады.',
                'seo_desc_en' => '"Health" Medical Center in Astana offers modern medical services using advanced equipment.',
            ],
            [
                'name_ru' => 'Клиника "Медицинские технологии"',
                'name_kk' => '"Медициналық технологиялар" клиникасы',
                'name_en' => '"Medical Technologies" Clinic',
                'short_desc_ru' => 'Инновационная клиника, специализирующаяся на современных методах диагностики и лечения.',
                'short_desc_kk' => 'Заманауи диагностика және емдеу әдістеріне маманданған инновациялық клиника.',
                'short_desc_en' => 'Innovative clinic specializing in modern diagnostic and treatment methods.',
                'full_desc_ru' => '<p>Клиника "Медицинские технологии" - это инновационное медицинское учреждение, которое специализируется на применении самых современных технологий в медицине.</p><p>Наша клиника оснащена уникальным оборудованием, которое позволяет проводить точную диагностику и эффективное лечение различных заболеваний.</p>',
                'full_desc_kk' => '<p>"Медициналық технологиялар" клиникасы - медицинадағы ең заманауи технологияларды қолдануға маманданған инновациялық медициналық мекеме.</p><p>Біздің клиника әртүрлі ауруларды дәл диагностикалау және тиімді емдеуге мүмкіндік беретін бірегей жабдықтармен жабдықталған.</p>',
                'full_desc_en' => '<p>"Medical Technologies" Clinic is an innovative medical institution that specializes in applying the most modern technologies in medicine.</p><p>Our clinic is equipped with unique equipment that allows for accurate diagnosis and effective treatment of various diseases.</p>',
                'city_ru' => 'Алматы',
                'city_kk' => 'Алматы',
                'city_en' => 'Almaty',
                'address_ru' => 'пр. Достык, 45',
                'address_kk' => 'Достық даңғылы, 45',
                'address_en' => 'Dostyk Avenue, 45',
                'phone' => '+7 (727) 234-56-78',
                'email' => 'info@medtech.kz',
                'website' => 'https://medtech.kz',
                'working_hours_ru' => [
                    'Понедельник - Пятница' => '07:00 - 21:00',
                    'Суббота' => '08:00 - 19:00',
                    'Воскресенье' => '09:00 - 17:00'
                ],
                'working_hours_kk' => [
                    'Дүйсенбі - Жұма' => '07:00 - 21:00',
                    'Сенбі' => '08:00 - 19:00',
                    'Жексенбі' => '09:00 - 17:00'
                ],
                'working_hours_en' => [
                    'Monday - Friday' => '07:00 - 21:00',
                    'Saturday' => '08:00 - 19:00',
                    'Sunday' => '09:00 - 17:00'
                ],
                'specialties_ru' => ['Онкология', 'Радиология', 'Хирургия', 'Реабилитация'],
                'specialties_kk' => ['Онкология', 'Радиология', 'Хирургия', 'Реабилитация'],
                'specialties_en' => ['Oncology', 'Radiology', 'Surgery', 'Rehabilitation'],
                'services_ru' => ['ПЭТ-КТ', 'Радиотерапия', 'Химиотерапия', 'Роботизированная хирургия'],
                'services_kk' => ['ПЭТ-КТ', 'Радиотерапия', 'Химиотерапия', 'Роботтандырылған хирургия'],
                'services_en' => ['PET-CT', 'Radiotherapy', 'Chemotherapy', 'Robotic surgery'],
                'accreditations_ru' => ['ISO 15189', 'CAP', 'Европейская ассоциация онкологии'],
                'accreditations_kk' => ['ISO 15189', 'CAP', 'Еуропа онкология ассоциациясы'],
                'accreditations_en' => ['ISO 15189', 'CAP', 'European Association of Oncology'],
                'equipment_ru' => ['ПЭТ-КТ', 'Линейный ускоритель', 'Робот-хирург Да Винчи'],
                'equipment_kk' => ['ПЭТ-КТ', 'Сызықтық үдеткіш', 'Да Винчи робот-хирург'],
                'equipment_en' => ['PET-CT', 'Linear accelerator', 'Da Vinci robot surgeon'],
                'map_lat' => 43.2389,
                'map_lng' => 76.8897,
                'logo_path' => 'logo-medtech.png',
                'hero_path' => 'hero-medtech.jpg',
                'gallery' => [
                    'gallery-1.jpg',
                    'gallery-2.jpg',
                    'gallery-3.jpg',
                    'gallery-4.jpg',
                    'gallery-5.jpg',
                    'gallery-6.jpg'
                ],
                'is_published' => true,
                'publish_at' => Carbon::now(),
                'seo_title_ru' => 'Клиника "Медицинские технологии" в Алматы - Инновационная медицина',
                'seo_title_kk' => '"Медициналық технологиялар" клиникасы Алматыда - Инновациялық медицина',
                'seo_title_en' => '"Medical Technologies" Clinic in Almaty - Innovative Medicine',
                'seo_desc_ru' => 'Клиника "Медицинские технологии" в Алматы предлагает инновационные методы диагностики и лечения.',
                'seo_desc_kk' => '"Медициналық технологиялар" клиникасы Алматыда инновациялық диагностика және емдеу әдістерін ұсынады.',
                'seo_desc_en' => '"Medical Technologies" Clinic in Almaty offers innovative diagnostic and treatment methods.',
            ],
            [
                'name_ru' => 'Центр семейной медицины "Добрый доктор"',
                'name_kk' => '"Жақсы дәрігер" отбасылық медицина орталығы',
                'name_en' => '"Good Doctor" Family Medicine Center',
                'short_desc_ru' => 'Центр семейной медицины, где каждый член семьи может получить качественную медицинскую помощь.',
                'short_desc_kk' => 'Отбасының әрбір мүшесі сапалы медициналық көмек ала алатын отбасылық медицина орталығы.',
                'short_desc_en' => 'Family medicine center where every family member can receive quality medical care.',
                'full_desc_ru' => '<p>Центр семейной медицины "Добрый доктор" - это медицинское учреждение, которое специализируется на оказании медицинской помощи всей семье.</p><p>Мы создаем комфортную и дружелюбную атмосферу, где каждый пациент чувствует себя как дома. Наши врачи имеют многолетний опыт работы с пациентами всех возрастов.</p>',
                'full_desc_kk' => '<p>"Жақсы дәрігер" отбасылық медицина орталығы - бүкіл отбасыға медициналық көмек көрсетуге маманданған медициналық мекеме.</p><p>Біз әрбір науқас өз үйіндегідей сезінетін ыңғайлы және достық атмосфера жасаймыз. Біздің дәрігерлердің барлық жас топтарының науқастарымен жұмыс істеуде көп жылдық тәжірибесі бар.</p>',
                'full_desc_en' => '<p>"Good Doctor" Family Medicine Center is a medical institution that specializes in providing medical care to the entire family.</p><p>We create a comfortable and friendly atmosphere where every patient feels at home. Our doctors have many years of experience working with patients of all ages.</p>',
                'city_ru' => 'Шымкент',
                'city_kk' => 'Шымкент',
                'city_en' => 'Shymkent',
                'address_ru' => 'ул. Казыбек би, 78',
                'address_kk' => 'Қазыбек би көшесі, 78',
                'address_en' => 'Kazibek bi Street, 78',
                'phone' => '+7 (725) 345-67-89',
                'email' => 'info@gooddoctor.kz',
                'website' => 'https://gooddoctor.kz',
                'working_hours_ru' => [
                    'Понедельник - Пятница' => '08:30 - 19:30',
                    'Суббота' => '09:00 - 17:00',
                    'Воскресенье' => '10:00 - 15:00'
                ],
                'working_hours_kk' => [
                    'Дүйсенбі - Жұма' => '08:30 - 19:30',
                    'Сенбі' => '09:00 - 17:00',
                    'Жексенбі' => '10:00 - 15:00'
                ],
                'working_hours_en' => [
                    'Monday - Friday' => '08:30 - 19:30',
                    'Saturday' => '09:00 - 17:00',
                    'Sunday' => '10:00 - 15:00'
                ],
                'specialties_ru' => ['Семейная медицина', 'Педиатрия', 'Терапия', 'Профилактика'],
                'specialties_kk' => ['Отбасылық медицина', 'Педиатрия', 'Терапия', 'Профилактика'],
                'specialties_en' => ['Family Medicine', 'Pediatrics', 'Therapy', 'Prevention'],
                'services_ru' => ['Профилактические осмотры', 'Вакцинация', 'Диагностика', 'Консультации'],
                'services_kk' => ['Профилактикалық тексерулер', 'Вакцинация', 'Диагностика', 'Кеңес беру'],
                'services_en' => ['Preventive examinations', 'Vaccination', 'Diagnostics', 'Consultations'],
                'accreditations_ru' => ['ISO 9001', 'Министерство здравоохранения РК', 'Ассоциация семейных врачей'],
                'accreditations_kk' => ['ISO 9001', 'ҚР Денсаулық сақтау министрлігі', 'Отбасылық дәрігерлер ассоциациясы'],
                'accreditations_en' => ['ISO 9001', 'Ministry of Health of RK', 'Association of Family Physicians'],
                'equipment_ru' => ['УЗИ экспертного класса', 'ЭКГ', 'Лабораторное оборудование'],
                'equipment_kk' => ['Эксперттік классты УЗИ', 'ЭКГ', 'Зертханалық жабдықтар'],
                'equipment_en' => ['Expert class ultrasound', 'ECG', 'Laboratory equipment'],
                'map_lat' => 42.3000,
                'map_lng' => 69.6000,
                'logo_path' => 'logo-gooddoctor.png',
                'hero_path' => 'hero-gooddoctor.jpg',
                'gallery' => [
                    'gallery-1.jpg',
                    'gallery-2.jpg',
                    'gallery-3.jpg',
                    'gallery-4.jpg',
                    'gallery-5.jpg',
                    'gallery-6.jpg'
                ],
                'is_published' => true,
                'publish_at' => Carbon::now(),
                'seo_title_ru' => 'Центр семейной медицины "Добрый доктор" в Шымкенте',
                'seo_title_kk' => '"Жақсы дәрігер" отбасылық медицина орталығы Шымкентте',
                'seo_title_en' => '"Good Doctor" Family Medicine Center in Shymkent',
                'seo_desc_ru' => 'Центр семейной медицины "Добрый доктор" в Шымкенте предлагает качественную медицинскую помощь для всей семьи.',
                'seo_desc_kk' => '"Жақсы дәрігер" отбасылық медицина орталығы Шымкентте бүкіл отбасыға сапалы медициналық көмек ұсынады.',
                'seo_desc_en' => '"Good Doctor" Family Medicine Center in Shymkent offers quality medical care for the entire family.',
            ]
        ];

        foreach ($clinics as $clinicData) {
            $clinic = Clinic::create($clinicData);

            // Создаем врачей для каждой клиники
            $doctors = [
                [
                    'name_ru' => 'Доктор Ахметов А.К.',
                    'name_kk' => 'Дәрігер Ахметов А.К.',
                    'name_en' => 'Dr. Akhmetov A.K.',
                    'position_ru' => 'Главный врач',
                    'position_kk' => 'Бас дәрігер',
                    'position_en' => 'Chief Medical Officer',
                    'photo_path' => 'doctor-1.jpg',
                    'contacts' => [
                        'phone' => '+7 (717) 123-45-67',
                        'email' => 'akhmetov@health-center.kz'
                    ],
                    'is_featured' => true,
                ],
                [
                    'name_ru' => 'Доктор Смирнова Е.В.',
                    'name_kk' => 'Дәрігер Смирнова Е.В.',
                    'name_en' => 'Dr. Smirnova E.V.',
                    'position_ru' => 'Кардиолог',
                    'position_kk' => 'Кардиолог',
                    'position_en' => 'Cardiologist',
                    'photo_path' => 'doctor-2.jpg',
                    'contacts' => [
                        'phone' => '+7 (717) 123-45-68',
                        'email' => 'smirnova@health-center.kz'
                    ],
                    'is_featured' => false,
                ]
            ];

            foreach ($doctors as $doctorData) {
                $clinic->doctors()->create($doctorData);
            }
        }
    }
}
