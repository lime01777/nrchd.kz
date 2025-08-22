import React from 'react';

const OtzApplicationCard = ({ application, onClick }) => {
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

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
      onClick={onClick}
    >
      {/* Заголовок с ID */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-blue-600 font-semibold text-sm">
          {application.application_id}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(application.category)}`}>
          {application.category}
        </span>
      </div>

      {/* Название проекта */}
      <h3 className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2">
        {application.title}
      </h3>

      {/* Текущий этап */}
      <div className="mb-3">
        <span className={`text-sm font-medium ${getStageColor(application.current_stage)}`}>
          Этап: {application.current_stage}
        </span>
      </div>

      {/* Дополнительная информация */}
      <div className="text-xs text-gray-500 space-y-1">
        {application.responsible_person && (
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {application.responsible_person}
          </div>
        )}
        
        {application.stage_start_date && application.stage_end_date && (
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(application.stage_start_date).toLocaleDateString('ru-RU')} - {new Date(application.stage_end_date).toLocaleDateString('ru-RU')}
          </div>
        )}
      </div>

      {/* Индикатор кликабельности */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Нажмите для подробностей</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OtzApplicationCard;
