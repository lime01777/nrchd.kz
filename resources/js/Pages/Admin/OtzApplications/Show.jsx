import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ application, stages }) {
  const getCategoryColor = (category) => {
    return category === 'Комплексная' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getStageColor = (stage) => {
    const stageColors = {
      'Подача заявки': 'text-blue-600',
      'Проверка документов': 'text-blue-600',
      'Проведение ОТЗ': 'text-blue-600',
      'Рассмотрение комиссиями': 'text-orange-600',
      'Бюджетное одобрение': 'text-orange-600',
      'Формирование тарифов': 'text-green-600'
    };
    return stageColors[stage] || 'text-gray-600';
  };

  const getStageStatus = (stage) => {
    const currentIndex = stages.indexOf(application.current_stage);
    const stageIndex = stages.indexOf(stage);
    
    if (stageIndex < currentIndex) {
      return 'completed'; // Завершен
    } else if (stageIndex === currentIndex) {
      return 'current'; // Текущий
    } else {
      return 'pending'; // Ожидает
    }
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="5" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <Head title={`Заявка ОТЗ: ${application.application_id}`} />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {/* Заголовок */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Заявка ОТЗ: {application.application_id}
                  </h2>
                  <p className="text-gray-600 mt-1">{application.title}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={route('admin.otz-applications.edit', application.id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Редактировать
                  </Link>
                  <Link
                    href={route('admin.otz-applications.index')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Назад к списку
                  </Link>
                </div>
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Прогресс этапов */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Прогресс по этапам</h3>
                    <div className="space-y-3">
                      {stages.map((stage, index) => {
                        const status = getStageStatus(stage);
                        return (
                          <div key={stage} className="flex items-center space-x-3">
                            {getStageIcon(status)}
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className={`text-sm font-medium ${
                                  status === 'completed' ? 'text-green-600' :
                                  status === 'current' ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  {stage}
                                </span>
                                {status === 'completed' && (
                                  <span className="text-xs text-green-600">Завершен</span>
                                )}
                                {status === 'current' && (
                                  <span className="text-xs text-blue-600">Текущий</span>
                                )}
                              </div>
                              {status === 'current' && (
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Описание проекта */}
                  {application.description && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Описание проекта</h3>
                      <p className="text-gray-700 leading-relaxed">{application.description}</p>
                    </div>
                  )}

                  {/* Документы по этапам */}
                  {application.stage_progress && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Документы по этапам</h3>
                      <div className="space-y-4">
                        {Object.entries(application.stage_progress).map(([stage, progress]) => (
                          <div key={stage} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-gray-800 mb-2">{stage}</h4>
                            {progress.documents && progress.documents.length > 0 ? (
                              <div className="space-y-2">
                                {progress.documents.map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-sm text-gray-700">{doc.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(doc.uploaded_at).toLocaleDateString('ru-RU')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Документы не загружены</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Боковая панель */}
                <div className="space-y-6">
                  {/* Статус и категория */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Информация о заявке</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Категория:</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(application.category)}`}>
                            {application.category}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Текущий этап:</span>
                        <div className="mt-1">
                          <span className={`text-sm font-medium ${getStageColor(application.current_stage)}`}>
                            {application.current_stage}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Статус:</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            application.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {application.is_active ? 'Активна' : 'Неактивна'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Контактная информация */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Контактная информация</h3>
                    <div className="space-y-3">
                      {application.responsible_person && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Ответственное лицо:</span>
                          <p className="text-sm text-gray-900 mt-1">{application.responsible_person}</p>
                        </div>
                      )}
                      {application.phone && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Телефон:</span>
                          <p className="text-sm text-gray-900 mt-1">{application.phone}</p>
                        </div>
                      )}
                      {application.email && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Email:</span>
                          <p className="text-sm text-gray-900 mt-1">{application.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Сроки этапа */}
                  {(application.stage_start_date || application.stage_end_date) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Сроки текущего этапа</h3>
                      <div className="space-y-3">
                        {application.stage_start_date && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Дата начала:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {new Date(application.stage_start_date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        )}
                        {application.stage_end_date && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Дата окончания:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {new Date(application.stage_end_date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Метаданные */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Метаданные</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Дата создания:</span>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(application.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Последнее обновление:</span>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(application.updated_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
