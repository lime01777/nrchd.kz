import React, { useState } from 'react';
import FileAccordTitle from './FileAccordTitle';
import FileAccordChlank from './FileAccordChlank';

function FilesAccord({ sections, bgColor = 'bg-green-100' }) {
  // Если sections не передан, используем данные по умолчанию
  const defaultSections = [
    {
      title: "Научно-медицинская экспертиза",
      documents: [
        { description: "МР по оформлению и утверждению НМР", filetype: "pdf", img: 2 },
        { description: "О проведении НМЭ", filetype: "doc", img: 1 },
        { description: "Приказ о научно-медицинской экспертизе", filetype: "pdf", img: 2 },
        { description: "Приказ о рабочем органе", filetype: "doc", img: 1 }
      ]
    },
    {
      title: "Повышение квалификации для среднего медперсонала",
      documents: [
        { description: "Совершенствование системы оценки медицинских технологий", filetype: "pdf", img: 2 }
      ]
    },
    {
      title: "Повышение квалификации для врачей",
      documents: [
        { description: "Совершенствование системы оценки медицинских технологий", filetype: "pdf", img: 2 }
      ]
    }
  ];

  const sectionsToRender = sections || defaultSections;
  
  // Состояние для отслеживания открытых разделов
  const [openSections, setOpenSections] = useState({});
  
  // Функция для переключения состояния раздела
  const toggleSection = (sectionIndex) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 mx-auto">
        <div className={`flex flex-wrap px-5 pb-5 ${bgColor} rounded-2xl`}>
          {sectionsToRender.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              <FileAccordTitle 
                title={section.title} 
                isOpen={!!openSections[sectionIndex]}
                toggleOpen={() => toggleSection(sectionIndex)}
              />
              <div 
                className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
                  openSections[sectionIndex] 
                    ? 'max-h-[2000px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-wrap">
                  {section.documents.map((doc, docIndex) => (
                    <FileAccordChlank 
                      key={docIndex}
                      description={doc.description} 
                      filetype={doc.filetype} 
                      img={doc.img}
                      filesize={doc.filesize || "24 KB"}
                      date={doc.date || "27.03.2024"}
                      url={doc.url}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FilesAccord;