import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function Contacts() {
    return (
        <>
            <Head title="Контактная информация | NNCRZ" />
            <section className="text-gray-600 body-font relative">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-col text-left w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Контактная информация</h1>
                        <p className="lg:w-2/3 leading-relaxed text-base">
                            Свяжитесь с Национальным научным центром развития здравоохранения имени Салидат Каирбековой. Мы всегда готовы ответить на ваши вопросы.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap -mx-4">
                        <div className="p-4 md:w-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Адрес и контакты</h2>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">Адрес:</h3>
                                    <p className="text-gray-600">010000, Республика Казахстан, г. Астана, ул. Мангилек Ел, 20</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">Телефоны:</h3>
                                    <p className="text-gray-600">+7 (7172) 70-95-10 (приемная)</p>
                                    <p className="text-gray-600">+7 (7172) 70-95-01 (канцелярия)</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">E-mail:</h3>
                                    <p className="text-gray-600">office@nrchd.kz</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-700 font-medium">График работы:</h3>
                                    <p className="text-gray-600">Пн - Пт, с 9:00 до 18:00</p>
                                    <p className="text-gray-600">Перерыв с 13:00 до 14:00</p>
                                    <p className="text-gray-600">Сб, Вс - выходные дни</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 md:w-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Обратная связь</h2>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">Пресс-служба:</h3>
                                    <p className="text-gray-600">+7 (7172) 70-95-20</p>
                                    <p className="text-gray-600">press@nrchd.kz</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">По вопросам сотрудничества:</h3>
                                    <p className="text-gray-600">+7 (7172) 70-95-30</p>
                                    <p className="text-gray-600">cooperation@nrchd.kz</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-700 font-medium">Для отправки резюме:</h3>
                                    <p className="text-gray-600">hr@nrchd.kz</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap mt-8">
                        <div className="w-full">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Карта проезда</h2>
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d469.4763059572582!2d71.43565068647455!3d51.11692493107856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424585006513e77b%3A0x3b03064db10fe73!2z0J3QsNGG0LjQvtC90LDQu9GM0L3Ri9C5INC90LDRg9GH0L3Ri9C5INGG0LXQvdGC0YAg0YDQsNC30LLQuNGC0LjRjyDQt9C00YDQsNCy0L7QvtGF0YDQsNC90LXQvdC40Y8g0LjQvNC10L3QuCDQodCw0LvQuNC00LDRgiDQmtCw0LjRgNCx0LXQutC-0LLQvtC5INCc0Jcg0KDQmiAo0J3QndCm0KDQlyDQnNCXINCg0Jop!5e0!3m2!1sru!2skz!4v1747113775363!5m2!1sru!2skz" 
                                        width="100%" 
                                        height="450" 
                                        style={{ border: 0 }} 
                                        allowFullScreen="" 
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap mt-8">
                        <div className="w-full">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Форма обратной связи</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">ФИО</label>
                                            <input type="text" id="name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input type="email" id="email" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Тема</label>
                                        <input type="text" id="subject" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Сообщение</label>
                                        <textarea id="message" rows="4" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Отправить
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Contacts.layout = (page) => <LayoutDirection img="contact" h1="Контактная информация">{page}</LayoutDirection>;
