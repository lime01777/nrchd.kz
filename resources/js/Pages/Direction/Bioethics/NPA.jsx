import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import NormativeDocumentsList from '@/Components/NormativeDocumentsList';

export default function BioethicsNPA() {
    // Национальное законодательство
    const nationalLegislation = [
        {
            title: "Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК «О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ» - Статья 228",
            url: "https://adilet.zan.kz/rus/docs/K2000000360"
        },
        {
            title: "Приказ Министра здравоохранения Республики Казахстан от 11 декабря 2020 года № ҚР ДСМ-248/2020. Об утверждении правил проведения клинических исследований лекарственных средств и медицинских изделий",
            url: "https://adilet.zan.kz/rus/docs/V2000021772"
        },
        {
            title: "Приказ Министра здравоохранения Республики Казахстан от 21 декабря 2020 года № ҚР ДСМ-310/2020. Об утверждении правил проведения биомедицинских исследований и требований к исследовательским центрам",
            url: "https://adilet.zan.kz/rus/docs/V2000021851"
        },
        {
            title: "Приказ Министра здравоохранения Республики Казахстан от 11 декабря 2020 года № ҚР ДСМ-255/2020. Об утверждении правил проведения доклинических (неклинических) исследований",
            url: "https://adilet.zan.kz/rus/docs/V2000021794"
        },
        {
            title: "Приказ и.о. Министра здравоохранения Республики Казахстан от 4 февраля 2021 года № ҚР ДСМ-15. Об утверждении надлежащих фармацевтических практик",
            url: "https://adilet.zan.kz/rus/docs/V2100022167#z1214"
        }
    ];

    // Международные документы по биоэтике
    const internationalDocuments = [
        {
            title: "Всеобщая декларация о биоэтике и правах человека, принята резолюцией Генеральной конференции ЮНЕСКО 19 октября 2005 года",
            url: "https://www.un.org/ru/documents/decl_conv/declarations/bioethics_and_hr.shtml"
        },
        {
            title: "Хельсинская декларация Всемирной медицинской ассоциации. Этические принципы проведения медицинских исследований с участием человека в качестве субъекта, 1964",
            url: "http://arctica-ac.ru/docs/Redactsia/WMA%20Declaration_Helsinki_RUS.pdf"
        },
        {
            title: "ICH harmonised guideline integrated addendum to ICH E6(R1): Guideline for Good Clinical Practice ICH E6(R2)",
            url: "https://ichgcp.net/"
        },
        {
            title: "Operational guidelines for ethics committees that review biomedical research",
            url: "https://osp.od.nih.gov/wp-content/uploads/2013/08/operational-guidelines.pdf"
        },
        {
            title: "CIOMS, Международные этические руководящие принципы для исследований в области здоровья с участием людей, 2016",
            url: "https://cioms.ch/wp-content/uploads/2019/01/WEB-CIOMS-EthicalGuidelinesRussianLayout.pdf"
        }
    ];

    return (
        <>
            <Head title="НПА" meta={[{ name: 'description', content: 'Нормативно-правовые акты в области биоэтики: национальное законодательство и международные документы.' }]} />
            
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className='flex flex-wrap px-12 text-justify mb-4'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">
                            НПА
                        </h2>
                        
                        <p className="tracking-wide leading-relaxed mb-4">
                            Центральная комиссия по биоэтике при Министерстве здравоохранения Республики Казахстан осуществляет свою деятельность в соответствии с национальным законодательством Республики Казахстан и международными стандартами в области биоэтики.
                        </p>
                        
                        <p className="tracking-wide leading-relaxed mb-4">
                            В данном разделе представлены основные нормативно-правовые акты, регулирующие деятельность в области биоэтики, включая национальное законодательство Республики Казахстан и международные документы, признанные мировым сообществом.
                        </p>
                    </div>
                </div>
            </section>

            {/* Национальное законодательство */}
            <section className="text-gray-600 body-font py-12 bg-gray-50">
                <div className="container px-5 mx-auto">
                    <div className="px-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                            Национальное законодательство
                        </h2>
                        
                        <div className="mb-6">
                            <p className="text-gray-700 mb-6 text-center">
                                Основные нормативно-правовые акты Республики Казахстан, регулирующие деятельность в области биоэтики, проведения биомедицинских исследований и обеспечения безопасности участников исследований.
                            </p>
                        </div>

                        <NormativeDocumentsList 
                            documents={nationalLegislation}
                            bgColor="bg-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Международные документы */}
            <section className="text-gray-600 body-font py-12">
                <div className="container px-5 mx-auto">
                    <div className="px-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                            Международные документы по биоэтике
                        </h2>
                        
                        <div className="mb-6">
                            <p className="text-gray-700 mb-6 text-center">
                                Международные стандарты и руководящие принципы в области биоэтики, признанные мировым сообществом и применяемые в деятельности Центральной комиссии по биоэтике.
                            </p>
                        </div>

                        <NormativeDocumentsList 
                            documents={internationalDocuments}
                            bgColor="bg-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Дополнительная информация */}
            <section className="text-gray-600 body-font py-12 bg-gray-50">
                <div className="container px-5 mx-auto">
                    <div className="px-12">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Важная информация
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    <strong>Обновление документов:</strong> Нормативно-правовые акты могут обновляться в соответствии с изменениями в законодательстве. Рекомендуется регулярно проверять актуальность документов на официальных источниках.
                                </p>
                                <p>
                                    <strong>Применение стандартов:</strong> Все биомедицинские исследования в Республике Казахстан должны проводиться в соответствии с действующими нормативно-правовыми актами и международными стандартами.
                                </p>
                                <p>
                                    <strong>Консультации:</strong> По вопросам применения нормативно-правовых актов в области биоэтики можно обращаться в Центральную комиссию по биоэтике.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

BioethicsNPA.layout = page => <LayoutFolderChlank 
    h1="НПА"
    title="Нормативно-правовые акты"
    parentRoute={route('bioethics')}
    parentName="Центральная комиссия по биоэтике"
    heroBgColor="bg-blue-100"
    buttonBgColor="bg-blue-100"
    buttonHoverBgColor="hover:bg-blue-200"
    buttonBorderColor="border-blue-200"
>{page}</LayoutFolderChlank>
