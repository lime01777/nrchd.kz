import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';

const TranslationManager = ({ languages, currentTranslationFile }) => {
    const [activeFile, setActiveFile] = useState(currentTranslationFile || 'common.php');
    const [availableFiles, setAvailableFiles] = useState(['common.php']);
    const [translations, setTranslations] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState('ru');
    
    // Загрузка списка доступных файлов локализации
    useEffect(() => {
        axios.get('/api/translations/files')
            .then(response => {
                if (response.data.success) {
                    setAvailableFiles(response.data.files);
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке списка файлов:', error);
                toast.error('Не удалось загрузить список файлов локализации');
            });
    }, []);
    
    // Загрузка переводов при изменении активного файла
    useEffect(() => {
        loadTranslations(activeFile);
    }, [activeFile]);
    
    const loadTranslations = (file) => {
        setIsLoading(true);
        axios.get(`/api/translations/${file}`)
            .then(response => {
                if (response.data.success) {
                    setTranslations(response.data.translations);
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке переводов:', error);
                toast.error('Не удалось загрузить переводы');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    
    const handleTranslationChange = (lang, key, value) => {
        const updatedTranslations = {...translations};
        if (!updatedTranslations[lang]) {
            updatedTranslations[lang] = {};
        }
        updatedTranslations[lang][key] = value;
        setTranslations(updatedTranslations);
    };
    
    const saveTranslations = () => {
        setIsLoading(true);
        axios.post('/api/translations/save', {
            file: activeFile,
            translations: translations
        })
            .then(response => {
                if (response.data.success) {
                    toast.success('Переводы успешно сохранены');
                } else {
                    toast.error('Ошибка при сохранении переводов');
                }
            })
            .catch(error => {
                console.error('Ошибка при сохранении переводов:', error);
                toast.error('Не удалось сохранить переводы');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    
    const refreshTranslations = () => {
        if (window.confirm('Вы уверены, что хотите обновить переводы? Это перезапишет все текущие переводы для выбранного файла.')) {
            setIsLoading(true);
            axios.post('/api/translations/refresh', {
                file: activeFile,
                source: sourceLanguage
            })
                .then(response => {
                    if (response.data.success) {
                        toast.success('Переводы успешно обновлены');
                        loadTranslations(activeFile);
                    } else {
                        toast.error('Ошибка при обновлении переводов');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при обновлении переводов:', error);
                    toast.error('Не удалось обновить переводы');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    
    // Фильтрация ключей по поисковому запросу
    const filteredKeys = Object.keys(translations.ru || {}).filter(key => {
        return key.toLowerCase().includes(searchTerm.toLowerCase()) || 
               (translations.ru[key] && translations.ru[key].toLowerCase().includes(searchTerm.toLowerCase()));
    });
    
    return (
        <AdminLayout>
            <Head title="Управление переводами" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-6">Управление переводами</h1>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Файл</label>
                                    <select 
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={activeFile}
                                        onChange={(e) => setActiveFile(e.target.value)}
                                    >
                                        {availableFiles.map(file => (
                                            <option key={file} value={file}>{file}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Исходный язык</label>
                                    <select 
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={sourceLanguage}
                                        onChange={(e) => setSourceLanguage(e.target.value)}
                                    >
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex items-end">
                                    <button 
                                        onClick={refreshTranslations}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Загрузка...' : 'Обновить переводы'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Поиск по ключам и значениям..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => setEditMode(!editMode)} 
                                        className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                                    >
                                        {editMode ? 'Режим просмотра' : 'Режим редактирования'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-lg font-medium text-gray-700">Загрузка...</span>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ключ
                                                </th>
                                                {languages.map(lang => (
                                                    <th key={lang} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        {lang.toUpperCase()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredKeys.length > 0 ? (
                                                filteredKeys.map(key => (
                                                    <tr key={key} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {key}
                                                        </td>
                                                        
                                                        {languages.map(lang => (
                                                            <td key={`${lang}-${key}`} className="px-6 py-4 text-sm text-gray-500">
                                                                {editMode ? (
                                                                    <input
                                                                        type="text"
                                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        value={(translations[lang] && translations[lang][key]) || ''}
                                                                        onChange={(e) => handleTranslationChange(lang, key, e.target.value)}
                                                                    />
                                                                ) : (
                                                                    <div className="whitespace-pre-wrap">
                                                                        {(translations[lang] && translations[lang][key]) || ''}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={languages.length + 1} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {searchTerm ? 'Ничего не найдено' : 'Нет доступных переводов'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {editMode && (
                                    <div className="mt-6 flex justify-end">
                                        <button 
                                            onClick={saveTranslations}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TranslationManager;
