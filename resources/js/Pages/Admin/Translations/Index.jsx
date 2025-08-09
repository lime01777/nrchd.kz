import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function TranslationsIndex({ stats, languages, recentTranslations }) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(null);

  // Форма для массового перевода
  const { data, setData, post, processing } = useForm({
    target_language: 'en'
  });

  // Запуск массового перевода
  const handleTranslateAll = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    setTranslationProgress({ message: 'Начинаем массовый перевод...', progress: 0 });

    try {
      const response = await fetch(route('admin.translations.translate-all'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          target_language: data.target_language
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTranslationProgress({
          message: 'Перевод завершен!',
          progress: 100,
          stats: result.stats
        });
        
        // Перезагружаем страницу через 3 секунды для обновления статистики
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setTranslationProgress({
          message: 'Ошибка: ' + result.message,
          progress: 0,
          error: true
        });
      }
    } catch (error) {
      console.error('Ошибка перевода:', error);
      setTranslationProgress({
        message: 'Произошла ошибка при переводе',
        progress: 0,
        error: true
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-bold mb-6">Управление переводами</h1>

              {/* Статистика переводов */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(stats).map(([language, stat]) => (
                  <div key={language} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Язык: {language === 'en' ? 'English' : 'Қазақша'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Всего переводов:</span>
                        <span className="font-semibold">{stat.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Проверенных:</span>
                        <span className="font-semibold text-green-600">{stat.verified}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Процент проверенных:</span>
                        <span className="font-semibold">
                          {stat.total > 0 ? Math.round((stat.verified / stat.total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Панель массового перевода */}
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Массовый перевод контента</h2>
                <p className="text-gray-600 mb-4">
                  Эта функция просканирует весь контент сайта и переведет новые тексты, 
                  которые еще не переведены.
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Целевой язык:
                  </label>
                  <select
                    value={data.target_language}
                    onChange={(e) => setData('target_language', e.target.value)}
                    className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isTranslating}
                  >
                    <option value="en">English</option>
                    <option value="kz">Қазақша</option>
                  </select>
                </div>

                <button
                  onClick={handleTranslateAll}
                  disabled={isTranslating}
                  className={`px-6 py-3 rounded-md font-medium ${
                    isTranslating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isTranslating ? 'Переводим...' : 'Запустить массовый перевод'}
                </button>

                {/* Прогресс перевода */}
                {translationProgress && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <div className={`text-sm ${translationProgress.error ? 'text-red-600' : 'text-blue-600'}`}>
                      {translationProgress.message}
                    </div>
                    
                    {translationProgress.progress > 0 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${translationProgress.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {translationProgress.stats && (
                      <div className="mt-3 text-sm text-gray-600">
                        <div>Всего найдено текстов: {translationProgress.stats.total_found}</div>
                        <div>Уже переведено: {translationProgress.stats.already_translated}</div>
                        <div>Новых переводов: {translationProgress.stats.newly_translated}</div>
                        {translationProgress.stats.errors > 0 && (
                          <div className="text-red-600">Ошибок: {translationProgress.stats.errors}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Последние переводы */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Последние переводы</h2>
                
                {Object.entries(recentTranslations).map(([language, translations]) => (
                  <div key={language} className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      {language === 'en' ? 'English' : 'Қазақша'} 
                      <span className="text-gray-500 text-sm ml-2">({translations.length} переводов)</span>
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                      {translations.slice(0, 10).map((translation) => (
                        <div key={translation.id} className="p-3 border-b border-gray-200 last:border-b-0">
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>Оригинал:</strong> {translation.original_text.substring(0, 100)}
                            {translation.original_text.length > 100 && '...'}
                          </div>
                          <div className="text-sm text-gray-800">
                            <strong>Перевод:</strong> {translation.translated_text.substring(0, 100)}
                            {translation.translated_text.length > 100 && '...'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(translation.created_at).toLocaleString('ru-RU')}
                            {translation.is_verified && (
                              <span className="ml-2 text-green-600">✓ Проверено</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Инструкции */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Как это работает:</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Система сканирует весь контент сайта (новости, категории, статические тексты)</li>
                  <li>Проверяет, какие тексты уже переведены</li>
                  <li>Новые тексты автоматически переводятся через Google Translate</li>
                  <li>Все переводы сохраняются в базе данных для быстрого доступа</li>
                  <li>При переключении языка переводы загружаются мгновенно из БД</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}