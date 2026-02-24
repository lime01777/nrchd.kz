import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/Services/TranslationService';
import FileAccordTitle from '@/Components/FileAccordTitle';
import Modal from '@/Components/UI/Modal';

export default function Communications() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    const title = t('directionsPages.centerPrevention.column3Title', 'Коммуникации и просвещение');
    const items = [
        t('directionsPages.centerPrevention.column3Item1', 'Мероприятия'),
        t('directionsPages.centerPrevention.column3Item2', 'Видеоролики'),
        t('directionsPages.centerPrevention.column3Item3', 'Информационно-разъяснительная работа'),
        t('directionsPages.centerPrevention.column3Item4', 'Инфографика, публикации, подкасты')
    ];

    return (
        <>
            <Head title={title} />

            <section className="text-gray-600 body-font py-20 bg-white">
                <div className="container px-5 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-purple-50 overflow-hidden mb-12 transform hover:scale-[1.01] transition-transform duration-500">
                            <img src="/img/CenterPrevention/col3.png" alt={title} className="w-full h-[400px] object-cover rounded-[1.8rem]" />
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-6 bg-purple-50 rounded-2xl border-l-4 border-purple-400 hover:bg-purple-100 transition-colors shadow-sm">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                                        </div>
                                        <span className="text-lg font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Communications.layout = (page) => {
    return (
        <LayoutFolderChlank
            h1={translationService.t('directionsPages.centerPrevention.column3Title', 'Коммуникации и просвещение')}
            parentRoute={route('direction.center_prevention')}
            parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
            heroBgColor="bg-purple-200"
            heroColorSec="bg-purple-300"
            buttonBgColor="bg-purple-100"
            buttonHoverBgColor="hover:bg-purple-200"
            buttonBorderColor="border-purple-300"
            bgColor="bg-white"
        >
            {page}
        </LayoutFolderChlank>
    );
};
