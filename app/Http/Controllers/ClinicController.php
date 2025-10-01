<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\ClinicsResource;
use App\Http\Resources\ClinicResource;

class ClinicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Clinic::published()
            // Eager-load doctors; filter featured within the closure instead of invalid nested eager path
            ->with(['doctors' => function ($q) {
                // Если нужна сортировка/фильтрация избранных врачей – делаем это в запросе
                $q->orderByDesc('is_featured')
                  ->orderBy('name_ru');
            }])
            ->orderBy('name_ru');

        // Поиск по ключевому слову
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Фильтр по городу
        if ($request->filled('city') && $request->input('city') !== 'all') {
            $query->byCity($request->input('city'));
        }

        // Фильтр по специализации
        if ($request->filled('specialty') && $request->input('specialty') !== 'all') {
            $query->bySpecialty($request->input('specialty'));
        }

        // Фильтр по услуге
        if ($request->filled('service') && $request->input('service') !== 'all') {
            $query->byService($request->input('service'));
        }

        // Пагинация
        $clinics = $query->paginate(12)->withQueryString();

        // Получаем уникальные города для фильтра
        $cities = Clinic::published()
            ->select('city_ru', 'city_kk', 'city_en')
            ->distinct()
            ->whereNotNull('city_ru')
            ->orderBy('city_ru')
            ->get()
            ->map(function ($clinic) {
                return [
                    'value' => $clinic->city_ru,
                    'label' => $clinic->city
                ];
            })
            ->unique('value')
            ->values();

        // Получаем уникальные специализации для фильтра
        $specialties = Clinic::published()
            ->whereNotNull('specialties_ru')
            ->get()
            ->flatMap(function ($clinic) {
                return $clinic->specialties ?: [];
            })
            ->unique()
            ->sort()
            ->values()
            ->map(function ($specialty) {
                return [
                    'value' => $specialty,
                    'label' => $specialty
                ];
            });

        // Получаем уникальные услуги для фильтра
        $services = Clinic::published()
            ->whereNotNull('services_ru')
            ->get()
            ->flatMap(function ($clinic) {
                return $clinic->services ?: [];
            })
            ->unique()
            ->sort()
            ->values()
            ->map(function ($service) {
                return [
                    'value' => $service,
                    'label' => $service
                ];
            });

        return Inertia::render('Clinics/Index', [
            'clinics' => ClinicsResource::collection($clinics),
            'filters' => [
                'search' => $request->input('search', ''),
                'city' => $request->input('city', 'all'),
                'specialty' => $request->input('specialty', 'all'),
                'service' => $request->input('service', 'all'),
            ],
            'filterOptions' => [
                'cities' => $cities,
                'specialties' => $specialties,
                'services' => $services,
            ],
            'pagination' => [
                'current_page' => $clinics->currentPage(),
                'last_page' => $clinics->lastPage(),
                'per_page' => $clinics->perPage(),
                'total' => $clinics->total(),
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $clinic = Clinic::published()
            ->with(['doctors' => function ($query) {
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('name_ru');
            }])
            ->where('slug', $slug)
            ->firstOrFail();

        // Генерируем JSON-LD структурированные данные
        $jsonLd = $this->generateJsonLd($clinic);

        return Inertia::render('Clinics/Show', [
            'clinic' => new ClinicResource($clinic),
            'jsonLd' => $jsonLd,
        ]);
    }

    /**
     * Display the specified resource by route.
     */
    public function showByRoute($route)
    {
        // Данные клиник для медицинского туризма
        $clinicsData = [
            'clinic.umit' => [
                'id' => 1,
                'name' => "Международный онкологический центр томотерапии 'UMIT'",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Современный центр для лечения онкологических заболеваний с использованием передовых технологий томотерапии. Центр оснащен самым современным оборудованием и укомплектован высококвалифицированными специалистами.",
                'specialties' => ["Онкология", "Томотерапия", "Радиотерапия"],
                'address' => "г. Астана, ул. Медицинская, 123",
                'phone' => "+7 (717) 123-45-67",
                'email' => "info@umit.kz",
                'website' => "www.umit.kz",
                'services' => [
                    "Томотерапия",
                    "Химиотерапия",
                    "Лучевая терапия",
                    "Диагностика онкологических заболеваний",
                    "Консультации онкологов"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Ахметов А.К.",
                        'specialty' => "Онколог-радиолог",
                        'experience' => "15 лет"
                    ],
                    [
                        'name' => "Доктор Смагулова М.Б.",
                        'specialty' => "Химиотерапевт",
                        'experience' => "12 лет"
                    ]
                ],
                'equipment' => [
                    "Томотерапия Hi-Art",
                    "КТ-сканер",
                    "МРТ-аппарат",
                    "ПЭТ-КТ"
                ]
            ],
            'clinic.child-rehab' => [
                'id' => 2,
                'name' => "Национальный центр детской реабилитации",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Специализированный центр для реабилитации детей с различными заболеваниями. Центр предоставляет комплексную реабилитационную помощь детям с неврологическими, ортопедическими и другими патологиями.",
                'specialties' => ["Детская реабилитация", "Педиатрия", "Неврология"],
                'address' => "г. Астана, ул. Детская, 456",
                'phone' => "+7 (717) 234-56-78",
                'email' => "info@child-rehab.kz",
                'website' => "www.child-rehab.kz",
                'services' => [
                    "Детская реабилитация",
                    "Физиотерапия",
                    "Логопедия",
                    "Психологическая помощь",
                    "Спортивная медицина"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Ибрагимова С.М.",
                        'specialty' => "Детский реабилитолог",
                        'experience' => "18 лет"
                    ],
                    [
                        'name' => "Доктор Нурланов А.Б.",
                        'specialty' => "Детский невролог",
                        'experience' => "14 лет"
                    ]
                ],
                'equipment' => [
                    "Реабилитационные тренажеры",
                    "Физиотерапевтическое оборудование",
                    "Диагностические аппараты",
                    "Спортивные комплексы"
                ]
            ],
            'clinic.nsmc' => [
                'id' => 3,
                'name' => "Национальный Научный Медицинский Центр",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Ведущий медицинский центр с широким спектром специализированных услуг. Центр объединяет научные исследования и практическую медицину для оказания высококачественной медицинской помощи.",
                'specialties' => ["Многопрофильная медицина", "Исследования", "Диагностика"],
                'address' => "г. Астана, ул. Научная, 789",
                'phone' => "+7 (717) 345-67-89",
                'email' => "info@nsmc.kz",
                'website' => "www.nsmc.kz",
                'services' => [
                    "Многопрофильная диагностика",
                    "Консультации специалистов",
                    "Лабораторные исследования",
                    "Инструментальная диагностика",
                    "Научные исследования"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Калиев М.С.",
                        'specialty' => "Главный врач",
                        'experience' => "25 лет"
                    ],
                    [
                        'name' => "Доктор Жанузакова А.Т.",
                        'specialty' => "Научный руководитель",
                        'experience' => "20 лет"
                    ]
                ],
                'equipment' => [
                    "Современные диагностические аппараты",
                    "Лабораторное оборудование",
                    "Исследовательские комплексы",
                    "Компьютерные системы"
                ]
            ],
            'clinic.oncology' => [
                'id' => 4,
                'name' => "Национальный научный онкологический центр",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Центр онкологии с современными методами диагностики и лечения. Центр специализируется на комплексном лечении онкологических заболеваний с использованием передовых технологий.",
                'specialties' => ["Онкология", "Химиотерапия", "Радиотерапия"],
                'address' => "г. Астана, ул. Онкологическая, 321",
                'phone' => "+7 (717) 456-78-90",
                'email' => "info@oncology.kz",
                'website' => "www.oncology.kz",
                'services' => [
                    "Диагностика онкологических заболеваний",
                    "Химиотерапия",
                    "Радиотерапия",
                    "Хирургическое лечение",
                    "Паллиативная помощь"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Садыков Р.А.",
                        'specialty' => "Онколог-хирург",
                        'experience' => "22 года"
                    ],
                    [
                        'name' => "Доктор Муканова Г.К.",
                        'specialty' => "Онколог-химиотерапевт",
                        'experience' => "19 лет"
                    ]
                ],
                'equipment' => [
                    "Линейный ускоритель",
                    "КТ-сканер",
                    "МРТ-аппарат",
                    "ПЭТ-КТ"
                ]
            ],
            'clinic.neurosurgery' => [
                'id' => 5,
                'name' => "Национальный центр нейрохирургии",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Специализированный центр для лечения заболеваний нервной системы. Центр выполняет сложные нейрохирургические операции с использованием микрохирургической техники.",
                'specialties' => ["Нейрохирургия", "Неврология", "Нейрореабилитация"],
                'address' => "г. Астана, ул. Нейрохирургическая, 654",
                'phone' => "+7 (717) 567-89-01",
                'email' => "info@neurosurgery.kz",
                'website' => "www.neurosurgery.kz",
                'services' => [
                    "Нейрохирургические операции",
                    "Диагностика неврологических заболеваний",
                    "Нейрореабилитация",
                    "Консультации неврологов",
                    "Электрофизиологические исследования"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Абдуллаев Н.М.",
                        'specialty' => "Нейрохирург",
                        'experience' => "24 года"
                    ],
                    [
                        'name' => "Доктор Кенжебаева Л.С.",
                        'specialty' => "Невролог",
                        'experience' => "16 лет"
                    ]
                ],
                'equipment' => [
                    "Операционный микроскоп",
                    "Нейронавигационная система",
                    "Электрофизиологическое оборудование",
                    "КТ и МРТ"
                ]
            ],
            'clinic.heart-center' => [
                'id' => 6,
                'name' => "Центр сердца UMC",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Кардиологический центр с современным оборудованием для лечения сердечно-сосудистых заболеваний. Центр специализируется на диагностике и лечении всех видов сердечно-сосудистых патологий.",
                'specialties' => ["Кардиология", "Кардиохирургия", "Аритмология"],
                'address' => "г. Астана, ул. Кардиологическая, 987",
                'phone' => "+7 (717) 678-90-12",
                'email' => "info@heart-center.kz",
                'website' => "www.heart-center.kz",
                'services' => [
                    "Кардиологическая диагностика",
                    "Кардиохирургические операции",
                    "Эндоваскулярные вмешательства",
                    "Лечение аритмий",
                    "Реабилитация кардиологических больных"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Баймуханов Т.К.",
                        'specialty' => "Кардиохирург",
                        'experience' => "26 лет"
                    ],
                    [
                        'name' => "Доктор Алимбекова А.Р.",
                        'specialty' => "Кардиолог-аритмолог",
                        'experience' => "21 год"
                    ]
                ],
                'equipment' => [
                    "Аппарат искусственного кровообращения",
                    "Электрофизиологическая лаборатория",
                    "КТ-ангиография",
                    "Эхокардиограф"
                ]
            ],
            'clinic.diagnostic' => [
                'id' => 7,
                'name' => "Диагностический центр UMC",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Центр диагностики с полным спектром современных методов обследования. Центр предоставляет комплексную диагностику с использованием передового оборудования.",
                'specialties' => ["Диагностика", "Лабораторные исследования", "Инструментальные методы"],
                'address' => "г. Астана, ул. Диагностическая, 147",
                'phone' => "+7 (717) 789-01-23",
                'email' => "info@diagnostic.kz",
                'website' => "www.diagnostic.kz",
                'services' => [
                    "Лабораторная диагностика",
                    "Инструментальная диагностика",
                    "Функциональная диагностика",
                    "Ультразвуковая диагностика",
                    "Рентгенологическая диагностика"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Толеубаев Д.А.",
                        'specialty' => "Врач-диагност",
                        'experience' => "17 лет"
                    ],
                    [
                        'name' => "Доктор Касымова Н.Б.",
                        'specialty' => "Врач УЗД",
                        'experience' => "13 лет"
                    ]
                ],
                'equipment' => [
                    "Современные лабораторные анализаторы",
                    "КТ и МРТ аппараты",
                    "УЗИ аппараты",
                    "Рентгеновское оборудование"
                ]
            ],
            'clinic.maternity' => [
                'id' => 8,
                'name' => "Центр Материнства и Детства UMC",
                'image' => "/img/clinics/clinic.jpg",
                'description' => "Специализированный центр для женщин и детей с высоким уровнем медицинской помощи. Центр предоставляет полный спектр услуг в области акушерства, гинекологии и педиатрии.",
                'specialties' => ["Акушерство", "Гинекология", "Педиатрия"],
                'address' => "г. Астана, ул. Материнства, 258",
                'phone' => "+7 (717) 890-12-34",
                'email' => "info@maternity.kz",
                'website' => "www.maternity.kz",
                'services' => [
                    "Ведение беременности",
                    "Роды",
                    "Гинекологические операции",
                    "Детская педиатрия",
                    "Неонатология"
                ],
                'doctors' => [
                    [
                        'name' => "Доктор Омарова З.К.",
                        'specialty' => "Акушер-гинеколог",
                        'experience' => "23 года"
                    ],
                    [
                        'name' => "Доктор Нурланов Б.М.",
                        'specialty' => "Неонатолог",
                        'experience' => "15 лет"
                    ]
                ],
                'equipment' => [
                    "Родильные залы",
                    "Неонатальные кювезы",
                    "УЗИ аппараты",
                    "Мониторы жизненных функций"
                ]
            ]
        ];

        // Получаем данные клиники по route
        if (!isset($clinicsData[$route])) {
            abort(404);
        }

        $clinic = $clinicsData[$route];

        return Inertia::render('Clinics/Show', [
            'clinic' => $clinic,
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Генерирует JSON-LD структурированные данные для SEO
     */
    private function generateJsonLd($clinic)
    {
        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'MedicalOrganization',
            'name' => $clinic->name,
            'description' => $clinic->short_desc,
            'url' => route('clinics.show.public', $clinic->slug),
            'telephone' => $clinic->phone,
            'email' => $clinic->email,
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $clinic->city,
                'streetAddress' => $clinic->address,
                'addressCountry' => 'KZ',
            ],
        ];

        if ($clinic->map_lat && $clinic->map_lng) {
            $jsonLd['geo'] = [
                '@type' => 'GeoCoordinates',
                'latitude' => $clinic->map_lat,
                'longitude' => $clinic->map_lng,
            ];
        }

        if ($clinic->logo_url) {
            $jsonLd['logo'] = $clinic->logo_url;
        }

        if ($clinic->website) {
            $jsonLd['sameAs'] = $clinic->website;
        }

        // Добавляем услуги
        if ($clinic->services && count($clinic->services) > 0) {
            $jsonLd['medicalSpecialty'] = $clinic->services;
        }

        // Добавляем врачей
        if ($clinic->doctors && count($clinic->doctors) > 0) {
            $jsonLd['employee'] = $clinic->doctors->map(function ($doctor) {
                return [
                    '@type' => 'Person',
                    'name' => $doctor->name,
                    'jobTitle' => $doctor->position,
                ];
            })->toArray();
        }

        return $jsonLd;
    }
}
