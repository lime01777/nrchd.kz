import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function ClinicalProtocolsCatalog() {
  console.log('Catalog component rendering...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedMkb, setSelectedMkb] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState(0);
  
  useEffect(() => {
    console.log('Catalog component mounted');
    return () => {
      console.log('Catalog component unmounted');
    };
  }, []);

  // Разделы медицины
  const medicineSections = [
    { value: '', label: 'Все разделы медицины' },
    { value: 'cardiology', label: 'Кардиология' },
    { value: 'neurology', label: 'Неврология' },
    { value: 'oncology', label: 'Онкология' },
    { value: 'pediatrics', label: 'Педиатрия' },
    { value: 'surgery', label: 'Хирургия' },
    { value: 'therapy', label: 'Терапия' },
    { value: 'gynecology', label: 'Гинекология' },
    { value: 'psychiatry', label: 'Психиатрия' },
    { value: 'dermatology', label: 'Дерматология' },
    { value: 'ophthalmology', label: 'Офтальмология' },
    { value: 'otolaryngology', label: 'Оториноларингология' },
    { value: 'urology', label: 'Урология' },
    { value: 'orthopedics', label: 'Ортопедия' },
    { value: 'anesthesiology', label: 'Анестезиология' },
    { value: 'radiology', label: 'Радиология' },
    { value: 'pathology', label: 'Патология' },
    { value: 'infectious', label: 'Инфекционные болезни' },
    { value: 'endocrinology', label: 'Эндокринология' },
    { value: 'gastroenterology', label: 'Гастроэнтерология' },
    { value: 'pulmonology', label: 'Пульмонология' },
    { value: 'nephrology', label: 'Нефрология' },
    { value: 'rheumatology', label: 'Ревматология' },
    { value: 'hematology', label: 'Гематология' },
    { value: 'immunology', label: 'Иммунология' }
  ];

  // Категории МКБ
  const mkbCategories = [
    { value: '', label: 'Все категории МКБ' },
    { value: 'A00-B99', label: 'A00-B99 Инфекционные и паразитарные болезни' },
    { value: 'C00-D48', label: 'C00-D48 Новообразования' },
    { value: 'D50-D89', label: 'D50-D89 Болезни крови и кроветворных органов' },
    { value: 'E00-E90', label: 'E00-E90 Болезни эндокринной системы' },
    { value: 'F01-F99', label: 'F01-F99 Психические расстройства' },
    { value: 'G00-G99', label: 'G00-G99 Болезни нервной системы' },
    { value: 'H00-H59', label: 'H00-H59 Болезни глаза' },
    { value: 'H60-H95', label: 'H60-H95 Болезни уха' },
    { value: 'I00-I99', label: 'I00-I99 Болезни системы кровообращения' },
    { value: 'J00-J99', label: 'J00-J99 Болезни органов дыхания' },
    { value: 'K00-K93', label: 'K00-K93 Болезни органов пищеварения' },
    { value: 'L00-L99', label: 'L00-L99 Болезни кожи' },
    { value: 'M00-M99', label: 'M00-M99 Болезни костно-мышечной системы' },
    { value: 'N00-N99', label: 'N00-N99 Болезни мочеполовой системы' },
    { value: 'O00-O99', label: 'O00-O99 Беременность, роды и послеродовой период' },
    { value: 'P00-P96', label: 'P00-P96 Отдельные состояния, возникающие в перинатальном периоде' },
    { value: 'Q00-Q99', label: 'Q00-Q99 Врожденные аномалии' },
    { value: 'R00-R99', label: 'R00-R99 Симптомы, признаки и отклонения от нормы' },
    { value: 'S00-T98', label: 'S00-T98 Травмы, отравления и другие последствия воздействия внешних причин' },
    { value: 'U00-U99', label: 'U00-U99 Коды для особых целей' },
    { value: 'V01-Y98', label: 'V01-Y98 Внешние причины заболеваемости и смертности' },
    { value: 'Z00-Z99', label: 'Z00-Z99 Факторы, влияющие на состояние здоровья' }
  ];

  // Типы документов
  const documentTypes = [
    { value: '', label: 'Все типы документов' },
    { value: 'protocols', label: 'Клинические протоколы' },
    { value: 'guidelines', label: 'Клинические руководства' },
    { value: 'archive', label: 'Архив' }
  ];

  // Обработчики событий
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMedicineChange = (e) => {
    setSelectedMedicine(e.target.value);
  };

  const handleMkbChange = (e) => {
    setSelectedMkb(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMedicine('');
    setSelectedMkb('');
    setSelectedType('');
    setError(null);
  };

  // Формирование поискового запроса
  const getSearchQuery = () => {
    let query = searchTerm;
    
    if (selectedMedicine) {
      query += (query ? ' ' : '') + `medicine:${selectedMedicine}`;
    }
    
    if (selectedMkb) {
      query += (query ? ' ' : '') + `mkb:${selectedMkb}`;
    }
    
    return query;
  };

  // Определение пути к папке на основе типа документа
  const getFolderPath = () => {
    switch (selectedType) {
      case 'protocols':
        return 'Клинические протоколы\Поток — клинические протоколы';
      case 'guidelines':
        return 'Клинические руководства\Клинические руководства МЗ РК';
      case 'archive':
        return 'Архив клинических протоколов\Архив клинических протоколов МЗ РК';
      default:
        return 'Клинические протоколы\Поток — клинические протоколы'; // По умолчанию
    }
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Тип документа */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Тип документа</label>
                    <select
                      id="type"
                      name="type"
                      value={selectedType}
                      onChange={handleTypeChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

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
            <SimpleFileDisplay
              folderPath={getFolderPath()}
              bgColor='bg-white'
              useClinicalProtocols={true}
              searchTerm={getSearchQuery()}
              onFilesLoaded={(count) => setFilteredProtocols(count)}
              onError={(errorMessage) => setError(errorMessage)}
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
  parentRoute="/clinical-protocols" 
  parentName="Клинические протоколы"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;