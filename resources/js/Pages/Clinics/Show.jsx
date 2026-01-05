import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import { route } from '@/ziggy-helper';

export default function ClinicShow({ clinic }) {
  // Нормализуем данные клиники - используем данные с сервера или fallback
  const clinicData = clinic || {};
  
  // Извлекаем данные с правильными полями (ClinicResource возвращает short_desc, logo_url и т.д.)
  const name = clinicData.name || '';
  const description = clinicData.short_desc || clinicData.full_desc || '';
  const image = clinicData.logo_url || clinicData.hero_url || '/img/clinics/default-clinic.jpg';
  const specialties = clinicData.specialties || [];
  const services = clinicData.services || [];
  const doctors = clinicData.doctors || [];
  const equipment = clinicData.equipment || [];
  const address = clinicData.address || '';
  const phone = clinicData.phone || '';
  const email = clinicData.email || '';
  const website = clinicData.website || '';
  const accreditations = clinicData.accreditations || [];

  return (
    <>
      <Head title={`${name} | Медицинский туризм | NNCRZ`} 
        meta={[{ name: 'description', content: description }]} />
      
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          {/* Заголовок и основная информация */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = '/img/clinics/default-clinic.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{name}</h1>
                {description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
                )}
                
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Контактная информация</h3>
                    {address && <p className="text-gray-600 mb-1">📍 {address}</p>}
                    {phone && <p className="text-gray-600 mb-1">📞 {phone}</p>}
                    {email && <p className="text-gray-600 mb-1">✉️ {email}</p>}
                    {website && <p className="text-gray-600">🌐 {website}</p>}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Сертификация</h3>
                    {accreditations.length > 0 ? (
                      <div className="space-y-2">
                        {accreditations.map((accreditation, index) => (
                          <div key={index} className="flex items-center">
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              ✅ {accreditation}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ Сертифицирована для медицинского туризма
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Услуги */}
          {services.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Услуги клиники</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Врачи */}
          {doctors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Наши специалисты</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {doctors.map((doctor, index) => (
                  <div key={doctor.id || index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                    {doctor.position && <p className="text-gray-600 mb-2">{doctor.position}</p>}
                    {doctor.contacts && doctor.contacts.phone && (
                      <p className="text-sm text-gray-500">📞 {doctor.contacts.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Оборудование */}
          {equipment.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Оборудование</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {equipment.map((item, index) => (
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
          )}
          
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
