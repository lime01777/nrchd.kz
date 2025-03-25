import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import PageAccordions from '@/Components/PageAccordions';
import BannerCatalog from '@/Components/BannerCatalog';

export default function Prevention() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title="Профилактика и скрининг" />
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className={`tracking-wide leading-relaxed ${!showFullText ? 'line-clamp-5' : ''}`}>
              Профилактика и скрининг являются ключевыми компонентами первичной медико-санитарной помощи, направленными на предотвращение 
              заболеваний и раннее выявление патологий до появления выраженных симптомов.
              <br></br><br></br>
              <strong>Основные виды профилактики:</strong>
              <br></br>- <strong>Первичная профилактика</strong> — комплекс мер, направленных на предупреждение развития заболеваний 
              (вакцинация, формирование здорового образа жизни, гигиеническое воспитание)
              <br></br>- <strong>Вторичная профилактика</strong> — выявление заболеваний на ранних стадиях с помощью скрининговых программ
              <br></br>- <strong>Третичная профилактика</strong> — предупреждение обострений хронических заболеваний, инвалидизации и летальных исходов
              <br></br><br></br>
              <strong>Основные направления скрининговых программ:</strong>
              <br></br>- Онкологические заболевания (рак молочной железы, колоректальный рак, рак шейки матки, рак простаты)
              <br></br>- Сердечно-сосудистые заболевания (измерение артериального давления, определение уровня холестерина)
              <br></br>- Сахарный диабет (определение уровня глюкозы в крови)
              <br></br>- Туберкулез (флюорография, диаскинтест)
              <br></br>- Глаукома и катаракта (измерение внутриглазного давления, проверка остроты зрения)
              <br></br>- Остеопороз (денситометрия)
              <br></br><br></br>
              <strong>Ключевые компоненты профилактических программ:</strong>
              <br></br>- Диспансеризация населения
              <br></br>- Профилактические медицинские осмотры
              <br></br>- Иммунопрофилактика инфекционных заболеваний
              <br></br>- Формирование у населения мотивации к здоровому образу жизни
              <br></br>- Санитарно-гигиеническое просвещение
              <br></br>- Школы здоровья для пациентов с хроническими заболеваниями
              <br></br><br></br>
              <strong>Преимущества профилактического подхода:</strong>
              <br></br>- Снижение заболеваемости и смертности от предотвратимых причин
              <br></br>- Раннее выявление заболеваний, когда лечение наиболее эффективно
              <br></br>- Экономическая эффективность (профилактика дешевле, чем лечение запущенных форм заболеваний)
              <br></br>- Улучшение качество жизни населения
              <br></br>- Снижение нагрузки на систему здравоохранения
            </p>
          </div>
            
          <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowFullText(!showFullText)} 
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
              >
                  {showFullText ? 'Скрыть' : 'Читать далее'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                      <rect x="11.5" y="5" width="1" height="14" />
                      <rect x="5" y="11.5" width="14" height="1" />
                  </svg>
              </button>
          </div>
        </div>
    </section>
    <BannerCatalog />
    <PageAccordions />
    </>
  )
}

Prevention.layout = (page) => <LayoutDirection img={'pmsp_prevention'} h1={'Профилактика и скрининг'}>{page}</LayoutDirection>;
