import { Head, usePage } from '@inertiajs/react'
import LayoutDirection from '@/Layouts/LayoutDirection'
import React from 'react'
import translationService from '@/services/TranslationService';

export default function SalidatKairbekova() {
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

  return (
    <>
    <Head title={t('salidatKairbekova.pageTitle')} />
    <main>
        <section className='text-gray-600 body-font pb-8'>
            <div className='container px-5 pt-12 mx-auto'>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.intro')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify mb-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.earlyYears.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.earlyYears.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.earlyYears.paragraph2')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.doctorToManager.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.doctorToManager.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.doctorToManager.paragraph2')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.academicActivity.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.academicActivity.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.academicActivity.paragraph2')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.academicActivity.paragraph3')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.presidentialAdministration.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.presidentialAdministration.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.presidentialAdministration.paragraph2')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.presidentialAdministration.paragraph3')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.lifesWork.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.lifesWork.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.lifesWork.paragraph2')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.lifesWork.paragraph3')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.lifesWork.paragraph4')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.afterMinistry.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.afterMinistry.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.afterMinistry.paragraph2')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.afterMinistry.paragraph3')}
                    </p>
                </div>

                <div className='flex flex-wrap px-12 text-justify my-4'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">{t('salidatKairbekova.memorialization.title')}</h1>

                    <p className="tracking-wide leading-relaxed">
                        {t('salidatKairbekova.memorialization.paragraph1')}
                    </p>
                    <br />
                    <p className='tracking-wide leading-relaxed'>
                        {t('salidatKairbekova.memorialization.paragraph2')}
                    </p>
                </div>

            </div>
        </section>
    </main>
    </>
  )
}

SalidatKairbekova.layout = (page) => {
    const t = (key, fallback = '') => translationService.t(key, fallback);
    return <LayoutDirection img="salidatkairbekova" h1={t('salidatKairbekova.pageTitle')}>{page}</LayoutDirection>;
}
