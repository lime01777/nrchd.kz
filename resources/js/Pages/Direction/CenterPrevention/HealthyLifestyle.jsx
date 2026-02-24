import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/Services/TranslationService';
import YouthHealthCentersMap from '@/Components/YouthHealthCentersMap';

export default function HealthyLifestyle() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    const title = t('directionsPages.centerPrevention.column2Title', 'Формирование здорового образа жизни');
    const items = [
        t('directionsPages.centerPrevention.column2Item1', 'Национальные программы по ЗОЖ'),
        t('directionsPages.centerPrevention.column2Item2', 'Молодежные центры здоровья'),
        t('directionsPages.centerPrevention.column2Item3', 'Культура здорового и рационального питания'),
        t('directionsPages.centerPrevention.column2Item4', 'Меры по сокращению табакокурения и алкоголя')
    ];

    const projects = [
        t('directionsPages.centerPrevention.column2Project1', '«Здоровые города и регионы»'),
        t('directionsPages.centerPrevention.column2Project2', '«Саламатты мектеп/Школы, способствующие укреплению здоровья»'),
        t('directionsPages.centerPrevention.column2Project3', '«Здоровье университеты»'),
        t('directionsPages.centerPrevention.column2Project4', '«Здоровье рабочие места»')
    ];

    return (
        <>
            <Head title={title} />

            <section className="text-gray-600 body-font py-20 bg-white">
                <div className="container px-5 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-green-50 overflow-hidden mb-12 transform hover:scale-[1.01] transition-transform duration-500">
                            <img src="/img/CenterPrevention/col2.png" alt={title} className="w-full h-[400px] object-cover rounded-[1.8rem]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-green-50 p-8 rounded-[2rem] border-t-8 border-green-400">
                                <h3 className="text-2xl font-black text-green-800 mb-6 flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Направления
                                </h3>
                                <ul className="space-y-4">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-lg font-medium text-gray-700">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-8 rounded-[2rem] border-t-8 border-blue-400">
                                <h3 className="text-2xl font-black text-blue-800 mb-6 flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    Проекты
                                </h3>
                                <ul className="space-y-4">
                                    {projects.map((project, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-lg font-medium text-blue-700 hover:text-blue-900 cursor-pointer transition-colors">
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                            {project}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

HealthyLifestyle.layout = (page) => {
    return (
        <LayoutFolderChlank
            h1={translationService.t('directionsPages.centerPrevention.column2Title', 'Формирование здорового образа жизни')}
            parentRoute={route('direction.center_prevention')}
            parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
            heroBgColor="bg-green-200"
            heroColorSec="bg-green-300"
            buttonBgColor="bg-green-100"
            buttonHoverBgColor="hover:bg-green-200"
            buttonBorderColor="border-green-300"
            bgColor="bg-white"
        >
            {page}
        </LayoutFolderChlank>
    );
};
