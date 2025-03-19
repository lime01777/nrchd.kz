import React, { useState, useEffect } from 'react';
import GoogleDriveApiService from '@/Services/GoogleDriveApiService';

/**
 * Компонент для отображения документов из Google Drive через серверный API
 * @param {Object} props
 * @param {string} props.folderId - ID папки Google Drive для отображения документов
 * @param {string} props.title - Заголовок блока с документами (опционально)
 * @param {string} props.className - Дополнительные классы для контейнера (опционально)
 * @param {boolean} props.collapsible - Можно ли сворачивать/разворачивать блок (опционально)
 */
export default function GoogleDriveFiles({ 
  folderId, 
  title, 
  className = '',
  collapsible = false
}) {
  // Состояние для хранения списка документов
  const [documents, setDocuments] = useState([]);
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для отслеживания ошибок
  const [error, setError] = useState(null);
  // Состояние для отслеживания свернутого/развернутого состояния
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Функция для определения иконки файла на основе его типа
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (mimeType.includes('spreadsheet')) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
        </svg>
      );
    } else if (mimeType.includes('document')) {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else if (mimeType.includes('presentation')) {
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  // Функция для форматирования размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const bytes_num = parseInt(bytes, 10);
    if (bytes_num === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes_num) / Math.log(k));
    return parseFloat((bytes_num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Функция для получения типа файла на основе MIME-типа
  const getFileType = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return 'PDF';
    } else if (mimeType.includes('spreadsheet')) {
      return 'XLS';
    } else if (mimeType.includes('document')) {
      return 'DOC';
    } else if (mimeType.includes('presentation')) {
      return 'PPT';
    } else {
      return 'Файл';
    }
  };

  // Загрузка документов из Google Drive
  useEffect(() => {
    if (!folderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Используем моковые данные, если folderId начинается с 'mock_'
    if (folderId.startsWith('mock_')) {
      // Моковые данные
      const mockDocuments = [
        {
          id: '1',
          name: 'МР по оформлению и утверждению НИР',
          mimeType: 'application/pdf',
          size: '1.4 MB',
          modifiedTime: '2024-03-27T10:30:00.000Z',
          webViewLink: '#'
        },
        {
          id: '2',
          name: 'О проведении НМЭ',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '4.7 MB',
          modifiedTime: '2024-03-27T11:45:00.000Z',
          webViewLink: '#'
        },
        {
          id: '3',
          name: 'Приказ о научно-медицинской экспертизе',
          mimeType: 'application/pdf',
          size: '2.3 MB',
          modifiedTime: '2024-03-27T09:15:00.000Z',
          webViewLink: '#'
        },
        {
          id: '4',
          name: 'Приказ о рабочем органе',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '5.4 MB',
          modifiedTime: '2024-03-27T14:20:00.000Z',
          webViewLink: '#'
        }
      ];

      // Имитация загрузки данных
      setTimeout(() => {
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
      return;
    }

    // Загружаем документы через API
    GoogleDriveApiService.getFiles(folderId)
      .then(files => {
        setDocuments(files);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load files from Google Drive:', err);
        setError('Не удалось загрузить файлы из Google Drive');
        setLoading(false);
      });
  }, [folderId]);

  // Функция для открытия документа
  const openDocument = (document) => {
    window.open(document.webViewLink || GoogleDriveApiService.getFileViewUrl(document.id), '_blank');
  };

  // Функция для переключения свернутого/развернутого состояния
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {collapsible && (
            <button onClick={toggleCollapse} className="focus:outline-none">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                {isCollapsed ? (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {!isCollapsed && (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Ошибка при загрузке документов: {error}</p>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">{doc.name}</h3>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center">
                        {getFileIcon(doc.mimeType)}
                        <span className="text-xs ml-1 mr-2">
                          {getFileType(doc.mimeType)}, 
                          {typeof doc.size === 'string' ? doc.size : formatFileSize(doc.size)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(doc.modifiedTime)}</span>
                    </div>
                    <button 
                      onClick={() => openDocument(doc)}
                      className="mt-2 text-gray-700 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      Открыть
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
