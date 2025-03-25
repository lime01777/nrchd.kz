import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileAccordChlank({ description, filetype, img, filesize = "24 KB", date = "27.03.2024", url = "#", file }) {
  const [fileInfo, setFileInfo] = useState({ size: filesize, date: date });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [error, setError] = useState(null);

  // Если передан объект file, используем его свойства
  useEffect(() => {
    if (file) {
      // Используем свойства из переданного объекта file
      setFileInfo({
        size: file.size || filesize,
        date: file.date || date
      });
      // Обновляем другие переменные из объекта file
      description = file.description || description;
      filetype = file.filetype || filetype;
      img = file.img || img;
      url = file.url || url;
    }
  }, [file]);

  useEffect(() => {
    if (url && url !== "#") {
      // Получаем информацию о файле с помощью HEAD запроса
      axios.head(url)
        .then(response => {
          const contentLength = response.headers['content-length'];
          const lastModified = response.headers['last-modified'];
          
          if (contentLength) {
            setFileInfo(prev => ({ 
              ...prev, 
              size: formatFileSize(contentLength) 
            }));
          }
          
          if (lastModified) {
            setFileInfo(prev => ({ 
              ...prev, 
              date: formatDate(new Date(lastModified)) 
            }));
          }
        })
        .catch(error => {
          console.error('Ошибка при получении информации о файле:', error);
        });
    }
  }, [url]);

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return filesize;
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = parseInt(bytes, 10);
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Форматирование даты
  const formatDate = (date) => {
    if (!date) return fileInfo.date;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  };

  // Определяем тип файла для отображения в модальном окне
  const getFileType = () => {
    if (!url || url === "#") return null;
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'excel';
    } else if (['ppt', 'pptx'].includes(extension)) {
      return 'powerpoint';
    } else if (['txt'].includes(extension)) {
      return 'text';
    }
    
    return null;
  };

  // Получаем абсолютный URL для файла
  const getAbsoluteFileUrl = () => {
    if (!url || url === "#") return "";
    
    // Если URL уже абсолютный (начинается с http:// или https://), возвращаем его как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Иначе добавляем origin текущего сайта
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Получаем иконку для типа файла
  const getFileTypeIcon = () => {
    if (!url || url === "#") return "1"; // По умолчанию doc формат (1.png)
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return "2"; // pdf формат (2.png)
    } else if (['xls', 'xlsx'].includes(extension)) {
      return "3"; // xlsx формат (3.png)
    } else if (['txt'].includes(extension)) {
      return "4"; // txt формат (4.png)
    } else if (['ppt', 'pptx'].includes(extension)) {
      return "5"; // pptx формат (5.png)
    } else if (['doc', 'docx'].includes(extension)) {
      return "1"; // doc формат (1.png)
    }
    
    return "1"; // По умолчанию doc формат
  };

  // Конвертация документов Office с помощью Google Docs Viewer
  const convertOfficeDocument = (fileUrl) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const absoluteUrl = getAbsoluteFileUrl();
      const encodedUrl = encodeURIComponent(absoluteUrl);
      
      // Google Docs Viewer для просмотра Office документов
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      
      setViewerUrl(googleViewerUrl);
      setIsLoading(false);
      return googleViewerUrl;
    } catch (error) {
      console.error('Ошибка при конвертации документа:', error);
      setError('Не удалось подготовить документ для просмотра');
      setIsLoading(false);
      return null;
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setShowModal(true);
    // Предотвращаем прокрутку страницы при открытом модальном окне
    document.body.style.overflow = 'hidden';
    
    // Если это документ Office, подготавливаем его для просмотра
    const fileType = getFileType();
    if (['word', 'excel'].includes(fileType)) {
      convertOfficeDocument(url);
    } else {
      // Для других типов файлов сбрасываем состояние просмотрщика
      setViewerUrl(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = 'auto';
    // Сбрасываем состояние
    setViewerUrl(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col h-[200px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex-grow overflow-hidden">
            <h2 className="font-medium leading-normal text-gray-800 line-clamp-6 mb-3">{description}</h2>
          </div>
          <div className="flex mt-auto justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={openModal}
                className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                Открыть
              </button>
              <a
                href={url}
                download
                className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                Скачать
              </a>
            </div>
            <div className="flex flex-col text-sm">
              <div className="flex flex-row items-center">
                <img src={`/img/FileType/${getFileTypeIcon()}.png`} alt="" className="w-4 h-4" />
                <p className="ml-1 uppercase text-xs text-gray-600">{filetype}, {fileInfo.size}</p>
              </div>
              <p className="text-gray-400 text-xs text-right">{fileInfo.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для просмотра документов */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800 truncate">{description}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600">Подготовка документа к просмотру...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              ) : getFileType() === 'image' ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <img 
                    src={url} 
                    alt={description} 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : getFileType() === 'pdf' ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="w-full h-full">
                    <iframe 
                      src={`${url}#toolbar=0&navpanes=0`}
                      className="w-full h-full min-h-[70vh]" 
                      title={description}
                    ></iframe>
                  </div>
                </div>
              ) : ['word', 'excel'].includes(getFileType()) && viewerUrl ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="w-full h-full">
                    <iframe 
                      src={viewerUrl}
                      className="w-full h-full min-h-[70vh]" 
                      title={description}
                      frameBorder="0"
                    ></iframe>
                  </div>
                </div>
              ) : ['word', 'excel', 'powerpoint'].includes(getFileType()) ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-blue-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Предпросмотр для этого типа файла недоступен</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Предпросмотр для этого типа файла недоступен</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 transition-colors duration-200"
              >
                Открыть в новой вкладке
              </a>
              <button 
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FileAccordChlank;