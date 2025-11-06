import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function FAQ() {
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    // Получаем переводы вопросов из JSON
    const faqItems = t('faq.questions', []);

    return (
        <>
            <Head title={t('faq.pageTitle')} />
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-col text-left w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('faq.pageTitle')}</h1>
                        <p className="lg:w-2/3 leading-relaxed text-base">
                            {t('faq.description')}
                        </p>
                    </div>
                    <div className="flex flex-wrap -m-2">
                        <div className="p-2 w-full">
                            <div className="bg-white rounded-lg">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                                        <button 
                                            onClick={() => toggleQuestion(index)}
                                            className="w-full py-4 px-5 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                                        >
                                            <span className="text-lg font-medium text-gray-900">{item.question}</span>
                                            <svg 
                                                className={`w-6 h-6 transition-transform duration-200 ${openQuestion === index ? 'transform rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div 
                                            className={`overflow-hidden transition-all duration-300 ${openQuestion === index ? 'max-h-96' : 'max-h-0'}`}
                                        >
                                            <div className="p-5 bg-gray-50 text-gray-600">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-12">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">{t('faq.notFoundTitle')}</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            {t('faq.notFoundText')}
                        </p>
                        <div className="flex items-center justify-center">
                            <a href={route('about.contacts')} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                {t('faq.contactsButton')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

FAQ.layout = (page) => <LayoutDirection img="aboutcenter" h1={t('faq.pageTitle')}>{page}</LayoutDirection>;
