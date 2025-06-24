import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FaLanguage, FaSync, FaDatabase, FaEdit, FaGlobe } from 'react-icons/fa';

export default function TranslationManager() {
    const [loading, setLoading] = useState(false);
    const [translationStats, setTranslationStats] = useState({
        ru: { count: 0, lastUpdated: null },
        kz: { count: 0, lastUpdated: null },
        en: { count: 0, lastUpdated: null },
    });
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        fetchTranslationStats();
    }, []);
    
    const fetchTranslationStats = async () => {
        try {
            const response = await fetch('/api/admin/translations/stats');
            const data = await response.json();
            
            if (data.success) {
                setTranslationStats(data.stats);
            }
        } catch (error) {
            console.error('Ошибка при получении статистики переводов:', error);
        }
    };
    
    const startTranslation = async () => {
        if (!confirm(`Вы точно хотите запустить перевод всего сайта на ${selectedLanguage}? Это может занять некоторое время.`)) {
            return;
        }
        
        setLoading(true);
        setStatus('Инициализация перевода...');
        setProgress(0);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            // Запрашиваем список всех URL сайта для перевода
            const urlsResponse = await fetch('/api/admin/translations/site-urls');
            const urlsData = await urlsResponse.json();
            
            if (!urlsData.success || !urlsData.urls || urlsData.urls.length === 0) {
                throw new Error('Не удалось получить список URL для перевода');
            }
            
            // Общее количество URL для расчета прогресса
            const totalUrls = urlsData.urls.length;
            let processedUrls = 0;
            
            // Проходим по каждому URL и запускаем перевод
            for (const url of urlsData.urls) {
                setStatus(`Перевод контента: ${url} (${processedUrls + 1}/${totalUrls})`);
                
                // Запрос контента страницы и перевод
                const translateResponse = await fetch('/api/admin/translations/translate-page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        url: url,
                        target_language: selectedLanguage
                    })
                });
                
                const translateData = await translateResponse.json();
                if (!translateData.success) {
                    console.warn(`Предупреждение при переводе ${url}:`, translateData.message);
                }
                
                // Обновляем прогресс
                processedUrls++;
                setProgress(Math.round((processedUrls / totalUrls) * 100));
            }
            
            // После завершения обновляем статистику
            await fetchTranslationStats();
            
            setStatus(`Перевод завершен! Переведено ${processedUrls} страниц на ${selectedLanguage}`);
        } catch (error) {
            console.error('Ошибка при переводе:', error);
            setStatus(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const clearTranslations = async (lang) => {
        if (!confirm(`Вы уверены, что хотите удалить все переводы для языка ${lang}?`)) {
            return;
        }
        
        try {
            setLoading(true);
            setStatus(`Удаление переводов для ${lang}...`);
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/api/admin/translations/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    language: lang
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setStatus(`Переводы для ${lang} удалены. Удалено ${data.deleted_count} записей.`);
                await fetchTranslationStats();
            } else {
                setStatus(`Ошибка при удалении переводов: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при удалении переводов:', error);
            setStatus(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AdminLayout>
            <Head title="Управление переводами сайта" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <FaGlobe className="mr-2 text-indigo-600" />
                                Управление переводами сайта
                            </h2>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-medium mb-3 flex items-center">
                                    <FaDatabase className="mr-2 text-indigo-500" />
                                    Статистика переводов в базе данных
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(translationStats).map(([lang, stats]) => (
                                        <div key={lang} className="bg-white p-4 rounded-md shadow border">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-gray-700">
                                                    {lang === 'ru' ? 'Русский' : lang === 'kz' ? 'Казахский' : 'Английский'}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs ${lang === 'ru' ? 'bg-red-100 text-red-800' : lang === 'kz' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                    {lang.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold mb-2">
                                                {stats.count} <span className="text-sm font-normal text-gray-500">переводов</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Последнее обновление: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Никогда'}
                                            </div>
                                            <div className="mt-3">
                                                <button 
                                                    onClick={() => clearTranslations(lang)}
                                                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                                    disabled={loading || stats.count === 0}
                                                >
                                                    Очистить
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-indigo-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium mb-4 flex items-center">
                                    <FaLanguage className="mr-2 text-indigo-600" />
                                    Запуск перевода сайта
                                </h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Выберите язык перевода:
                                    </label>
                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={() => setSelectedLanguage('ru')}
                                            className={`px-4 py-2 rounded-md flex items-center ${selectedLanguage === 'ru' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border'}`}
                                        >
                                            <span className="mr-1">🇷🇺</span> Русский
                                        </button>
                                        <button 
                                            onClick={() => setSelectedLanguage('kz')}
                                            className={`px-4 py-2 rounded-md flex items-center ${selectedLanguage === 'kz' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                                        >
                                            <span className="mr-1">🇰🇿</span> Казахский
                                        </button>
                                        <button 
                                            onClick={() => setSelectedLanguage('en')}
                                            className={`px-4 py-2 rounded-md flex items-center ${selectedLanguage === 'en' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
                                        >
                                            <span className="mr-1">🇬🇧</span> Английский
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <button
                                        onClick={startTranslation}
                                        disabled={loading}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <FaSync className="animate-spin mr-2" />
                                        ) : (
                                            <FaEdit className="mr-2" />
                                        )}
                                        {loading ? "Перевод в процессе..." : "Запустить перевод сайта"}
                                    </button>
                                </div>
                                
                                {loading && (
                                    <div className="mt-4">
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span>{status}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-indigo-600 h-2 rounded-full" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                
                                {!loading && status && (
                                    <div className={`mt-4 p-3 rounded ${status.includes('Ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
