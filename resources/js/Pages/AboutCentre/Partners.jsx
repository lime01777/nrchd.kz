import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import Sponsors from '@/Components/Sponsors';

export default function Partners() {
    return (
        <>
            <Head title="Партнеры | NNCRZ" />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className='flex flex-wrap px-12 text-justify mb-4'>
                        <p className="tracking-wide leading-relaxed">
                            Национальный научный центр развития здравоохранения им. Салидат Каирбековой активно сотрудничает 
                            с ведущими медицинскими организациями Казахстана и международными партнерами. Наше сотрудничество 
                            направлено на обмен опытом, проведение совместных научных исследований, реализацию образовательных 
                            программ и развитие системы здравоохранения Республики Казахстан.
                        </p>
                        <p className="tracking-wide leading-relaxed mt-4">
                            Мы открыты для новых партнерств и готовы к сотрудничеству с организациями, разделяющими наши 
                            ценности и стремление к повышению качества медицинской помощи и развитию здравоохранения.
                        </p>
                    </div>
                </div>
            </section>

            <Sponsors />

            <section className="text-gray-600 body-font pb-24">
                <div className="container px-5 mx-auto">
                    <div className='flex flex-wrap px-12 text-justify'>
                        <h2 className="sm:text-2xl text-xl font-semibold title-font text-gray-900 mb-4 w-full">Направления сотрудничества</h2>
                        <ul className="list-disc pl-6 space-y-2 w-full">
                            <li>Совместные научные исследования в области медицины и здравоохранения</li>
                            <li>Разработка и внедрение инновационных медицинских технологий</li>
                            <li>Обмен опытом и лучшими практиками в области организации здравоохранения</li>
                            <li>Проведение образовательных программ и повышение квалификации медицинских работников</li>
                            <li>Организация совместных научно-практических конференций, семинаров и форумов</li>
                            <li>Разработка методических рекомендаций и стандартов в области здравоохранения</li>
                            <li>Совместные публикации в научных изданиях</li>
                        </ul>
                        
                        <div className="mt-10 w-full">
                            <h2 className="sm:text-2xl text-xl font-semibold title-font text-gray-900 mb-4">Как стать партнером</h2>
                            <p className="tracking-wide leading-relaxed">
                                Если вы заинтересованы в сотрудничестве с Национальным научным центром развития здравоохранения 
                                им. Салидат Каирбековой, пожалуйста, направьте письмо с предложением о сотрудничестве на 
                                электронную почту <a href="mailto:cooperation@nrchd.kz" className="text-indigo-600 hover:text-indigo-800">cooperation@nrchd.kz</a> или 
                                свяжитесь с нами по телефону +7 (7172) 70-95-30.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Partners.layout = (page) => <LayoutDirection img="partner" h1="Партнеры">{page}</LayoutDirection>;
