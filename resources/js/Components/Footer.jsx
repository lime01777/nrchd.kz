import React from 'react';
import FooterNav from './FooterNav';

const FooterLinks = () => {
    const navLinks1 = [
        {label: 'Направления', url:'/direction', translate: true},
        {label: 'Услуги', url:'/services', translate: true},
        {label: 'Филиалы', url:'/branches', translate: true},
        {label: 'Новости', url:'/news', translate: true},
        {label: 'Вакансии', url:'/vacancies', translate: true},
    ];
    const navLinks2 = [
        {label: 'Новости ННЦРЗ', url:'/news', translate: true},
        {label: 'Новости по направлениям', url:'/news/directions', translate: true},
        {label: 'Новости филиалов', url:'/news/branches', translate: true},
        {label: 'Салидат Каирбекова', url:'/about-centre/salidat-kairbekova', translate: true},
    ];

    return (
        <footer className="text-gray-600 body-font bg-gray-100">
            {/* Горизонтальная линия вверху футера */}
            <div className='pt-4'>
            </div>
            <div className="container mx-auto">
                <hr className="border-t border-gray-300 my-6" />
            </div>

            <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                <div className="flex-grow flex flex-wrap -mb-10 md:mt-0 mt-10 md:text-left text-center">
                    <FooterNav title='Главное меню' links={navLinks1} />
                    <FooterNav title='О центре' links={navLinks2} />
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3" data-translate>Контактная
                            информация</h2>

                            <div className="flex items-center mb-2">
                                <a href="mailto:office@nrchd.kz" className="hover:text-blue-600 hover:underline">
                                    <span className="font-medium">office@nrchd.kz</span>
                                </a>
                            </div>
                            <div className="flex items-center mt-2 mb-1">
                                <a href="tel:+77172648951" className="hover:text-blue-600 hover:underline">
                                    <span className="font-medium">+7 (7172) 648-951</span> <span className="text-gray-500 text-sm"></span>
                                </a>
                            </div>
                            <div className="flex items-center">
                                <a href="tel:+77172648951" className="hover:text-blue-600 hover:underline">
                                    <span className="font-medium">+7 (7172) 648-951</span> <span className="text-gray-500 text-sm"></span>
                                </a>
                            </div>

                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3">График работы</h2>

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                    <span className="text-gray-700">Пн–Пт: <span className="">9:00–18:00</span></span>
                                </div>
                                <div className="flex items-center">

                                    <span className="text-gray-700">Обед: <span className="">13:00–14:00</span></span>
                                </div>
                            </div>

                    </div>
                </div>
            </div>
            <div className="bg-gray-100">
                <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                    <p className="inline text-gray-500 md:text-sm text-xs text-center sm:text-left">Республиканское государственное
                        предприятие на праве хозяйственного ведения <br />
                        «Национальный научный центр развития здравоохранения имени Салидат Каирбековой»</p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                        <p className="text-gray-500 text-sm text-center sm:text-left">2025</p>
                    </span>
                </div>
            </div>
        </footer>
    );
};


export default FooterLinks