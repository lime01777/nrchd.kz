import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import translationService from '@/Services/TranslationService';

export default function ZozhReports() {
    const t = (key, fallback = '') => translationService.t(key, fallback);
    const pageName = t('directionsPages.centerPrevention.zozhReports', 'Отчеты по ЗОЖ');

    return (
        <>
            <Head title={pageName} />
            <section className="text-gray-600 body-font py-8">
                <div className="container px-5 mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Отображаем файлы из папки zozh_reports */}
                        <SimpleFileDisplay
                            folder="documents/ЗОЖ/zozh_reports"
                            title={pageName}
                            bgColor="bg-white"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

// Используем LayoutFolderChlank как на остальных страницах раздела
ZozhReports.layout = (page) => (
    <LayoutFolderChlank
        h1={translationService.t('directionsPages.centerPrevention.zozhReports', 'Отчеты по ЗОЖ')}
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
            { name: translationService.t('directionsPages.centerPrevention.zozhReports', 'Отчеты по ЗОЖ'), route: null }
        ]}
    >
        {page}
    </LayoutFolderChlank>
);
