import React from 'react';

const OtzApplicationModal = ({ application, stages, onClose }) => {

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
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStageBackground = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'current':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-white border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Статус заявки: {application.application_id} — {application.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Прогресс этапов */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            {stages.map((stage, index) => (
              <div key={stage} className="flex flex-col items-center flex-1">
                <div className={`w-full h-2 ${index < stages.length - 1 ? 'border-r-2 border-gray-200' : ''}`}>
                  <div className={`h-full ${getStageStatus(stage) === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`mt-2 p-2 rounded-lg border ${getStageBackground(getStageStatus(stage))}`}>
                  {getStageIcon(getStageStatus(stage))}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Информация о текущем этапе */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-800">
                {application.current_stage} (текущий этап)
              </h3>
            </div>

            {/* Сроки этапа */}
            {application.stage_start_date && application.stage_end_date && (
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  Сроки этапа: {new Date(application.stage_start_date).toLocaleDateString('ru-RU')} – {new Date(application.stage_end_date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}

            {/* Ответственное лицо */}
            {application.responsible_person && (
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  Ответственное лицо: {application.responsible_person}
                </span>
              </div>
            )}

            {/* Контактная информация */}
            <div className="flex items-center space-x-4 mb-3">
              {application.phone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm text-gray-700">{application.phone}</span>
                </div>
              )}
              {application.email && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm text-gray-700">{application.email}</span>
                </div>
              )}
            </div>

            {/* Документы по этапу */}
            {application.stage_documents && application.stage_documents.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Документы по этапу:</span>
                </div>
                <div className="space-y-1">
                  {application.stage_documents.map((doc, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {doc.name} от {new Date(doc.date).toLocaleDateString('ru-RU')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Описание проекта */}
        {application.description && (
          <div className="px-6 pb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Описание проекта:</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {application.description}
            </p>
          </div>
        )}

        {/* Кнопка закрытия */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtzApplicationModal;
