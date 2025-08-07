import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import axios from 'axios';

export default function ClinicalProtocolsCatalog() {
  console.log('Инициализация компонента ClinicalProtocolsCatalog');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedMkb, setSelectedMkb] = useState('');
  const [loading, setLoading] = useState(true); // Начинаем с состояния загрузки
  const [error, setError] = useState(null); // Добавляем состояние для ошибок
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Добавляем логирование при монтировании компонента
  useEffect(() => {
    console.log('Компонент ClinicalProtocolsCatalog смонтирован');
    
    // Проверяем доступность API клинических протоколов
    const checkApiAvailability = async () => {
      try {
        console.log('Проверяем доступность API клинических протоколов');
        const baseUrl = window.location.origin;
        const response = await axios.get(`${baseUrl}/api/clinical-protocols`);
        console.log('Ответ API:', response.data);
      } catch (error) {
        console.error('Ошибка при проверке API:', error);
        setError(`Ошибка при проверке API: ${error.message}`);
      }
    };
    
    checkApiAvailability();
    
    return () => {
      console.log('Компонент ClinicalProtocolsCatalog размонтирован');
    };
  }, []);
  
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
  
  
  // Дополнительные состояния для отображения количества найденных протоколов
  const [totalProtocols, setTotalProtocols] = useState(0);
  const [filteredProtocols, setFilteredProtocols] = useState(0);
  
  // Обработчик для обновления счетчика протоколов и доступных категорий
  const handleFilesLoaded = (data) => {
    console.log('handleFilesLoaded вызван с данными:', data);
    console.log('Тип полученных данных:', typeof data, Array.isArray(data) ? 'массив' : 'не массив');
    
    if (data) {
      console.log('Количество элементов в данных:', Array.isArray(data) ? data.length : 'не массив');
      if (Array.isArray(data) && data.length > 0) {
        console.log('Первый элемент данных:', data[0]);
      }
    }
    
    setLoading(false); // Данные загружены, скрываем индикатор загрузки
    setError(null); // Сбрасываем ошибку, если она была
    
    try {
      if (data && Array.isArray(data)) {
        setFilteredProtocols(data.length);
        
        // Извлекаем уникальные категории из данных, если они есть
        if (data.length > 0) {
          if (data[0].categories) {
            const uniqueCategories = [...new Set(data.map(item => item.categories).flat())];
            setAvailableCategories(uniqueCategories);
          } else if (data[0].category) {
            // Если категории хранятся в поле category
            const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
            setAvailableCategories(uniqueCategories);
          } else {
            // Если категорий нет в данных, устанавливаем пустой массив
            setAvailableCategories([]);
          }
        } else {
          setAvailableCategories([]);
        }
      } else {
        console.log('Получены некорректные данные:', data);
        setFilteredProtocols(0);
        setAvailableCategories([]);
      }
    } catch (error) {
      console.error('Ошибка при обработке данных протоколов:', error);
      setFilteredProtocols(0);
      setAvailableCategories([]);
      setError('Ошибка при обработке данных протоколов: ' + error.message);
    }
  };
  
  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true); // Показываем индикатор загрузки при изменении фильтров
  };
  
  // Обработка изменения раздела медицины
  const handleMedicineChange = (e) => {
    setSelectedMedicine(e.target.value);
    setLoading(true); // Показываем индикатор загрузки при изменении фильтров
  };
  
  // Обработка изменения категории МКБ
  const handleMkbChange = (e) => {
    setSelectedMkb(e.target.value);
    setLoading(true); // Показываем индикатор загрузки при изменении фильтров
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMedicine('');
    setSelectedMkb('');
    setLoading(true); // Показываем индикатор загрузки при сбросе фильтров
    setError(null); // Сбрасываем ошибку, если она была
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

                {/* Информация о количестве найденных протоколов */}
                {filteredProtocols > 0 && (
                  <div className="text-center text-sm text-gray-600">
                    Найдено протоколов: {filteredProtocols}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-center">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Сбросить все фильтры
                </button>
              </div>
            </div>
            
            {/* Индикатор загрузки */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Загрузка протоколов...</span>
              </div>
            )}
            
            {/* Сообщение об ошибке */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Ошибка!</strong>
                <span className="block sm:inline"> {error}</span>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3" 
                  onClick={() => setError(null)}
                >
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Закрыть</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Список клинических протоколов */}
            {!loading && !error ? (
              <>
                <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">Статус: Загрузка протоколов...</p>
                </div>
                <SimpleFileDisplay 
                  key={`${searchTerm}-${selectedMedicine}-${selectedMkb}`} // Добавляем key для пересоздания компонента при изменении фильтров
                  searchTerm={searchTerm} 
                  medicine={selectedMedicine}
                  mkb={selectedMkb}
                  bgColor="bg-white"
                  useClinicalProtocols={true}
                  onFilesLoaded={handleFilesLoaded}
                  onError={(errorMsg) => {
                    console.error('Ошибка в SimpleFileDisplay:', errorMsg);
                    setError(errorMsg);
                    setLoading(false);
                  }}
                />
              </>
            ) : null}
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