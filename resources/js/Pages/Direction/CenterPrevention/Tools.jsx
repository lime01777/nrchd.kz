import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/Services/TranslationService';

export default function Tools() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    return (
        <>
            <Head title={t('directionsPages.centerPrevention.tab3Label', 'Инструменты')} />

            <section className="text-gray-600 body-font py-8">
                <div className="container px-5 mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Отображаем файлы из папки ЗОЖ/Инструменты */}
                        <SimpleFileDisplay
                            folder={t('directionsPages.centerPrevention.tab3Folder', 'ЗОЖ/Инструменты')}
                            title={t('directionsPages.centerPrevention.tab3Label', 'Инструменты')}
                            bgColor="bg-white"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

// Используем LayoutFolderChlank как на остальных страницах раздела
Tools.layout = (page) => (
    <LayoutFolderChlank
        h1={translationService.t('directionsPages.centerPrevention.tab3Label', 'Инструменты')}
        parentRoute={route('direction.center_prevention')}
        parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
        heroBgColor="bg-emerald-200"
        heroColorSec="bg-emerald-300"
        buttonBgColor="bg-emerald-100"
        buttonHoverBgColor="hover:bg-emerald-200"
        buttonBorderColor="border-emerald-300"
        bgColor="bg-white"
        breadcrumbs={[
            { name: translationService.t('nav.directions', 'Направления'), route: 'directions' },
            { name: translationService.t('directions.center_prevention', 'Центр профилактики'), route: 'direction.center_prevention' },
            { name: translationService.t('directionsPages.centerPrevention.tab3Label', 'Инструменты'), route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);
