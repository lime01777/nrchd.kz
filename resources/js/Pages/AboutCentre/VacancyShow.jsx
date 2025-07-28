import React, { useState, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';

export default function VacancyShow({ vacancy }) {
    // Состояние для хранения имени выбранного файла резюме
    const [selectedFile, setSelectedFile] = useState("");
    const { locale } = usePage().props;

    // Преобразуем дату в формат ДД месяца ГГГГ года
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year} года`;
    };

    // Функция для отображения содержимого в Editor.js формате
    const renderEditorContent = (content) => {
        if (!content || !Array.isArray(content.blocks)) return null;
        
        return content.blocks.map((block, index) => {
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
                    return <div key={index}>{block.data.text}</div>;
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
                        
                        <form action={route('vacancy.apply', vacancy.slug)} method="POST" encType="multipart/form-data">
                            <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ваше имя *
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className={`w-full px-3 py-2 border ${usePage().props.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="Введите ваше имя"
                                    required
                                />
                                {usePage().props.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{usePage().props.errors.name}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Электронная почта *
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className={`w-full px-3 py-2 border ${usePage().props.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="example@email.com"
                                    required
                                />
                                {usePage().props.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{usePage().props.errors.email}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Телефон *
                                </label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    className={`w-full px-3 py-2 border ${usePage().props.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="+7 (xxx) xxx-xx-xx"
                                    required
                                />
                                {usePage().props.errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{usePage().props.errors.phone}</p>
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
                                    onChange={(e) => {
                                        // Показать имя выбранного файла
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0].name);
                                        } else {
                                            setSelectedFile("");
                                        }
                                    }}
                                />
                                
                                {/* Стилизованная кнопка с иконкой скрепки */}
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="resume-file" className={`
                                        cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md
                                        bg-yellow-100 hover:bg-yellow-200 text-green-700 border border-yellow-300
                                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500
                                        ${usePage().props.errors.resume ? 'border-red-500 bg-red-50' : ''}
                                    `}>
                                        {/* Иконка скрепки (paper clip) */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span>Прикрепить резюме</span>
                                    </label>
                                    
                                    {/* Отображение имени выбранного файла */}
                                    {selectedFile && (
                                        <span className="text-sm text-gray-600 truncate max-w-xs">{selectedFile}</span>
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-1">Максимальный размер файла: 5MB</p>
                                {usePage().props.errors.resume && (
                                    <p className="text-red-500 text-sm mt-1">{usePage().props.errors.resume}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Сопроводительное письмо
                                </label>
                                <textarea 
                                    name="cover_letter"
                                    className={`w-full px-3 py-2 border ${usePage().props.errors.cover_letter ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    rows="4"
                                    placeholder="Расскажите немного о себе и почему вы хотите работать с нами"
                                ></textarea>
                                {usePage().props.errors.cover_letter && (
                                    <p className="text-red-500 text-sm mt-1">{usePage().props.errors.cover_letter}</p>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                                Отправить заявку
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

VacancyShow.layout = page => <LayoutFolderChlank bgColor="bg-white" h1="Вакансия" children={page} useVideo={true}/>;
