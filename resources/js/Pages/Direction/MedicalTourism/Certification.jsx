import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function MedicalTourismCertification() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medicalTourismSubpages.certification.title', 'Сертификация')} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              Сертификация медицинских организаций для приема иностранных пациентов является ключевым 
              элементом развития медицинского туризма в Казахстане. Национальный научный центр развития 
              здравоохранения имени Салидат Каирбековой разработал систему сертификации, которая 
              гарантирует высокое качество медицинских услуг для иностранных пациентов.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Критерии сертификации:</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Наличие лицензии на медицинскую деятельность</li>
                <li>Соответствие международным стандартам качества</li>
                <li>Наличие квалифицированного персонала</li>
                <li>Современное медицинское оборудование</li>
                <li>Система управления качеством</li>
                <li>Возможность предоставления услуг на иностранных языках</li>
                <li>Наличие инфраструктуры для приема иностранных пациентов</li>
                <li>Соблюдение требований безопасности</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Процесс сертификации:</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">1. Подача заявки</h4>
                  <p className="text-gray-700">
                    Медицинская организация подает заявку на сертификацию с необходимыми документами
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">2. Экспертиза</h4>
                  <p className="text-gray-700">
                    Проведение экспертизы соответствия критериям сертификации
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">3. Аудит</h4>
                  <p className="text-gray-700">
                    Проведение аудита на месте для проверки соответствия требованиям
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">4. Сертификация</h4>
                  <p className="text-gray-700">
                    Выдача сертификата при соответствии всем требованиям
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">Сертифицированные клиники:</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8 px-4">
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Национальный научный кардиохирургический центр</h4>
                <p className="text-gray-600 mb-2">Специализация: Кардиология, кардиохирургия</p>
                <p className="text-sm text-gray-500">Сертификат действителен до: 2025-12-31</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Национальный научный центр материнства и детства</h4>
                <p className="text-gray-600 mb-2">Специализация: Репродуктивная медицина, педиатрия</p>
                <p className="text-sm text-gray-500">Сертификат действителен до: 2025-12-31</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Национальный научный центр онкологии и трансплантологии</h4>
                <p className="text-gray-600 mb-2">Специализация: Онкология, трансплантология</p>
                <p className="text-sm text-gray-500">Сертификат действителен до: 2025-12-31</p>
              </div>
              
              <div className="border border-gray-200 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Национальный научный центр травматологии и ортопедии</h4>
                <p className="text-gray-600 mb-2">Специализация: Травматология, ортопедия</p>
                <p className="text-sm text-gray-500">Сертификат действителен до: 2025-12-31</p>
              </div>
            </div>
            
            <FilesAccord
              title="Документы по сертификации"
              items={[
                { title: 'Положение о сертификации медицинских организаций для медицинского туризма', description: 'PDF, 2.1 МБ' },
                { title: 'Критерии оценки соответствия медицинских организаций', description: 'PDF, 1.8 МБ' },
                { title: 'Реестр сертифицированных медицинских организаций', description: 'PDF, 0.5 МБ' },
                { title: 'Форма заявки на сертификацию', description: 'DOCX, 0.1 МБ' },
                { title: 'Методические рекомендации по подготовке к сертификации', description: 'PDF, 1.2 МБ' }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismCertification.layout = page => <LayoutFolderChlank 
  h1="Сертификация клиник" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;
