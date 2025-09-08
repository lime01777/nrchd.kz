import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function ClinicShow({ clinic }) {
  // Данные клиники (в реальном приложении будут приходить с сервера)
  const clinicData = clinic || {
    id: 1,
    name: "Международный онкологический центр томотерапии 'UMIT'",
    image: "/img/clinics/umit.jpg",
    description: "Современный центр для лечения онкологических заболеваний с использованием передовых технологий томотерапии. Центр оснащен самым современным оборудованием и укомплектован высококвалифицированными специалистами.",
    specialties: ["Онкология", "Томотерапия", "Радиотерапия"],
    address: "г. Астана, ул. Медицинская, 123",
    phone: "+7 (717) 123-45-67",
    email: "info@umit.kz",
    website: "www.umit.kz",
    services: [
      "Томотерапия",
      "Химиотерапия",
      "Лучевая терапия",
      "Диагностика онкологических заболеваний",
      "Консультации онкологов"
    ],
    doctors: [
      {
        name: "Доктор Ахметов А.К.",
        specialty: "Онколог-радиолог",
        experience: "15 лет"
      },
      {
        name: "Доктор Смагулова М.Б.",
        specialty: "Химиотерапевт",
        experience: "12 лет"
      }
    ],
    equipment: [
      "Томотерапия Hi-Art",
      "КТ-сканер",
      "МРТ-аппарат",
      "ПЭТ-КТ"
    ]
  };

  return (
    <>
      <Head title={`${clinicData.name} | Медицинский туризм | NNCRZ`} 
        meta={[{ name: 'description', content: clinicData.description }]} />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          {/* Заголовок и основная информация */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={clinicData.image} 
                    alt={clinicData.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = '/img/clinics/default-clinic.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{clinicData.name}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{clinicData.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {clinicData.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Контактная информация</h3>
                    <p className="text-gray-600 mb-1">📍 {clinicData.address}</p>
                    <p className="text-gray-600 mb-1">📞 {clinicData.phone}</p>
                    <p className="text-gray-600 mb-1">✉️ {clinicData.email}</p>
                    <p className="text-gray-600">🌐 {clinicData.website}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Сертификация</h3>
                    <div className="flex items-center">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ✅ Сертифицирована для медицинского туризма
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Сертификат действителен до: 2025-12-31</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Услуги */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Услуги клиники</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinicData.services.map((service, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Врачи */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Наши специалисты</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {clinicData.doctors.map((doctor, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500">Опыт работы: {doctor.experience}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Оборудование */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Оборудование</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clinicData.equipment.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Кнопка записи */}
          <div className="text-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-lg">
              Записаться на консультацию
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

ClinicShow.layout = page => <LayoutFolderChlank 
  h1="Клиника" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;
