import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/Services/TranslationService';

export default function Legislation() {
    const t = (key, fallback = '') => translationService.t(key, fallback);

    return (
        <>
            <Head title={t('directionsPages.centerPrevention.tab1Label', 'Законодательство')} />

            <section className="text-gray-600 body-font py-8">
                <div className="container px-5 mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Отображаем файлы из папки ЗОЖ/Законодательство */}
                        <SimpleFileDisplay
                            folder={t('directionsPages.centerPrevention.tab1Folder', 'ЗОЖ/Законадательство')}
                            title={t('directionsPages.centerPrevention.tab1Label', 'Законодательство')}
                            bgColor="bg-white"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

// Используем LayoutFolderChlank как на остальных страницах раздела
Legislation.layout = (page) => (
    <LayoutFolderChlank
        h1={translationService.t('directionsPages.centerPrevention.tab1Label', 'Законодательство')}
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
            { name: translationService.t('directionsPages.centerPrevention.tab1Label', 'Законодательство'), route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);
