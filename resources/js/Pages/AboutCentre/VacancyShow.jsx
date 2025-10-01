import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function VacancyShow({ vacancy }) {
    const { locale } = usePage().props;
    
    // Используем useForm от Inertia для правильной обработки файлов и CSRF
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        resume: null,
        cover_letter: '',
    });

    // Преобразуем дату в формат ДД месяца ГГГГ года
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year} года`;
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Отправка через Inertia с поддержкой файлов
        post(route('vacancy.apply', vacancy.slug), {
            forceFormData: true, // Принудительно использовать FormData для файлов
            preserveScroll: true,
            onSuccess: () => {
                reset(); // Очищаем форму после успешной отправки
            },
        });
    };

    // Функция для отображения содержимого в Editor.js формате
    const renderEditorContent = (content) => {
        // Проверяем, является ли content массивом (новый формат)
        const blocks = Array.isArray(content) ? content : (content?.blocks || []);
        
        if (!blocks || !blocks.length) return <p>Информация отсутствует</p>;
        
        return blocks.map((block, index) => {
            switch (block.type) {
                case 'header':
                    const HeaderTag = `h${block.data.level}`;
                    return <HeaderTag key={index} className="text-gray-900 font-semibold my-3">{block.data.text}</HeaderTag>;
                
                case 'paragraph':
                    return <p key={index} className="my-2 text-gray-700">{block.data.text}</p>;
                
                case 'list':
                    if (block.data.style === 'unordered') {
                        return (
                            <ul key={index} className="list-disc ml-6 my-3">
                                {block.data.items.map((item, i) => (
                                    <li key={i} className="text-gray-700 my-1">{item}</li>
                                ))}
                            </ul>
                        );
                    } else {
                        return (
                            <ol key={index} className="list-decimal ml-6 my-3">
                                {block.data.items.map((item, i) => (
                                    <li key={i} className="text-gray-700 my-1">{item}</li>
                                ))}
                            </ol>
                        );
                    }
                default:
                    return <div key={index}>{block.data.text || JSON.stringify(block.data)}</div>;
            }
        });
    };

    return (
        <>
            <Head title={vacancy.title} />
            
            {/* Основной контент */}
            <div className="bg-pink-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        href={route('vacancy.jobs')} 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Вакансии
                    </Link>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{vacancy.title}</h1>
                    <div className="text-sm text-gray-600 mb-4">
                        {vacancy.published_at && formatDate(vacancy.published_at)}
                    </div>
                    
                    {vacancy.excerpt && (
                        <div className="text-lg text-gray-800 mb-6">
                            {vacancy.excerpt}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Основная информация */}
                    <div className="lg:col-span-2">
                        {/* Департамент */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl mb-2">Департамент</h2>
                            <p>{vacancy.department}</p>
                        </div>
                        
                        {/* Место работы */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl mb-2">Место работы</h2>
                            <p>{vacancy.city}</p>
                        </div>
                        
                        {/* Тип занятости */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl mb-2">Тип занятости</h2>
                            <p>{vacancy.employment_type}</p>
                        </div>
                        
                        {/* Содержание вакансии */}
                        <div className="vacancy-content">
                            {vacancy.body && renderEditorContent(vacancy.body)}
                        </div>
                    </div>
                    
                    {/* Форма отклика */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="font-semibold text-xl mb-4">Откликнуться на вакансию</h2>
                        
                        {usePage().props.flash && usePage().props.flash.success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {usePage().props.flash.success}
                            </div>
                        )}
                        
                        {usePage().props.flash && usePage().props.flash.error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {usePage().props.flash.error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ваше имя *
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="Введите ваше имя"
                                    required
                                    disabled={processing}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Электронная почта *
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="example@email.com"
                                    required
                                    disabled={processing}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Телефон *
                                </label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="+7 (xxx) xxx-xx-xx"
                                    required
                                    disabled={processing}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Резюме (PDF, DOC, DOCX) *
                                </label>
                                
                                {/* Скрытый input для файла */}
                                <input 
                                    type="file" 
                                    name="resume"
                                    id="resume-file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    required
                                    disabled={processing}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('resume', e.target.files[0]);
                                        }
                                    }}
                                />
                                
                                {/* Стилизованная кнопка с иконкой скрепки */}
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="resume-file" className={`
                                        cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md
                                        bg-yellow-100 hover:bg-yellow-200 text-green-700 border border-yellow-300
                                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500
                                        ${errors.resume ? 'border-red-500 bg-red-50' : ''}
                                        ${processing ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}>
                                        {/* Иконка скрепки (paper clip) */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span>Прикрепить резюме</span>
                                    </label>
                                    
                                    {/* Отображение имени выбранного файла */}
                                    {data.resume && (
                                        <span className="text-sm text-green-600 truncate max-w-xs">
                                            ✓ {data.resume.name}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-1">Максимальный размер файла: 5MB</p>
                                {errors.resume && (
                                    <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Сопроводительное письмо
                                </label>
                                <textarea 
                                    name="cover_letter"
                                    value={data.cover_letter}
                                    onChange={(e) => setData('cover_letter', e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors.cover_letter ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    rows="4"
                                    placeholder="Расскажите немного о себе и почему вы хотите работать с нами"
                                    disabled={processing}
                                ></textarea>
                                {errors.cover_letter && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cover_letter}</p>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? 'Отправка...' : 'Отправить заявку'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

VacancyShow.layout = page => <LayoutFolderChlank bgColor="bg-white" h1="Вакансия" children={page} useVideo={true}/>;
