import { Head, usePage, router } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import translationService from '@/services/TranslationService';

export default function MedicalTourism() {
    const [search, setSearch] = useState('');
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    // Данные о клиниках Астаны для медицинского туризма
    const astanaClinics = [
        {
            id: 1,
            name: "Международный онкологический центр томотерапии 'UMIT'",
            image: "/img/clinics/clinic.jpg",
            description: "Современный центр для лечения онкологических заболеваний с использованием передовых технологий",
            specialties: ["Онкология", "Томотерапия"],
            route: "clinic.umit"
        },
        {
            id: 2,
            name: "Национальный центр детской реабилитации",
            image: "/img/clinics/clinic.jpg", 
            description: "Специализированный центр для реабилитации детей с различными заболеваниями",
            specialties: ["Детская реабилитация", "Педиатрия"],
            route: "clinic.child-rehab"
        },
        {
            id: 3,
            name: "Национальный Научный Медицинский Центр",
            image: "/img/clinics/clinic.jpg",
            description: "Ведущий медицинский центр с широким спектром специализированных услуг",
            specialties: ["Многопрофильная медицина", "Исследования"],
            route: "clinic.nsmc"
        },
        {
            id: 4,
            name: "Национальный научный онкологический центр",
            image: "/img/clinics/clinic.jpg",
            description: "Центр онкологии с современными методами диагностики и лечения",
            specialties: ["Онкология", "Химиотерапия"],
            route: "clinic.oncology"
        },
        {
            id: 5,
            name: "Национальный центр нейрохирургии",
            image: "/img/clinics/clinic.jpg",
            description: "Специализированный центр для лечения заболеваний нервной системы",
            specialties: ["Нейрохирургия", "Неврология"],
            route: "clinic.neurosurgery"
        },
        {
            id: 6,
            name: "Центр сердца UMC",
            image: "/img/clinics/clinic.jpg",
            description: "Кардиологический центр с современным оборудованием для лечения сердечно-сосудистых заболеваний",
            specialties: ["Кардиология", "Кардиохирургия"],
            route: "clinic.heart-center"
        },
        {
            id: 7,
            name: "Диагностический центр UMC",
            image: "/img/clinics/clinic.jpg",
            description: "Центр диагностики с полным спектром современных методов обследования",
            specialties: ["Диагностика", "Лабораторные исследования"],
            route: "clinic.diagnostic"
        },
        {
            id: 8,
            name: "Центр Материнства и Детства UMC",
            image: "/img/clinics/clinic.jpg",
            description: "Специализированный центр для женщин и детей с высоким уровнем медицинской помощи",
            specialties: ["Акушерство", "Гинекология", "Педиатрия"],
            route: "clinic.maternity"
        }
    ];

  // Фильтрация клиник по названию
  const filteredClinics = useMemo(() => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return astanaClinics;
    return astanaClinics.filter(c => c.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <>
      <Head title={t('directionsPages.medicalTourism.title', 'Медицинский туризм')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.medicalTourism.intro')}
            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
          <div className='flex md:flex-row flex-wrap'>
            <FolderChlank h1={t('directionsPages.medicalTourism.folder1')} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.directions')} />
            <FolderChlank h1={t('directionsPages.medicalTourism.folder2')} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.services')} />
            <FolderChlank h1={t('directionsPages.medicalTourism.folder3')} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.documents')} />
            <FolderChlank h1={t('directionsPages.medicalTourism.folder4')} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.contacts')} />
          </div>
        </div>
      </section>

      {/* Популярные направления медицинского туризма */}
      <section className="text-gray-600 body-font bg-gray-50 py-12">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('directionsPages.medicalTourism.popularDirectionsTitle')}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              {t('directionsPages.medicalTourism.popularDirectionsDescription')}
            </p>
            <a href={route('medical.tourism.services')} className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
              {t('directionsPages.medicalTourism.servicesLink')}
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{t('directionsPages.medicalTourism.cardiology')}</h3>
              <p className="text-gray-600 text-center">{t('directionsPages.medicalTourism.cardiologyDescription')}</p>
            </a>
            
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{t('directionsPages.medicalTourism.orthopedics')}</h3>
              <p className="text-gray-600 text-center">{t('directionsPages.medicalTourism.orthopedicsDescription')}</p>
            </a>
            
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{t('directionsPages.medicalTourism.reproductiveMedicine')}</h3>
              <p className="text-gray-600 text-center">{t('directionsPages.medicalTourism.reproductiveMedicineDescription')}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Клиники Астаны */}
      <section className="text-gray-600 body-font py-12">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('directionsPages.medicalTourism.astanaClinicsTitle')}</h2>
            <div className="w-full md:w-96">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('directionsPages.medicalTourism.searchPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={clinic.image} 
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/img/clinics/default-clinic.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {clinic.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {clinic.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {clinic.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                                     <button 
                     className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                     onClick={() => {
                       // Переход на страницу клиники
                       router.visit(route('clinics.show.by.route', clinic.route));
                     }}
                   >
                     {t('directionsPages.medicalTourism.detailsButton')}
                   </button>
                </div>
              </div>
            ))}
            {filteredClinics.length === 0 && (
              <div className="col-span-full text-center text-gray-600">{t('directionsPages.medicalTourism.noClinicsFound')}</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourism.layout = page => <LayoutDirection img="medical-tourism" h1={translationService.t('directionsPages.medicalTourism.title', 'Медицинский туризм')} useVideo={false}>{page}</LayoutDirection>;
