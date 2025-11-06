import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import TabDocuments from '@/Components/TabDocuments';
import PageAccordions from '@/Components/PageAccordions';
import translationService from '@/services/TranslationService';

export default function Research() {
    const t = (key, fallback = '') => translationService.t(key, fallback);
    // Пример данных для вкладок документов
    const tabsData = [
        {
            title: "Исследования",
            years: [
                {
                    year: "2023 год",
                    documents: [
                        {
                            title: "Инструмент оценки результативности КИ",
                            fileType: "pdf",
                            fileSize: "24 KB",
                            date: "27.03.2024",
                            url: "/storage/documents/research/2023/оценка_результативности.pdf"
                        },
                        {
                            title: "Методика анализа исследовательских данных",
                            fileType: "pdf",
                            fileSize: "18 KB",
                            date: "15.02.2024",
                            url: "/storage/documents/research/2023/методика_анализа.pdf"
                        }
                    ]
                },
                {
                    year: "2022 год",
                    documents: [
                        {
                            title: "Обзор научных достижений",
                            fileType: "pdf",
                            fileSize: "32 KB",
                            date: "10.12.2022",
                            url: "/storage/documents/research/2022/обзор_достижений.pdf"
                        }
                    ]
                }
            ]
        },
        {
            title: "Методические материалы",
            years: [
                {
                    year: "2023 год",
                    documents: [
                        {
                            title: "Руководство по проведению исследований",
                            fileType: "pdf",
                            fileSize: "42 KB",
                            date: "05.04.2023",
                            url: "/storage/documents/research/methodical/руководство.pdf"
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <>
            <Head title={t('directionsPages.strategicInitiativesSubpages.research.title', 'Исследования')} />
            
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-wrap px-12 text-justify mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">{t('directionsPages.strategicInitiativesSubpages.research.mainTitle')}</h2>
                        <p className="tracking-wide leading-relaxed mb-4">
                            {t('directionsPages.strategicInitiativesSubpages.research.intro1')}
                        </p>
                        <p className="tracking-wide leading-relaxed mb-4">
                            {t('directionsPages.strategicInitiativesSubpages.research.intro2')}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap px-12 text-justify mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">{t('directionsPages.strategicInitiativesSubpages.research.directionsTitle')}</h3>
                        <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
                            <li>
                                <strong>{t('directionsPages.strategicInitiativesSubpages.research.direction1Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.research.direction1Text')}
                            </li>
                            <li>
                                <strong>{t('directionsPages.strategicInitiativesSubpages.research.direction2Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.research.direction2Text')}
                            </li>
                            <li>
                                <strong>{t('directionsPages.strategicInitiativesSubpages.research.direction3Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.research.direction3Text')}
                            </li>
                            <li>
                                <strong>{t('directionsPages.strategicInitiativesSubpages.research.direction4Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.research.direction4Text')}
                            </li>
                            <li>
                                <strong>{t('directionsPages.strategicInitiativesSubpages.research.direction5Title')}</strong> - {t('directionsPages.strategicInitiativesSubpages.research.direction5Text')}
                            </li>
                        </ul>
                    </div>
                    
                    <div className="flex flex-wrap px-12 text-justify mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">{t('directionsPages.strategicInitiativesSubpages.research.materialsTitle')}</h3>
                        
                        {/* Использование компонента TabDocuments с заранее подготовленными данными */}
                        <TabDocuments tabs={tabsData} />
                        
                        {/* Альтернативно можно использовать API для загрузки данных из указанной папки */}
                        {/* 
                        <TabDocuments 
                            api={true} 
                            folder="research" 
                        /> 
                        */}
                    </div>
                    
                    <div className="flex flex-wrap px-12 text-justify mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Стратегические инициативы Центра:</h3>
                        <p className="tracking-wide leading-relaxed mb-4">
                            На основе проводимых исследований Центр разрабатывает и реализует стратегические инициативы, 
                            направленные на совершенствование системы здравоохранения Казахстана:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 w-full">
                            <li>Программа развития первичной медико-санитарной помощи</li>
                            <li>Инициатива по борьбе с неинфекционными заболеваниями</li>
                            <li>Программа цифровизации здравоохранения</li>
                            <li>Инициатива по развитию медицинского образования и науки</li>
                            <li>Программа повышения качества медицинской помощи</li>
                        </ul>
                        <p className="tracking-wide leading-relaxed mt-4">
                            Каждая стратегическая инициатива включает в себя комплекс мероприятий, направленных на достижение 
                            конкретных целей и показателей, а также механизмы мониторинга и оценки эффективности.
                        </p>
                    </div>
                </div>
            </section>
            
            <PageAccordions />
        </>
    );
}

Research.layout = page => (
    <LayoutFolderChlank
        h1={translationService.t('directionsPages.strategicInitiativesSubpages.research.h1')}
        parentRoute={route('strategic.initiatives')} 
        parentName={translationService.t('directionsPages.strategicInitiativesSubpages.research.parentName')}
        heroBgColor="bg-green-100"
        buttonBgColor="bg-green-100"
        buttonHoverBgColor="hover:bg-green-200"
        buttonBorderColor="border-green-200"
        breadcrumbs={[
          { name: translationService.t('directionsPages.strategicInitiativesSubpages.research.breadcrumbDirections'), route: 'directions' },
          { name: translationService.t('directionsPages.strategicInitiativesSubpages.research.breadcrumbStrategic'), route: 'strategic.initiatives' },
          { name: translationService.t('directionsPages.strategicInitiativesSubpages.research.h1'), route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);
