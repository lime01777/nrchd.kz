import { Head, usePage, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function Contacts() {
    const { flash } = usePage().props;

    // State для формы
    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'general',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('contact.submit'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 5000);
            },
        });
    };

    return (
        <>
            <Head title={t('contacts.pageTitle')} />
            <section className="text-gray-600 body-font relative">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-col text-left w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('contacts.pageTitle')}</h1>
                        <p className="lg:w-2/3 leading-relaxed text-base">
                            {t('contacts.description')}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap -mx-4">
                        <div className="p-4 md:w-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('contacts.addressSection')}</h2>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">{t('contacts.address')}</h3>
                                    <p className="text-gray-600">{t('contacts.addressText')}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">{t('contacts.phones')}</h3>
                                    <p className="text-gray-600">{t('contacts.phoneText')}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">{t('contacts.email')}</h3>
                                    <p className="text-gray-600">{t('contacts.emailText')}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-700 font-medium">{t('contacts.schedule')}</h3>
                                    <p className="text-gray-600">{t('contacts.scheduleText')}</p>
                                    <p className="text-gray-600">{t('contacts.lunchText')}</p>
                                    <p className="text-gray-600">{t('contacts.weekendText')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 md:w-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('contacts.feedbackSection')}</h2>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">{t('contacts.pressService')}</h3>
                                    <p className="text-gray-600">{t('contacts.pressPhone')}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-medium">{t('contacts.cooperation')}</h3>
                                    <p className="text-gray-600">{t('contacts.cooperationPhone')}</p>
                                    <p className="text-gray-600">{t('contacts.cooperationEmail')}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-700 font-medium">{t('contacts.resume')}</h3>
                                    <p className="text-gray-600">{t('contacts.resumeEmail')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap mt-8">
                        <div className="w-full">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('contacts.mapTitle')}</h2>
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
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('contacts.formTitle')}</h2>
                                
                                {/* Сообщения об успехе/ошибке */}
                                {isSubmitted && (
                                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                                        {t('contacts.formSuccess')}
                                    </div>
                                )}
                                {flash?.error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                                        {flash.error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('contacts.name')}</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border ${errors.name ? 'border-red-500' : ''}`}
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border ${errors.email ? 'border-red-500' : ''}`}
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('contacts.phone')}</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border ${errors.phone ? 'border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{t('contacts.subject')}</label>
                                        <input 
                                            type="text" 
                                            id="subject" 
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('contacts.message')}</label>
                                        <textarea 
                                            id="message" 
                                            rows="4" 
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border ${errors.message ? 'border-red-500' : ''}`}
                                            required
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                    </div>
                                    <div>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? t('contacts.sending') : t('contacts.sendButton')}
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

Contacts.layout = (page) => <LayoutDirection img="contact" h1={t('contacts.pageTitle')}>{page}</LayoutDirection>;
