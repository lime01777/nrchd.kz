import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';
import translationService from '@/services/TranslationService';

export default function AstanaDeclaration() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.title', 'Астанинская декларация')} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">{t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.mainTitle')}</h2>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.intro1')}
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.intro2')}
            </p>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">{t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.keyProvisionsTitle')}</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
              <li>
                <strong>Всеобщий охват услугами здравоохранения</strong> - обеспечение доступа к качественным 
                медицинским услугам для всех людей, независимо от их социально-экономического положения.
              </li>
              <li>
                <strong>Укрепление первичной медико-санитарной помощи</strong> - развитие ПМСП как наиболее 
                эффективного и инклюзивного подхода к улучшению здоровья населения.
              </li>
              <li>
                <strong>Межсекторальное сотрудничество</strong> - признание того, что здоровье зависит от 
                множества факторов, выходящих за рамки сектора здравоохранения.
              </li>
              <li>
                <strong>Расширение прав и возможностей людей и сообществ</strong> - вовлечение людей и сообществ 
                в процессы, связанные с их здоровьем.
              </li>
              <li>
                <strong>Устойчивое финансирование</strong> - обеспечение адекватного финансирования первичной 
                медико-санитарной помощи.
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">{t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.implementationTitle')}</h3>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.implementation1')}
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.implementation2')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 w-full">
              <li>Разработку и внедрение стандартов качества ПМСП</li>
              <li>Повышение квалификации медицинских работников первичного звена</li>
              <li>Развитие профилактических программ и укрепление общественного здоровья</li>
              <li>Внедрение цифровых технологий в ПМСП</li>
              <li>Мониторинг и оценку эффективности ПМСП</li>
            </ul>
          </div>
        </div>
      </section>
      
      <PageAccordions 
        sections={[
          {
            title: "Документы по Декларации Астаны",
            documents: [
              { 
                description: "Текст Декларации Астаны (на русском языке)", 
                filetype: "pdf", 
                img: 2, 
                filesize: "1.2 MB",
                date: "26.10.2018",
                url: "#"
              },
              { 
                description: "Руководство по реализации Декларации Астаны", 
                filetype: "pdf", 
                img: 2, 
                filesize: "2.5 MB",
                date: "15.03.2019",
                url: "#"
              },
              { 
                description: "Отчет о прогрессе в реализации Декларации Астаны в Казахстане", 
                filetype: "pdf", 
                img: 2, 
                filesize: "3.8 MB",
                date: "10.12.2023",
                url: "#"
              }
            ]
          },
          {
            title: "Методические материалы",
            documents: [
              { 
                description: "Методические рекомендации по развитию ПМСП", 
                filetype: "pdf", 
                img: 2, 
                filesize: "2.1 MB",
                date: "22.05.2023",
                url: "#"
              },
              { 
                description: "Индикаторы качества ПМСП", 
                filetype: "pdf", 
                img: 2, 
                filesize: "1.7 MB",
                date: "03.09.2023",
                url: "#"
              }
            ]
          }
        ]}
      />
    </>
  );
}

AstanaDeclaration.layout = page => <LayoutFolderChlank 
  h1={translationService.t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.h1')} 
  parentRoute={route('strategic.initiatives')} 
  parentName={translationService.t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.parentName')}
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.breadcrumbStrategic'), route: 'strategic.initiatives' },
    { name: translationService.t('directionsPages.strategicInitiativesSubpages.astanaDeclaration.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;
