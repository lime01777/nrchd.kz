import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function Expert() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.strategicInitiativesSubpages.expert.title', 'Экспертный совет')} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              {t('directionsPages.strategicInitiativesSubpages.expert.intro')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row flex-wrap mb-8">
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.strategicInitiativesSubpages.expert.functionsTitle')}</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Экспертиза научных и прикладных разработок в области здравоохранения</li>
                <li>Анализ эффективности внедрения новых медицинских технологий</li>
                <li>Оценка стратегических документов и программ развития здравоохранения</li>
                <li>Выработка рекомендаций по совершенствованию системы здравоохранения</li>
                <li>Мониторинг и оценка реализации проектов и программ</li>
                <li>Методическая поддержка образовательных программ в сфере здравоохранения</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 md:w-full px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.strategicInitiativesSubpages.expert.compositionTitle')}</h3>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.strategicInitiativesSubpages.expert.compositionIntro')}
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Ведущие ученые в области медицины и здравоохранения</li>
                <li>Руководители ключевых медицинских организаций Казахстана</li>
                <li>Представители медицинских образовательных учреждений</li>
                <li>Эксперты международных организаций здравоохранения</li>
                <li>Специалисты в области организации и управления здравоохранением</li>
              </ul>
            </div>
          </div>
          
          <div className="px-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4">{t('directionsPages.strategicInitiativesSubpages.expert.activitiesTitle')}</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8 px-4">
              <div className="bg-purple-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Научно-исследовательская деятельность</h4>
                <p className="text-gray-700">
                  Анализ актуальных направлений научных исследований, оценка результатов научной деятельности, 
                  экспертиза научных публикаций и разработок.
                </p>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Образование и кадровая политика</h4>
                <p className="text-gray-700">
                  Разработка рекомендаций по совершенствованию медицинского образования, повышению квалификации 
                  медицинских работников, развитию кадрового потенциала.
                </p>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Стандартизация и качество</h4>
                <p className="text-gray-700">
                  Экспертиза клинических протоколов, стандартов оказания медицинской помощи, систем менеджмента 
                  качества в здравоохранении.
                </p>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Стратегическое планирование</h4>
                <p className="text-gray-700">
                  Анализ стратегических направлений развития здравоохранения, оценка эффективности реализации 
                  государственных программ, разработка рекомендаций.
                </p>
              </div>
            </div>
            
            <FilesAccord
              title={t('directionsPages.strategicInitiativesSubpages.expert.documentsTitle')}
              items={[
                { title: 'Положение об Экспертном совете ННЦРЗ', description: 'PDF, 0.8 МБ' },
                { title: 'План работы Экспертного совета на 2024 год', description: 'PDF, 1.1 МБ' },
                { title: 'Заключения Экспертного совета (2023 г.)', description: 'PDF, 2.3 МБ' }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

Expert.layout = page => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.strategicInitiativesSubpages.expert.h1')} 
  parentRoute={route('strategic.initiatives')}
  parentName={translationService.t('directionsPages.strategicInitiativesSubpages.expert.parentName')} 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.expert.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.expert.breadcrumbStrategic'), route: 'strategic.initiatives' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.expert.h1'), route: null }
  ]}
  >{page}</LayoutFolderChlank>;
