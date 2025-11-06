import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import Sponsors from '@/Components/Sponsors';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function Partners() {

    return (
        <>
            <Head title={t('partners.pageTitle')} />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className='flex flex-wrap px-12 text-justify mb-4'>
                        <p className="tracking-wide leading-relaxed">
                            {t('partners.intro')}
                        </p>
                        <p className="tracking-wide leading-relaxed mt-4">
                            {t('partners.openText')}
                        </p>
                    </div>
                </div>
            </section>

            <Sponsors />

            <section className="text-gray-600 body-font pb-24">
                <div className="container px-5 mx-auto">
                    <div className='flex flex-wrap px-12 text-justify'>
                        <h2 className="sm:text-2xl text-xl font-semibold title-font text-gray-900 mb-4 w-full">{t('partners.cooperationTitle')}</h2>
                        <ul className="list-disc pl-6 space-y-2 w-full">
                            {t('partners.cooperationItems', []).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        
                        <div className="mt-10 w-full">
                            <h2 className="sm:text-2xl text-xl font-semibold title-font text-gray-900 mb-4">{t('partners.becomePartnerTitle')}</h2>
                            <p className="tracking-wide leading-relaxed">
                                {t('partners.becomePartnerText')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Partners.layout = (page) => <LayoutDirection img="partner" h1={t('partners.pageTitle')}>{page}</LayoutDirection>;
