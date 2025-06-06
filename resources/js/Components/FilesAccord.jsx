import React, { useState, useEffect } from 'react';
import FileAccordTitle from './FileAccordTitle';
import FileAccordChlank from './FileAccordChlank';
import axios from 'axios';

export default function FilesAccord({ sections: propSections, bgColor = 'bg-green-100', folder = '', title = '', name = '', onVideoClick, defaultOpen = false }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    // Если переданы статические данные, используем их
    if (propSections && propSections.length > 0) {
      setSections(propSections);
      // Инициализируем состояние открытых разделов
      const initialOpenState = {};
      propSections.forEach((_, index) => {
        initialOpenState[index] = index === 0 ? defaultOpen : false;
      });
      setOpenSections(initialOpenState);
      setLoading(false);
    } else {
      // Иначе загружаем данные из API
      setLoading(true);
      // Используем абсолютный URL для API
      const baseUrl = window.location.origin;
      const params = new URLSearchParams();
      
      // Добавляем параметры, если они указаны, заменяя обратные слеши на прямые
      if (folder) {
        // Заменяем обратные слеши на прямые для корректной работы URL
        const normalizedFolder = folder.replace(/\\/g, '/');
        params.append('folder', normalizedFolder);
      }
      if (title) params.append('title', title);
      
      axios.get(`${baseUrl}/api/files?${params.toString()}`)
        .then(response => {
          setSections(response.data);
          // Инициализируем состояние открытых разделов
          const initialOpenState = {};
          response.data.forEach((_, index) => {
            initialOpenState[index] = index === 0 ? defaultOpen : false;
          });
          setOpenSections(initialOpenState);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ошибка при загрузке файлов:', err);
          setError('Не удалось загрузить файлы. Пожалуйста, попробуйте позже.');
          setLoading(false);
        });
    }
  }, [propSections, folder, title, defaultOpen]);

  const toggleSection = (index) => {
    setOpenSections(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  if (loading) {
    return <div className="text-center py-4" data-translate>Загрузка файлов...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500" data-translate>{error}</div>;
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap -mx-4">
      <div className="w-full px-4">
        <div className={`rounded-lg overflow-hidden ${bgColor}`}>
          {sections.map((section, index) => (
            <div key={index}>
              <FileAccordTitle
                title={section.title}
                isOpen={openSections[index]}
                toggleOpen={() => toggleSection(index)}
              />
              {openSections[index] && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.documents && section.documents.map((document, fileIndex) => (
                      <div key={fileIndex} className="bg-white rounded-lg shadow p-3">
                        <FileAccordChlank
                          {...document}
                          onVideoClick={onVideoClick}
                        />
                      </div>
                    ))}
                    {section.files && section.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="bg-white rounded-lg shadow p-3">
                        <FileAccordChlank
                          file={file}
                          onVideoClick={onVideoClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}