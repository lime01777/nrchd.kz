import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/Services/TranslationService';

export default function PreventionPrograms() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    const title = t('directionsPages.centerPrevention.column1Title', 'Профилактические программы');
    const item1 = t('directionsPages.centerPrevention.column1Item1', 'Профилактические медицинские осмотры');
    const item2 = t('directionsPages.centerPrevention.column1Item2', 'Скрининг целевых групп населения');
    const item3 = t('directionsPages.centerPrevention.column1Item3', 'Профилактика НИЗ');

    return (
        <>
            <Head title={title} />

            <section className="text-gray-600 body-font py-20 bg-white">
                <div className="container px-5 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-blue-50 overflow-hidden mb-12 transform hover:scale-[1.01] transition-transform duration-500">
                            <img src="/img/CenterPrevention/col1.png" alt={title} className="w-full h-[400px] object-cover rounded-[1.8rem]" />
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700">
                            <ul className="space-y-6">
                                {item1 && (
                                    <li className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border-l-8 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold">1</div>
                                        <span className="text-xl font-medium">{item1}</span>
                                    </li>
                                )}
                                {item2 && (
                                    <li className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border-l-8 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold">2</div>
                                        <span className="text-xl font-medium">{item2}</span>
                                    </li>
                                )}
                                {item3 && (
                                    <li className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border-l-8 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold">3</div>
                                        <span className="text-xl font-medium">{item3}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

PreventionPrograms.layout = (page) => {
    return (
        <LayoutFolderChlank
            h1={translationService.t('directionsPages.centerPrevention.column1Title', 'Профилактические программы')}
            parentRoute={route('direction.center_prevention')}
            parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
            heroBgColor="bg-blue-200"
            heroColorSec="bg-blue-300"
            buttonBgColor="bg-blue-100"
            buttonHoverBgColor="hover:bg-blue-200"
            buttonBorderColor="border-blue-300"
            bgColor="bg-white"
        >
            {page}
        </LayoutFolderChlank>
    );
};
