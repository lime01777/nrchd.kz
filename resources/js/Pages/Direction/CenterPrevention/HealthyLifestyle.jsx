import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/Services/TranslationService';
import YouthHealthCentersMap from '@/Components/YouthHealthCentersMap';

export default function HealthyLifestyle() {
    const [pageTitle, setPageTitle] = useState('');
    const [title, setTitle] = useState('');
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');
    const [item4, setItem4] = useState('');
    const [projectsTitle, setProjectsTitle] = useState('');
    const [project1, setProject1] = useState('');
    const [project2, setProject2] = useState('');
    const [project3, setProject3] = useState('');
    const [project4, setProject4] = useState('');
    const [youthCentersTitle, setYouthCentersTitle] = useState('');
    const [youthCentersDescription, setYouthCentersDescription] = useState('');

    // Глобальная функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    useEffect(() => {
        const updateTranslations = () => {
            setPageTitle(t('directionsPages.centerPrevention.column2Title', 'Формирование здорового образа жизни'));
            setTitle(t('directionsPages.centerPrevention.column2Title', 'Формирование здорового образа жизни'));
            setItem1(t('directionsPages.centerPrevention.column2Item1', 'Национальные программы по ЗОЖ'));
            setItem2(t('directionsPages.centerPrevention.column2Item2', 'Молодежные центры здоровья'));
            setItem3(t('directionsPages.centerPrevention.column2Item3', 'Культура здорового и рационального питания'));
            setItem4(t('directionsPages.centerPrevention.column2Item4', 'Меры по сокращению табакокурения и алкоголя'));

            setProjectsTitle(t('directionsPages.centerPrevention.column2ProjectsTitle', 'Проекты:'));
            setProject1(t('directionsPages.centerPrevention.column2Project1', '«Здоровые города и регионы»'));
            setProject2(t('directionsPages.centerPrevention.column2Project2', '«Саламатты мектеп/Школы, способствующие укреплению здоровья»'));
            setProject3(t('directionsPages.centerPrevention.column2Project3', '«Здоровье университеты»'));
            setProject4(t('directionsPages.centerPrevention.column2Project4', '«Здоровье рабочие места»'));

            setYouthCentersTitle(t('directionsPages.centerPrevention.youthCentersTitle', 'Молодежные центры здоровья'));
            setYouthCentersDescription(t('directionsPages.centerPrevention.youthCentersDescription', 'Интерактивная карта молодежных центров здоровья по всей Республике Казахстан'));
        };

        updateTranslations();
        window.addEventListener('languageChanged', updateTranslations);

        return () => {
            window.removeEventListener('languageChanged', updateTranslations);
        };
    }, []);

    return (
        <>
            <Head title={pageTitle} />

            <section className="text-gray-600 body-font py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

                        <div className="w-full md:w-2/3 lg:w-1/2 mb-10 text-center">
                            <div className="aspect-square mx-auto rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white shadow-lg max-w-sm">
                                <img src="/img/CenterPrevention/col2.png" alt={title} className="object-cover w-full h-full" />
                            </div>
                        </div>

                        <div className="w-full md:w-2/3 lg:w-1/2">
                            <ul className="list-disc list-inside space-y-4 text-lg text-gray-700 bg-gray-50 p-8 rounded-xl shadow-inner mb-8">
                                {item1 && <li className="pl-2">{item1}</li>}
                                {item2 && <li className="pl-2">{item2}</li>}
                                {item3 && <li className="pl-2">{item3}</li>}
                                {item4 && <li className="pl-2">{item4}</li>}

                                {projectsTitle && (
                                    <li className="pt-4 list-none border-t border-gray-200 mt-4">
                                        <span className="font-semibold block mb-2">{projectsTitle}</span>
                                        <ul className="list-none space-y-2 ml-4">
                                            {project1 && <li className="text-blue-600 hover:text-blue-800 transition-colors"><a href="#">{project1}</a></li>}
                                            {project2 && <li className="text-blue-600 hover:text-blue-800 transition-colors"><a href="#">{project2}</a></li>}
                                            {project3 && <li className="text-blue-600 hover:text-blue-800 transition-colors"><a href="#">{project3}</a></li>}
                                            {project4 && <li className="text-blue-600 hover:text-blue-800 transition-colors"><a href="#">{project4}</a></li>}
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="text-center mb-8 border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{youthCentersTitle}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            {youthCentersDescription}
                        </p>
                        <YouthHealthCentersMap />
                    </div>
                </div>
            </section>
        </>
    );
}

HealthyLifestyle.layout = (page) => {
    const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
    return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};
