import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function MedicalTourismDocuments() {
  return (
    <>
      <Head title="Документы | Медицинский туризм | NNCRZ" meta={[{ name: 'description', content: 'Документы и нормативные акты по медицинскому туризму в Казахстане.' }]} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              В данном разделе представлены основные документы, регламентирующие деятельность в сфере 
              медицинского туризма в Казахстане. Эти документы содержат информацию о стандартах качества, 
              процедурах сертификации, правах и обязанностях участников медицинского туризма.
            </p>
          </div>
          
          <div className="px-8 mb-12">
            <FilesAccord
              title="Нормативные документы"
              items={[
                { title: 'Концепция развития медицинского туризма в Республике Казахстан', description: 'PDF, 2.3 МБ' },
                { title: 'Правила оказания медицинских услуг иностранным гражданам', description: 'PDF, 1.8 МБ' },
                { title: 'Стандарты качества медицинских услуг для иностранных пациентов', description: 'PDF, 1.5 МБ' },
                { title: 'Порядок сертификации медицинских организаций для медицинского туризма', description: 'PDF, 2.1 МБ' },
                { title: 'Требования к инфраструктуре медицинских организаций', description: 'PDF, 1.2 МБ' }
              ]}
            />
            
            <FilesAccord
              title="Реестры и списки"
              items={[
                { title: 'Реестр сертифицированных медицинских организаций для медицинского туризма', description: 'PDF, 0.8 МБ' },
                { title: 'Список аккредитованных медицинских специалистов', description: 'PDF, 1.1 МБ' },
                { title: 'Реестр туристических компаний, работающих в сфере медицинского туризма', description: 'PDF, 0.6 МБ' },
                { title: 'Список стран, граждане которых могут получать медицинские услуги', description: 'PDF, 0.4 МБ' }
              ]}
            />
            
            <FilesAccord
              title="Формы и заявки"
              items={[
                { title: 'Форма заявки на сертификацию медицинской организации', description: 'DOCX, 0.2 МБ' },
                { title: 'Анкета для иностранного пациента', description: 'DOCX, 0.1 МБ' },
                { title: 'Форма медицинского заключения для иностранного пациента', description: 'DOCX, 0.3 МБ' },
                { title: 'Заявка на получение медицинской визы', description: 'DOCX, 0.2 МБ' },
                { title: 'Форма отчета о предоставленных медицинских услугах', description: 'DOCX, 0.2 МБ' }
              ]}
            />
            
            <FilesAccord
              title="Методические материалы"
              items={[
                { title: 'Методические рекомендации по организации медицинского туризма', description: 'PDF, 2.8 МБ' },
                { title: 'Руководство по подготовке персонала для работы с иностранными пациентами', description: 'PDF, 1.9 МБ' },
                { title: 'Стандарты коммуникации с иностранными пациентами', description: 'PDF, 1.4 МБ' },
                { title: 'Рекомендации по обеспечению безопасности пациентов', description: 'PDF, 1.6 МБ' },
                { title: 'Пособие по культурной адаптации для медицинского персонала', description: 'PDF, 2.2 МБ' }
              ]}
            />
            
            <FilesAccord
              title="Отчеты и аналитика"
              items={[
                { title: 'Ежегодный отчет о развитии медицинского туризма в Казахстане (2024)', description: 'PDF, 3.1 МБ' },
                { title: 'Анализ потоков медицинских туристов по регионам', description: 'PDF, 1.7 МБ' },
                { title: 'Статистика популярных медицинских услуг среди иностранных пациентов', description: 'PDF, 1.3 МБ' },
                { title: 'Отчет о качестве медицинских услуг для иностранных пациентов', description: 'PDF, 2.0 МБ' },
                { title: 'Анализ экономического эффекта медицинского туризма', description: 'PDF, 1.8 МБ' }
              ]}
            />
            
            <FilesAccord
              title="Международные соглашения"
              items={[
                { title: 'Соглашение о медицинском туризме с Российской Федерацией', description: 'PDF, 1.5 МБ' },
                { title: 'Меморандум о сотрудничестве с медицинскими центрами Турции', description: 'PDF, 1.2 МБ' },
                { title: 'Соглашение о взаимном признании медицинских сертификатов с ОАЭ', description: 'PDF, 1.4 МБ' },
                { title: 'Протокол о сотрудничестве в сфере медицинского туризма с Китаем', description: 'PDF, 1.6 МБ' }
              ]}
            />
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Информация для скачивания:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Для медицинских организаций</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Стандарты сертификации</li>
                    <li>• Формы заявок</li>
                    <li>• Методические рекомендации</li>
                    <li>• Требования к персоналу</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Для иностранных пациентов</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Информационные брошюры</li>
                    <li>• Анкеты для пациентов</li>
                    <li>• Список клиник</li>
                    <li>• Контактная информация</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismDocuments.layout = page => <LayoutFolderChlank 
  h1="Документы" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;
