import React from 'react';
import FooterNav from './FooterNav';

const FooterLinks = () => {
    const navLinks1 = [
        {label: 'Направления', url:'/direction'},
        {label: 'Услуги', url:'/services'},
        {label: 'Филиалы', url:'/branches'},
        {label: 'Новости', url:'/news'},
        {label: 'Вакансии', url:'/vacancies'},
    ];
    const navLinks2 = [
        {label: 'Новости ННЦРЗ', url:'/news'},
        {label: 'Новости по направлениям', url:'/news/directions'},
        {label: 'Новости филиалов', url:'/news/branches'},
        {label: 'Салидат Каирбекова', url:'/about-centre/salidat-kairbekova'},
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
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3">Контактная
                            информация</h2>
                        <nav className="list-none mb-10">
                            <li>
                                <a href="mailto:s.zhaldybaeva@nrchd.kz"
                                    className="text-gray-600 hover:text-gray-800 hover:underline">s.zhaldybaeva@nrchd.kz</a>
                            </li>
                        </nav>
                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3">График работы</h2>
                        <nav className="list-none mb-10">
                            <li>
                                <span className="text-gray-600">Пн...Пт, с 9:00 до 18:00</span>
                            </li>
                            <li>
                                <span className="text-gray-600">Перерыв с 13:00 до 14:00</span>
                            </li>
                        </nav>
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