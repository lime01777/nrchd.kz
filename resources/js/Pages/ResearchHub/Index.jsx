import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/Services/TranslationService';

const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function Index({ researches, locale }) {
    const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguage());

    useEffect(() => {
        const handleLanguageChange = (e) => {
            setCurrentLanguage(e.detail.language);
        };
        window.addEventListener('languageChanged', handleLanguageChange);
        return () => {
            window.removeEventListener('languageChanged', handleLanguageChange);
        };
    }, []);

    return (
        <>
            <Head title={t('researchHub.title', 'Research Hub - Единая научная база')} />

            <section className="py-20 bg-gray-50 min-h-[50vh]">
                <div className="container px-5 mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            {t('researchHub.registryTitle', 'Централизованный реестр исследований')}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {t('researchHub.registrySubtitle', 'Единая база результатов исследований, включая HBSC, GATS, STEPS, COSI и другие сопоставимые исследования.')}
                        </p>
                    </div>

                    {researches.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-semibold text-gray-500">
                                {t('researchHub.empty', 'Исследования пока не добавлены')}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {researches.map((research) => (
                                <Link
                                    key={research.id}
                                    href={route('research_hub.show', research.slug)}
                                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
                                >
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                            {research.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3">
                                            {research.description}
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                        <span className="font-semibold text-blue-600">
                                            Подробнее &rarr;
                                        </span>
                                        {research.period && (
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {research.period}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

Index.layout = (page) => (
    <LayoutFolderChlank
        h1={translationService.t('researchHub.title', 'Research Hub')}
        parentRoute={route('direction.center_prevention')}
        parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
        heroBgColor="bg-blue-200"
        heroColorSec="bg-blue-300"
        buttonBgColor="bg-blue-100"
        buttonHoverBgColor="hover:bg-blue-200"
        buttonBorderColor="border-blue-300"
        bgColor="bg-white"
        breadcrumbs={[
            { name: translationService.t('nav.directions', 'Направления'), route: 'directions' },
            { name: translationService.t('directions.center_prevention', 'Центр профилактики'), route: 'direction.center_prevention' },
            { name: 'Research Hub', route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);
