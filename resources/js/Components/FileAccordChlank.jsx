import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileAccordChlank({ description, filetype, img, filesize = "24 KB", date = "27.03.2024", url = "#" }) {
  const [fileInfo, setFileInfo] = useState({ size: filesize, date: date });

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

  return (
    <div className="p-4 md:w-1/3 w-full">
        <div className="flex flex-col h-[250px] bg-white p-8 rounded-xl text-left content-between justify-between">
            <div className='flex'>
                <h1 className="font-medium leading-relaxed mb-3">{description}</h1>
            </div>
            <div className="flex mt-4 justify-between">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                    Открыть
                </a>
                <div className='flex flex-col text-sm my-auto'>
                    <div className='flex flex-row'>
                        <img src={`/images/${img}.png`} alt="" className='w-5 h-5' />

                        <p className='ml-1 uppercase'>{filetype}, {fileInfo.size}</p>
                    </div>
                    <p className='text-gray-400 self-end'>{fileInfo.date}</p>

                </div>
            </div>

        </div>
    </div>
  )
}

export default FileAccordChlank