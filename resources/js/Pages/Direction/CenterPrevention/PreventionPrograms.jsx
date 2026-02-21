import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/Services/TranslationService';

export default function PreventionPrograms() {
    const [pageTitle, setPageTitle] = useState('');
    const [title, setTitle] = useState('');
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');

    // Глобальная функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    useEffect(() => {
        const updateTranslations = () => {
            setPageTitle(t('directionsPages.centerPrevention.column1Title', 'Профилактические программы'));
            setTitle(t('directionsPages.centerPrevention.column1Title', 'Профилактические программы'));
            setItem1(t('directionsPages.centerPrevention.column1Item1', 'Профилактические медицинские осмотры'));
            setItem2(t('directionsPages.centerPrevention.column1Item2', 'Скрининг целевых групп населения'));
            setItem3(t('directionsPages.centerPrevention.column1Item3', 'Профилактика НИЗ'));
        };

        updateTranslations();
        window.addEventListener('languageChanged', updateTranslations);

        return () => {
            window.removeEventListener('languageChanged', updateTranslations);
        };
    }, []);

    return (
        <>
            <Head title={pageTitle} />

            <section className="text-gray-600 body-font py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

                        <div className="w-full md:w-2/3 lg:w-1/2 mb-10 text-center">
                            <div className="aspect-square mx-auto rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white shadow-lg max-w-sm">
                                <img src="/img/CenterPrevention/col1.png" alt={title} className="object-cover w-full h-full" />
                            </div>
                        </div>

                        <div className="w-full md:w-2/3 lg:w-1/2">
                            <ul className="list-disc list-inside space-y-4 text-lg text-gray-700 bg-gray-50 p-8 rounded-xl shadow-inner">
                                {item1 && <li className="pl-2">{item1}</li>}
                                {item2 && <li className="pl-2">{item2}</li>}
                                {item3 && <li className="pl-2">{item3}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

PreventionPrograms.layout = (page) => {
    const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
    return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};
