import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import axios from 'axios';

export default function ClinicalProtocolsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedMkb, setSelectedMkb] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Разделы медицины
  const medicineSections = [
    { value: '', label: 'Все разделы медицины' },
    { value: 'cardiology', label: 'Кардиология' },
    { value: 'gastroenterology', label: 'Гастроэнтерология' },
    { value: 'neurology', label: 'Неврология' },
    { value: 'pulmonology', label: 'Пульмонология' },
    { value: 'endocrinology', label: 'Эндокринология' },
    { value: 'oncology', label: 'Онкология' },
    { value: 'pediatrics', label: 'Педиатрия' },
    { value: 'surgery', label: 'Хирургия' },
    { value: 'obstetrics', label: 'Акушерство и гинекология' },
    { value: 'urology', label: 'Урология' },
    { value: 'ophthalmology', label: 'Офтальмология' },
    { value: 'otolaryngology', label: 'Оториноларингология' },
    { value: 'dermatology', label: 'Дерматология' },
    { value: 'infectious', label: 'Инфекционные болезни' },
    { value: 'psychiatry', label: 'Психиатрия' },
    { value: 'rheumatology', label: 'Ревматология' },
    { value: 'traumatology', label: 'Травматология и ортопедия' },
  ];
  
  // Категории МКБ
  const mkbCategories = [
    { value: '', label: 'Все категории МКБ' },
    { value: 'A00-B99', label: 'A00-B99: Инфекционные и паразитарные болезни' },
    { value: 'C00-D48', label: 'C00-D48: Новообразования' },
    { value: 'D50-D89', label: 'D50-D89: Болезни крови и иммунные нарушения' },
    { value: 'E00-E90', label: 'E00-E90: Эндокринные и метаболические заболевания' },
    { value: 'F00-F99', label: 'F00-F99: Психические расстройства' },
    { value: 'G00-G99', label: 'G00-G99: Болезни нервной системы' },
    { value: 'H00-H59', label: 'H00-H59: Болезни глаза и придаточного аппарата' },
    { value: 'H60-H95', label: 'H60-H95: Болезни уха и сосцевидного отростка' },
    { value: 'I00-I99', label: 'I00-I99: Болезни системы кровообращения' },
    { value: 'J00-J99', label: 'J00-J99: Болезни органов дыхания' },
    { value: 'K00-K93', label: 'K00-K93: Болезни органов пищеварения' },
    { value: 'L00-L99', label: 'L00-L99: Болезни кожи и подкожной клетчатки' },
    { value: 'M00-M99', label: 'M00-M99: Болезни костно-мышечной системы' },
    { value: 'N00-N99', label: 'N00-N99: Болезни мочеполовой системы' },
    { value: 'O00-O99', label: 'O00-O99: Беременность, роды и послеродовой период' },
    { value: 'P00-P96', label: 'P00-P96: Отдельные состояния перинатального периода' },
    { value: 'Q00-Q99', label: 'Q00-Q99: Врожденные аномалии' },
    { value: 'R00-R99', label: 'R00-R99: Симптомы и признаки' },
    { value: 'S00-T98', label: 'S00-T98: Травмы и отравления' },
    { value: 'V01-Y98', label: 'V01-Y98: Внешние причины заболеваемости и смертности' },
    { value: 'Z00-Z99', label: 'Z00-Z99: Факторы, влияющие на здоровье' },
  ];
  
  
  // Загрузка доступных категорий из файлов
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/files', {
          params: {
            folder: 'Клинические протоколы/Поток — клинические протоколы',
            title: 'Клинические протоколы'
          }
        });
        
        // Извлекаем уникальные категории из файлов
        if (response.data && response.data[0] && response.data[0].documents) {
          const uniqueCategories = [...new Set(response.data[0].documents
            .filter(doc => doc.category)
            .map(doc => doc.category))];
          
          setAvailableCategories(uniqueCategories.map(cat => ({
            value: cat,
            label: cat
          })));
        }
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Обработка изменения раздела медицины
  const handleMedicineChange = (e) => {
    setSelectedMedicine(e.target.value);
  };
  
  // Обработка изменения категории МКБ
  const handleMkbChange = (e) => {
    setSelectedMkb(e.target.value);
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMedicine('');
    setSelectedMkb('');
  };
  
  // Формируем поисковый запрос для SimpleFileDisplay
  const getSearchQuery = () => {
    let query = searchTerm;
    
    if (selectedMedicine) {
      query += ` medicine:${selectedMedicine}`;
    }
    
    if (selectedMkb) {
      query += ` mkb:${selectedMkb}`;
    }
    
    return query;
  };
  
  return (
    <>
      <Head title='Клинические протоколы' />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Фильтры и поиск */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Поиск по названию</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Введите название протокола"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Раздел медицины */}
                  <div>
                    <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">Раздел медицины</label>
                    <select
                      id="medicine"
                      name="medicine"
                      value={selectedMedicine}
                      onChange={handleMedicineChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {medicineSections.map((section) => (
                        <option key={section.value} value={section.value}>{section.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Категория МКБ */}
                  <div>
                    <label htmlFor="mkb" className="block text-sm font-medium text-gray-700 mb-1">Категория МКБ</label>
                    <select
                      id="mkb"
                      name="mkb"
                      value={selectedMkb}
                      onChange={handleMkbChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {mkbCategories.map((mkb) => (
                        <option key={mkb.value} value={mkb.value}>{mkb.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
            
            {/* Отображение файлов */}
            <SimpleFileDisplay 
              folder="Клинические протоколы\Поток — клинические протоколы" 
              searchTerm={searchTerm}
              medicine={selectedMedicine}
              mkb={selectedMkb}
              bgColor="bg-white"
            />
          </div>
        </div>
      </section>
    </>
  );
}

ClinicalProtocolsCatalog.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Утвержденные клинические протоколы" 
  parentRoute={route('clinical.protocols')} 
  parentName="Клинические протоколы"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;