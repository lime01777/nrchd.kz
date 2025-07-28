import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function VacancyEdit({ vacancy }) {
    // Преобразуем существующий контент из Editor.js формата в текст для textarea
    const convertBodyToText = (body) => {
        if (!body || !Array.isArray(body)) return '';
        
        return body.map(block => {
            if (block.type === 'paragraph' && block.data && block.data.text) {
                return block.data.text;
            }
            return '';
        }).join('\n\n');
    };
    
    // Состояние для управления формой
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Храним текст из textarea в отдельном состоянии
    const [bodyText, setBodyText] = useState(convertBodyToText(vacancy.body) || '');
    
    // Инициализация формы с useForm и существующими данными
    const { data, setData, put, processing, errors } = useForm({
        title: vacancy.title || '',
        slug: vacancy.slug || '',
        excerpt: vacancy.excerpt || '',
        body: Array.isArray(vacancy.body) ? vacancy.body : [], // Сохраняем как массив для валидатора
        city: vacancy.city || '',
        department: vacancy.department || '',
        employment_type: vacancy.employment_type || '',
        status: vacancy.status || 'draft',
        published_at: vacancy.published_at ? new Date(vacancy.published_at).toISOString().substr(0, 10) : ''
    });
    
    // Обновляем массив body при изменении текста
    const updateBodyFromText = (text) => {
        const paragraphs = text.split('\n').filter(p => p.trim() !== '');
        const bodyContent = paragraphs.map(paragraph => ({
            type: "paragraph",
            data: {
                text: paragraph.trim()
            }
        }));
        
        setData('body', bodyContent);
        setBodyText(text);
    };
    
    // При создании вакансии из черновика в опубликованную, устанавливаем дату публикации
    useEffect(() => {
        if (data.status === 'published' && !data.published_at) {
            setData('published_at', new Date().toISOString().substr(0, 10));
        }
    }, [data.status]);
    
    // Состояние для хранения содержимого редактора в формате HTML
    const [editorContent, setEditorContent] = useState('');
    
    // При загрузке компонента преобразуем Editor.js формат в HTML для ReactQuill
    useEffect(() => {
        if (vacancy.body && vacancy.body.blocks) {
            // Простая конвертация из Editor.js в HTML для демонстрации
            // В реальном приложении здесь должна быть более сложная логика
            const htmlContent = vacancy.body.blocks.map(block => {
                if (block.type === 'paragraph') {
                    return `<p>${block.data.text}</p>`;
                } else if (block.type === 'header') {
                    return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                } else if (block.type === 'list') {
                    const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                    const items = block.data.items.map(item => `<li>${item}</li>`).join('');
                    return `<${listType}>${items}</${listType}>`;
                }
                return '';
            }).join('');
            
            setEditorContent(htmlContent);
        }
    }, [vacancy]);
    // Типы занятости для выбора
    const employmentTypes = [
        'Полная занятость',
        'Частичная занятость',
        'Проектная работа',
        'Стажировка',
        'Удаленная работа'
    ];
    
    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Проверка, что body уже является массивом
            if (data.body.length === 0 && bodyText.trim() !== '') {
                // Если массив пуст, но есть текст, обновим массив
                updateBodyFromText(bodyText);
            }
            
            // Если статус опубликовано и нет даты публикации, устанавливаем текущую дату
            const publishedAt = (data.status === 'published' && !data.published_at) 
                ? new Date().toISOString().substr(0, 10) 
                : data.published_at;
            
            // Отправляем форму с обновленными данными
            put(route('vacancies.update', vacancy.id), {
                ...data,
                published_at: publishedAt
            });
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Редактирование вакансии" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6 flex justify-between">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Редактирование вакансии: {vacancy.title}
                                </h1>
                                <Link
                                    href={route('vacancies.index')}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Назад к списку
                                </Link>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                {/* Название вакансии */}
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Название *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>
                                
                                {/* URL slug */}
                                <div className="mb-4">
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                        URL slug (опционально)
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                        placeholder="Оставьте пустым для автоматической генерации"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Если оставить пустым, slug будет сгенерирован автоматически из названия</p>
                                    {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                                </div>
                                
                                {/* Краткое описание */}
                                <div className="mb-4">
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                                        Краткое описание
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        rows="3"
                                        value={data.excerpt}
                                        onChange={e => setData('excerpt', e.target.value)}
                                    ></textarea>
                                    {errors.excerpt && <div className="text-red-500 text-sm mt-1">{errors.excerpt}</div>}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Город */}
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            Город *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                            required
                                        />
                                        {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}
                                    </div>
                                    
                                    {/* Департамент */}
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                            Департамент *
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                            value={data.department}
                                            onChange={e => setData('department', e.target.value)}
                                            required
                                        />
                                        {errors.department && <div className="text-red-500 text-sm mt-1">{errors.department}</div>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Тип занятости */}
                                    <div>
                                        <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Тип занятости *
                                        </label>
                                        <select
                                            id="employment_type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                            value={data.employment_type}
                                            onChange={e => setData('employment_type', e.target.value)}
                                            required
                                        >
                                            <option value="">Выберите тип занятости</option>
                                            {employmentTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.employment_type && <div className="text-red-500 text-sm mt-1">{errors.employment_type}</div>}
                                    </div>
                                    
                                    {/* Статус публикации */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Статус *
                                        </label>
                                        <select
                                            id="status"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            required
                                        >
                                            <option value="draft">Черновик</option>
                                            <option value="published">Опубликовано</option>
                                        </select>
                                        {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                                    </div>
                                </div>
                                
                                {/* Дата публикации - показывается только если статус "Опубликовано" */}
                                {data.status === 'published' && (
                                    <div className="mb-4">
                                        <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
                                            Дата публикации
                                        </label>
                                        <input
                                            type="date"
                                            id="published_at"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                            value={data.published_at}
                                            onChange={e => setData('published_at', e.target.value)}
                                        />
                                        {errors.published_at && <div className="text-red-500 text-sm mt-1">{errors.published_at}</div>}
                                    </div>
                                )}
                                
                                {/* Содержание вакансии - ReactQuill */}
                                <div className="mb-4">
                                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                                        Описание вакансии *
                                    </label>
                                    <textarea
                                        id="body"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        value={bodyText}
                                        rows="10"
                                        onChange={e => updateBodyFromText(e.target.value)}
                                        placeholder="Введите описание вакансии. Каждый абзац будет отображаться отдельно."
                                        required
                                    ></textarea>
                                    {errors.body && <div className="text-red-500 text-sm mt-1">{errors.body}</div>}
                                </div>
                                
                                {/* Кнопки действий */}
                                <div className="mt-6 flex items-center justify-end">
                                    <button
                                        type="button"
                                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        onClick={() => window.history.back()}
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={processing}
                                    >
                                        {processing ? 'Сохранение...' : 'Сохранить изменения'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

VacancyEdit.layout = page => <AdminLayout title="Редактирование вакансии">{page}</AdminLayout>;
