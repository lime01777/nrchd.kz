import React from 'react';
import { Head } from '@inertiajs/react';
import TabDocuments from '@/Components/TabDocuments';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function TabDocumentsExample() {
  // Пример данных для компонента TabDocuments
  const tabsData = [
    {
      title: "Исследования",
      years: [
        {
          year: "2023 год",
          documents: [
            {
              title: "Инструмент оценки результативности КИ",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            },
            {
              title: "Название документа",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            },
            {
              title: "Название документа",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            },
            {
              title: "Название документа",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            }
          ]
        }
      ]
    },
    {
      title: "Методические рекомендации",
      years: [
        {
          year: "2023 год",
          documents: [
            {
              title: "Алгоритм по определению приоритетов КИ",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            },
            {
              title: "Название документа",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            },
            {
              title: "Название документа",
              fileType: "pdf",
              fileSize: "24 KB",
              date: "27.03.2024",
              url: "#"
            }
          ]
        },
        {
          year: "2022 год",
          documents: [
            {
              title: "Методические рекомендации по проведению клинических исследований",
              fileType: "pdf",
              fileSize: "1.2 MB",
              date: "15.08.2022",
              url: "#"
            },
            {
              title: "Стандарты этического комитета для клинических исследований",
              fileType: "doc",
              fileSize: "850 KB",
              date: "10.05.2022",
              url: "#"
            }
          ]
        }
      ]
    }
  ];

  return (
    <>
      <Head title="Пример TabDocuments" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Пример использования компонента TabDocuments</h1>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Этот компонент позволяет отображать документы в табличном формате с вкладками, 
            группируя их по категориям и годам. Ниже представлен пример реализации компонента 
            с тестовыми данными.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TabDocuments tabs={tabsData} />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Структура данных для компонента</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
{`const tabsData = [
  {
    title: "Название вкладки",
    years: [
      {
        year: "2023 год",
        documents: [
          {
            title: "Название документа",
            fileType: "pdf", // тип файла
            fileSize: "24 KB", // размер файла
            date: "27.03.2024", // дата
            url: "#" // ссылка на документ
          },
          // другие документы...
        ]
      },
      // другие годы...
    ]
  },
  // другие вкладки...
]`}
          </pre>
        </div>
      </div>
    </>
  );
}

TabDocumentsExample.layout = page => (
  <LayoutDirection 
    h1="Пример TabDocuments"
    img="example"
  >
    {page}
  </LayoutDirection>
);
