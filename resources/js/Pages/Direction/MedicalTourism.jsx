import { Head, usePage, router } from '@inertiajs/react';
import React, { useMemo, useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import translationService from '@/services/TranslationService';
import { route } from '@/ziggy-helper'; // Импорт функции для генерации маршрутов

export default function MedicalTourism({ clinics = [] }) {
    const [search, setSearch] = useState('');
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    // Состояния для переводов (для реактивного обновления)
    const [pageTitle, setPageTitle] = useState('');
    const [intro, setIntro] = useState('');
    const [folder1, setFolder1] = useState('');
    const [folder2, setFolder2] = useState('');
    const [folder3, setFolder3] = useState('');
    const [folder4, setFolder4] = useState('');
    const [popularDirectionsTitle, setPopularDirectionsTitle] = useState('');
    const [popularDirectionsDescription, setPopularDirectionsDescription] = useState('');
    const [servicesLink, setServicesLink] = useState('');
    const [cardiology, setCardiology] = useState('');
    const [cardiologyDescription, setCardiologyDescription] = useState('');
    const [orthopedics, setOrthopedics] = useState('');
    const [orthopedicsDescription, setOrthopedicsDescription] = useState('');
    const [reproductiveMedicine, setReproductiveMedicine] = useState('');
    const [reproductiveMedicineDescription, setReproductiveMedicineDescription] = useState('');
    const [astanaClinicsTitle, setAstanaClinicsTitle] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState('');
    const [noClinicsFound, setNoClinicsFound] = useState('');
    const [h1Title, setH1Title] = useState('');

    // Обновление переводов при смене языка
    useEffect(() => {
        const updateTranslations = () => {
            setPageTitle(t('directionsPages.medicalTourism.title', 'Медицинский туризм'));
            setIntro(t('directionsPages.medicalTourism.intro'));
            setFolder1(t('directionsPages.medicalTourism.folder1'));
            setFolder2(t('directionsPages.medicalTourism.folder2'));
            setFolder3(t('directionsPages.medicalTourism.folder3'));
            setFolder4(t('directionsPages.medicalTourism.folder4'));
            setPopularDirectionsTitle(t('directionsPages.medicalTourism.popularDirectionsTitle'));
            setPopularDirectionsDescription(t('directionsPages.medicalTourism.popularDirectionsDescription'));
            setServicesLink(t('directionsPages.medicalTourism.servicesLink'));
            setCardiology(t('directionsPages.medicalTourism.cardiology'));
            setCardiologyDescription(t('directionsPages.medicalTourism.cardiologyDescription'));
            setOrthopedics(t('directionsPages.medicalTourism.orthopedics'));
            setOrthopedicsDescription(t('directionsPages.medicalTourism.orthopedicsDescription'));
            setReproductiveMedicine(t('directionsPages.medicalTourism.reproductiveMedicine'));
            setReproductiveMedicineDescription(t('directionsPages.medicalTourism.reproductiveMedicineDescription'));
            setAstanaClinicsTitle(t('directionsPages.medicalTourism.astanaClinicsTitle'));
            setSearchPlaceholder(t('directionsPages.medicalTourism.searchPlaceholder'));
            setNoClinicsFound(t('directionsPages.medicalTourism.noClinicsFound'));
            setH1Title(t('directionsPages.medicalTourism.title', 'Медицинский туризм'));
        };

        updateTranslations();
        window.addEventListener('languageChanged', updateTranslations);

        return () => {
            window.removeEventListener('languageChanged', updateTranslations);
        };
    }, []);

    // Данные о клиниках Казахстана для медицинского туризма (получаем с сервера)
    const kazakhstanClinics = clinics.map(clinic => ({
        id: clinic.id,
        name: clinic.name,
        image: clinic.image || clinic.hero_url || clinic.logo_url || '/img/clinics/clinic.jpg',
        description: clinic.short_desc || '',
        specialties: clinic.specialties || [],
        address: clinic.address || '',
        phone: clinic.phone || '',
        website: clinic.website || '',
        slug: clinic.slug,
    }));

    // Фильтрация клиник по названию
    const filteredClinics = useMemo(() => {
        const q = (search || '').toLowerCase().trim();
        if (!q) return kazakhstanClinics;
        return kazakhstanClinics.filter(c => c.name.toLowerCase().includes(q));
    }, [search, kazakhstanClinics]);

    return (
    <>
      <Head title={pageTitle} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">
              {intro}
            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
          <div className='flex md:flex-row flex-wrap'>
            <FolderChlank h1={folder1} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.directions')} />
            <FolderChlank h1={folder2} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.services')} />
            <FolderChlank h1={folder3} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.documents')} />
            <FolderChlank h1={folder4} color="bg-green-100" colorsec="bg-green-200" href={route('medical.tourism.contacts')} />
          </div>
        </div>
      </section>

      {/* Популярные направления медицинского туризма */}
      <section className="text-gray-600 body-font bg-gray-50 py-12">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{popularDirectionsTitle}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              {popularDirectionsDescription}
            </p>
            <a href={route('medical.tourism.services')} className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
              {servicesLink}
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{cardiology}</h3>
              <p className="text-gray-600 text-center">{cardiologyDescription}</p>
            </a>
            
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{orthopedics}</h3>
              <p className="text-gray-600 text-center">{orthopedicsDescription}</p>
            </a>
            
            <a href={route('medical.tourism.services')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{reproductiveMedicine}</h3>
              <p className="text-gray-600 text-center">{reproductiveMedicineDescription}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Клиники Казахстана */}
      <section className="text-gray-600 body-font py-12">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{astanaClinicsTitle}</h2>
            <div className="w-full md:w-96">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src={clinic.image} 
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/img/clinics/default-clinic.jpg';
                    }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
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
                  {clinic.address && (
                    <p className="text-gray-500 text-xs mb-2">
                      📍 {clinic.address}
                    </p>
                  )}
                  {clinic.phone && (
                    <p className="text-gray-500 text-xs mb-3">
                      📞 {clinic.phone}
                    </p>
                  )}
                  {clinic.website && (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium mt-auto text-center"
                    >
                      Сайт
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredClinics.length === 0 && (
              <div className="col-span-full text-center text-gray-600">{noClinicsFound}</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourism.layout = page => {
    const h1 = translationService.t('directionsPages.medicalTourism.title', 'Медицинский туризм');
    return <LayoutDirection img="medical-tourism" h1={h1} useVideo={false}>{page}</LayoutDirection>;
};
