import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TabDocuments = ({ tabs = [], defaultTab = 0, folder = '', api = false }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(tabs);
  const [showModal, setShowModal] = useState(false);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  // Загрузка данных из API, если указано
  useEffect(() => {
    const fetchData = async () => {
      if (!api || !folder) {
        setDocumentData(tabs);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching documents from API, folder:', folder);
        
        // Создаем URL с параметрами
        const params = new URLSearchParams();
        const normalizedFolder = folder.replace(/\\/g, '/');
        params.append('folder', normalizedFolder);
        
        // Используем обычный /api/files для получения документов, если TabDocuments API не работает
        const response = await axios.get(`/api/files?${params.toString()}`);
        console.log('API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Преобразуем файлы в формат TabDocuments
          // Группируем документы по годам из имени файла (примерно как 2023_документ.pdf)
          const years = {};
          
          response.data.filter(item => !item.isDirectory).forEach(doc => {
            // Пытаемся извлечь год из имени файла или используем текущий
            let year = new Date().getFullYear().toString();
            
            // Ищем год в формате "2023" в начале имени файла
            const yearMatch = doc.name && doc.name.match(/^(\d{4})/);
            if (yearMatch) {
              year = yearMatch[1];
            }
            
            // Создаем год, если его еще нет
            if (!years[year]) {
              years[year] = {
                year: `${year} год`,
                documents: []
              };
            }
            
            // Добавляем документ в соответствующий год
            years[year].documents.push({
              title: formatFileName(doc.name),
              fileType: getFileExtension(doc.name),
              url: `/storage/documents/${folder}/${doc.name}`
            });
          });
          
          // Преобразуем объект years в массив и сортируем по годам в обратном порядке
          const yearsArray = Object.values(years).sort((a, b) => {
            const yearA = parseInt(a.year);
            const yearB = parseInt(b.year);
            return yearB - yearA;
          });
          
          // Создаем вкладку с документами
          const tabData = [
            {
              title: "Документы",
              years: yearsArray
            }
          ];
          
          setDocumentData(tabData);
        } else {
          console.error('Invalid API response format:', response.data);
          setError('Получен неверный формат данных от сервера');
        }
      } catch (err) {
        console.error('Error fetching documents from API:', err);
        setError('Не удалось загрузить документы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [api, folder, tabs]); // Добавляем зависимости, которые должны вызывать повторную загрузку

  // Форматирование имени файла (удаление расширения и года в начале)
  const formatFileName = (filename) => {
    if (!filename) return '';
    
    // Удаляем год в начале файла (если есть)
    let name = filename.replace(/^\d{4}_/, '');
    
    // Удаляем расширение
    const parts = name.split('.');
    if (parts.length > 1) {
      parts.pop();
      return parts.join('.');
    }
    return name;
  };
  
  // Получение расширения файла
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      return dateString;
    }
  };

  // Получение информации о файле через HEAD запрос
  const fetchFileInfo = async (url) => {
    try {
      // Исправляем формирование URL - убираем дублирование путей
      let cleanUrl = url;
      
      // Если URL содержит полный путь к диску, извлекаем только относительную часть
      if (url.includes('C:/xampp/htdocs/public/storage/documents/') || url.includes('C:\\xampp\\htdocs\\public\\storage\\documents\\')) {
        const parts = url.split('public/storage/documents/');
        if (parts.length > 1) {
          cleanUrl = '/storage/documents/' + parts[1];
        }
      }
      
      // Проверяем еще один возможный формат пути
      if (url.includes('C:/xampp/htdocs/public/') || url.includes('C:\\xampp\\htdocs\\public\\')) {
        const parts = url.split('public/');
        if (parts.length > 1) {
          cleanUrl = '/' + parts[1];
        }
      }
      
      // Кодируем URL для обработки кириллицы и пробелов
      const encodedUrl = encodeURI(cleanUrl);
      console.log('Fetching file info for URL:', encodedUrl);
      
      const response = await axios.head(encodedUrl);
      console.log('HEAD response headers:', response.headers);
      
      const contentLength = response.headers['content-length'];
      const lastModified = response.headers['last-modified'];
      
      let fileInfo = {};
      
      if (contentLength) {
        fileInfo.fileSize = formatFileSize(contentLength);
      } else {
        fileInfo.fileSize = '∼ MB';
      }
      
      if (lastModified) {
        fileInfo.date = formatDate(lastModified);
      } else {
        fileInfo.date = new Date().toLocaleDateString('ru-RU');
      }
      
      return fileInfo;
    } catch (error) {
      console.error('Ошибка при получении информации о файле:', error, 'URL:', url);
      // Возвращаем заглушки при ошибке
      return {
        fileSize: '∼ MB',
        date: new Date().toLocaleDateString('ru-RU')
      };
    }
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    bytes = parseInt(bytes);
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Определение иконки по типу файла
  const getFileTypeIcon = (fileType) => {
    if (!fileType) return "/icons/document.svg";
    
    switch (fileType.toLowerCase()) {
      case 'pdf': return "/icons/pdf.svg";
      case 'doc':
      case 'docx': return "/icons/word.svg";
      case 'xls':
      case 'xlsx': return "/icons/excel.svg";
      case 'ppt':
      case 'pptx': return "/icons/powerpoint.svg";
      case 'txt': return "/icons/text.svg";
      case 'jpg':
      case 'jpeg':
      case 'png': return "/icons/image.svg";
      case 'mp4':
      case 'avi':
      case 'mov': return "/icons/video.svg";
      default: return "/icons/document.svg";
    }
  };

  // Открытие документа в модальном окне
  const openDocument = (document) => {
    if (!document || !document.url) {
      console.error('Попытка открыть документ с пустым URL');
      return;
    }
    
    setModalLoading(true);
    setModalError(null);
    setActiveDocument(document);
    
    const url = document.url;
    const fileType = document.fileType?.toLowerCase();
    
    // Для разных типов файлов - разная обработка
    if (fileType === 'pdf') {
      // Для PDF используем встроенный просмотрщик
      setViewerUrl(url);
      setShowModal(true);
      setModalLoading(false);
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      // Для изображений показываем их напрямую
      setViewerUrl(url);
      setShowModal(true);
      setModalLoading(false);
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType)) {
      // Для Office документов используем Google Docs Viewer
      try {
        // Получаем абсолютный URL
        const absoluteUrl = url.startsWith('http') ? url : window.location.origin + url;
        const encodedUrl = encodeURIComponent(absoluteUrl);
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        
        setViewerUrl(googleViewerUrl);
        setShowModal(true);
        setModalLoading(false);
      } catch (error) {
        console.error('Ошибка при подготовке просмотра документа:', error);
        setModalError('Не удалось подготовить документ для просмотра');
        setShowModal(true);
        setModalLoading(false);
      }
    } else {
      // Для других файлов открываем в новой вкладке
      window.open(url, '_blank');
      setModalLoading(false);
    }
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowModal(false);
    setActiveDocument(null);
    setViewerUrl(null);
    setModalLoading(false);
    setModalError(null);
  };

  // Проверка на загрузку данных
  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Загрузка документов...</p>
      </div>
    );
  }

  // Проверка на ошибку
  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  // Проверка наличия вкладок
  if (!documentData || documentData.length === 0) {
    return <div className="text-center p-4 text-gray-600">Документы не найдены</div>;
  }

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
      {/* Вкладки */}
      <div className="flex flex-wrap mb-6">
        {documentData.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-3 px-6 focus:outline-none transition-colors ${
              activeTab === index
                ? 'bg-white text-gray-800 font-medium border-b-2 border-green-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Контент активной вкладки */}
      <div className="py-2">
        {documentData[activeTab]?.years?.map((year, yearIndex) => (
          <div key={yearIndex} className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 px-2">{year.year}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {year.documents.map((doc, docIndex) => (
                <DocumentCard 
                  key={docIndex} 
                  document={doc} 
                  openDocument={openDocument}
                  fetchFileInfo={fetchFileInfo}
                  getFileTypeIcon={getFileTypeIcon}
                />
              ))}
            </div>
          </div>
        ))}

        {!documentData[activeTab]?.years?.length && (
          <div className="text-center p-8 text-gray-500">В данной категории нет документов</div>
        )}
      </div>

      {/* Модальное окно для просмотра документа */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg w-full max-w-6xl p-2 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h3 className="text-lg font-medium">
                {activeDocument ? activeDocument.title : 'Просмотр документа'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {modalLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : modalError ? (
              <div className="text-red-600 p-4 text-center">{modalError}</div>
            ) : (
              <iframe src={viewerUrl} className="w-full h-[80vh]" title="Document Viewer"></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент карточки документа
const DocumentCard = ({ document, openDocument, fetchFileInfo, getFileTypeIcon }) => {
  const [fileInfo, setFileInfo] = useState({
    fileSize: document.fileSize || '',
    date: document.date || ''
  });
  const [loading, setLoading] = useState(!document.fileSize);

  useEffect(() => {
    // Если размер и дата не указаны явно, получаем их через запрос
    if (!document.fileSize && document.url) {
      const getFileInfo = async () => {
        try {
          setLoading(true);
          const info = await fetchFileInfo(document.url);
          setFileInfo(info);
        } catch (error) {
          console.error('Ошибка при получении информации о файле:', error);
        } finally {
          setLoading(false);
        }
      };
      
      getFileInfo();
    }
  }, [document, fetchFileInfo]);

  return (
    <div className="w-full">
      <div className="flex flex-col h-[200px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="flex-grow overflow-hidden">
          <h2 className="font-medium leading-normal text-gray-800 line-clamp-6 mb-3">{document.title}</h2>
        </div>
        <div className="flex mt-auto justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => openDocument(document)}
              className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
              Открыть
            </button>
            <a
              href={document.url}
              download
              className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
              Скачать
            </a>
          </div>
          
          <div className="text-right">
            <div className="flex items-center">
              <img src={getFileTypeIcon(document.fileType)} alt={document.fileType} className="w-4 h-4 mr-1" />
              <span className="text-xs text-gray-500">{document.fileType?.toUpperCase()}</span>
            </div>
            {loading ? (
              <span className="text-xs text-gray-400">Загрузка...</span>
            ) : (
              <>
                <p className="text-xs text-gray-500">{fileInfo.fileSize}</p>
                <p className="text-xs text-gray-500">{fileInfo.date}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabDocuments;
