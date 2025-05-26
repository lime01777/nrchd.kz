import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import NormativeDocumentsList from '@/Components/NormativeDocumentsList';
import FAQ from '@/Components/FAQ';
import News from '@/Components/News';

export default function Clinical() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [filteredItems, setFilteredItems] = useState([]);

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedFileName('');
  };

  return (
    <>
      <Head title="Клинические исследования" />

      <section className="text-gray-600 body-font pb-2 bg-gray-200">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">
                ЦРКИ создан в 2022 году приказом Министра здравоохранения РК для обеспечения развития и координации проведения клинических исследований (<a href="https://adilet.zan.kz/rus/docs/P2200000945" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">ссылка</a>)
              </p>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Деятельность Центра</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Блок 1 - Консультационная поддержка */}
                <div className="bg-blue-100 p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Консультационная поддержка</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>методологическая и информационная поддержка заинтересованных лиц по вопросам проведения клинических исследований;</li>
                    <li>первичное консультирование потенциальных спонсоров по проведению клинических исследований в т.ч. подбор клинических баз;</li>
                    <li>разработка алгоритмов и консультирование по процессам регистрации клинических исследований в Национальной информационной системе по биомедицинским исследованиям;</li>
                  </ul>
                </div>
                
                {/* Блок 2 - Аналитическая работа */}
                <div className="bg-green-100 p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Аналитическая работа</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>формирование приоритетных направлений в проведении клинических исследований, путем анализа ситуаций и сбора предложений от ведущих стейкхолдеров;</li>
                    <li>оценка возможности проведения клинических исследований и анализ инвестиционной привлекательности для потенциальных спонсоров исследований;</li>
                    <li>анализ ситуации по готовности клинических баз к реализации клинических исследований;</li>
                    <li>мониторинг и анализ данных по проводимым клиническим исследованиям в Казахстане;</li>
                  </ul>
                </div>
                
                {/* Блок 3 - Разработка регуляторных механизмов */}
                <div className="bg-purple-100 p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Разработка регуляторных механизмов</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>формирование предложений в уполномоченный орган по развитию клинических исследований;</li>
                    <li>разработка инструментов эффективной интеграции профессионалов практического здравоохранения в роль клинического исследователя;</li>
                    <li>разработка правил и механизмов, регулирующих сбор, использование и распространение информации по клиническим исследованиям;</li>
                  </ul>
                </div>
                
                {/* Блок 4 - Развитие сотрудничества */}
                <div className="bg-amber-100 p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">Развитие сотрудничества</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>повышение потенциала национальных исследователей, заинтересованности, усиление навыков в проведении клинических исследований;</li>
                    <li>поддержка межсекторального исследовательского взаимодействия в области клинических исследований;</li>
                    <li>выстраивание партнерских отношений с ведущими лидерами в области проведения клинических исследований;</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-8 border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Национальная информационная система по биомедицинским исследованиям</h3>
              <p className="text-gray-700 mb-4">
                Национальная информационная система по биомедицинским исследованиям – это информационный ресурс, консолидирующий данные по биомедицинским исследованиям.
              </p>
              <p className="text-gray-700 mb-4">
                Предназначена для автоматизации бизнес-процессов проведения клинических исследований – от этапа подачи заявки на регистрацию до формирования отчетности.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2">Реестр клинических исследований</h4>
                  <p className="text-gray-700">
                    Позволяет оптимизировать процесс управления клиническими исследованиями. Реестр функционирует по принципу «единого окна», позволяющего консолидировать всех участников/заинтересованных сторон в процессе управления клиническими исследованиями.
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2">Реестр исследователей</h4>
                  <p className="text-gray-700">
                    Включает данные отечественных исследователей, реализующих клинические исследования, проводимые на территории РК. Данный реестр предназначен для поиска потенциальных исследователей и формирования актуальной базы данных исследователей Казахстана.
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2">Реестр клинических баз</h4>
                  <p className="text-gray-700">
                    Содержит данные по организациям здравоохранения РК, на базе которых проводятся клинические исследования. Реестр позволяет оценить готовность отрасли к реализации исследований (инфраструктура) и изучить их потенциал, проводить учет клинических баз.
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2">Реестр волонтеров</h4>
                  <p className="text-gray-700">
                    Предназначен для формирования пула потенциальных добровольцев для участия в клинических исследованиях. Гражданин РК, выразивший желание принять участие в исследовании, может направить запрос на включение своей кандидатуры в данный реестр, с последующим его привлечением.
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm md:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-2">Реестр пациентов по нозологиям</h4>
                  <p className="text-gray-700">
                    Реестр с закрытым доступом, содержащий информацию по потенциальным субъектам исследования и пациентам, принимающим участие в текущих или завершивших проектах. Данный реестр предназначен для проведения оценки готовности клинической базы в частности, и страны в целом в проведении клинического исследования.
                  </p>
                </div>
              </div>
            </div>
            
            <SimpleFileDisplay 
              folder="Медицинская наука\Папка — Клинические исследования\Поток -  Методологические разработки" 
              title="Аналитические отчеты, информационные, методические материалы и публикации" 
              bgColor="bg-white"
              onVideoClick={openVideoModal}
            />
        </div>
      </div>
      </section>
<br />
      <section className="text-gray-600 body-font pb-24 bg-white">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col text-center w-full mb-10">
            <h2 className="text-2xl font-medium title-font text-gray-900 mb-4">Научные публикации центра развития клинических исследований</h2>

          </div>

          <div className="mb-6">
            <label htmlFor="year-filter" className="block mb-2 text-sm font-medium text-gray-700">Фильтр по году:</label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/4 p-2.5"
            >
              <option value="all">Все годы</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="space-y-6">
            {(selectedYear === 'all' || selectedYear === '2025') && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2025 год</h3>
                <div className="text-center py-6">
                  <p className="text-gray-500 italic">Публикации в процессе подготовки...</p>
                </div>
              </div>
            )}

            {(selectedYear === 'all' || selectedYear === '2024') && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2024 год</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Анализ текущей ситуации доступности информации о проводимых клинических испытаниях в Республике Казахстан</h5>
                    <p className="text-sm text-gray-600 mb-1">Analysis of the current situation on the availability of information on ongoing clinical trials in the Republic of Kazakhstan</p>
                    <p className="text-sm text-gray-600 mb-1">Авторы: Айнур Сибагатова, Гульнара Кулкаева, Балжан Касиева, Андрей Авдеев, Олжас Турар, Рустам Албаев, Насрулла Шаназаров, Талгат Нургожин, Айсулу Исабекова</p>
                    <a href="https://newjournal.ssmu.kz/upload/iblock/9d5/1ip82xm6hsdo0xq5a3s42thslhxskji6/07_014_6_25_2023.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Функционирование этических комитетов в Казахстане: результаты и рекомендации</h5>
                    <p className="text-sm text-gray-600 mb-1">The functioning of ethics committees in Kazakhstan: results and recommendations</p>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/39749153/ " target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Трансформация алгоритма приоритизации направлений развития клинических исследований в соответствии с их практической значимостью</h5>
                    <p className="text-sm text-gray-600 mb-1">Transformation of the algorithm for prioritization of clinical trial development areas according to their practical significance based on information data analysis</p>
                    <a href="https://pubmed.ncbi.nlm.nih.gov/39791504/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Формирование конкурентной экосистемы для развития биомедицинских исследований в Республике Казахстан</h5>
                    <p className="text-sm text-gray-600 mb-1">Formation of a competitive ecosystem for the development of biomedical research in the Republic of Kazakhstan</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Управление вопросами страхования при проведении клинических исследований</h5>
                    <p className="text-sm text-gray-600 mb-1">Insurance management in clinical trials (international and domestic experience)</p>
                    <p className="text-sm text-gray-600 mb-1">Авторы: Кулкаева Г.У., Граф М.А., Тарасова В.М., Табаров А.Б.</p>
                    <a href="https://qmu.edu.kz/upload/medialibrary/senat/nauchnyy-komitet/2024senat/kayupova-gaukhar-serikovna/Astana%20Medical%20Journal.pdf " target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Актуальные вопросы регулирования клинических исследований в Казахстане</h5>
                    <p className="text-sm text-gray-600 mb-1">Авторы: Г.У. Кулкаева, М.А. Граф, Н.Т. Алдиярова, В.М. Тарасова, Т.С. Нургожин</p>
                    <a href="https://pharmkaz.kz/2024/06/29/aktualnye-voprosy-regulirovaniya-klinicheskix-issledovanij-v-kazaxstane/ " target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Результаты анализа выстроенной системы проведения клинических исследований и барьеры для их развития в Казахстане</h5>
                    <p className="text-sm text-gray-600 mb-1">Results of the analysis of the established research system and barriers to its development in Kazakhstan</p>
                    <p className="text-sm text-gray-600 mb-1">Авторы: Кулкаева Г.У., Тарасова В.М., Граф М.А., Табаров А.Б.</p>
                    <a href="https://newjournal.ssmu.kz/publication/511/2024-4-31-38/ " target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Оценка исследовательского потенциала специалистов здравоохранения Республики Казахстан</h5>
                    <p className="text-sm text-gray-600 mb-1">Assessment of the research potential of healthcare specialists in the Republic of Kazakhstan in the implementation of clinical research: results of online questionnaires and self-assessments</p>
                    <p className="text-sm text-gray-600 mb-1">Авторы: Г.У. Кулкаева, В.М. Тарасова, М.А. Граф, А.Б. Табаров</p>
                    <a href="https://medecol.qmu.kz/jour/article/view/759" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-gray-800 mb-1">Возможности использования методик оценки методологического качества клинических исследований</h5>
                    <p className="text-sm text-gray-600 mb-1">Possibilities of using methods for assessing the methodological quality of clinical trials</p>
                    <p className="text-sm text-gray-600 mb-1">Авторы: ТҰРАР О.А., КУЛКАЕВА Г.У., АВДЕЕВ А.В., КАЛИЖАН М.К., АЛБАЕВ Р.К., ШАНАЗАРОВ Н.А., СИБАГАТОВА А.С., КАСИЕВА Б.С., НУРГОЖИН Т.С., ИСАБЕКОВА А.М.</p>
                    <a href="https://pharmkaz.kz/wp-content/uploads/2024/10/4-2024-2.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">Читать статью</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


          <section className="text-gray-600 body-font pb-8 bg-gray-200">
          <div className="container px-5 mx-auto">
              <NormativeDocumentsList 
                documents={[
                  {
                    title: 'Кодекс РК «О здоровье народа и системе здравоохранения»',
                    url: 'https://adilet.zan.kz/rus/docs/K2000000360'
                  },
                  {
                    title: 'Приказ Министра здравоохранения Республики Казахстан от 7 апреля 2022 года № ҚР ДСМ- 35 «О внесении изменений и дополнений в некоторые приказы Министерства здравоохранения Республики Казахстан»',
                    url: 'https://adilet.zan.kz/rus/docs/V2200027526'
                  },
                  {
                    title: 'Приказ Министра здравоохранения Республики Казахстан от 21 декабря 2020 года № ҚР ДСМ-310/2020 «Об утверждении правил проведения биомедицинских исследований, требований к исследовательским центрам и порядка их аккредитации»',
                    url: 'https://adilet.zan.kz/rus/docs/V2000021851#z3'
                  },
                  {
                    title: 'Приказ и.о. Министра здравоохранения Республики Казахстан от 4 февраля 2021 года № ҚР ДСМ-15 «Об утверждении надлежащих фармацевтических практик»',
                    url: 'https://adilet.zan.kz/rus/docs/V2100022167'
                  },
                  {
                    title: 'Приказ Министра здравоохранения Республики Казахстан от 8 декабря 2020 года № ҚР ДСМ-237/2020 «Об утверждении Правил ввоза на территорию и вывоза с территории Республики Казахстан лекарственных средств и медицинских изделий»',
                    url: 'https://adilet.zan.kz/rus/docs/V2000021749'
                  },
                  {
                    title: 'Решение Совета Евразийской экономической комиссии от 3 ноября 2016 года № 79 «Об утверждении правил надлежащей клинической практики Евразийского экономического союза»',
                    url: 'https://adilet.zan.kz/rus/docs/H16EV000079'
                  },
                  {
                    title: 'Решение Совета Евразийской экономической комиссии от 3 ноября 2016 года № 85 «Об утверждении Правил проведения исследований биоэквивалентности лекарственных препаратов в рамках Евразийского экономического союза»',
                    url: 'https://adilet.zan.kz/rus/docs/H16EV000085'
                  },
                  {
                    title: 'Решение Совета Евразийской экономической комиссии от 3 ноября 2016 N 89 «Об утверждении Правил проведения исследований биологических лекарственных средств Евразийского экономического союза»',
                    url: 'https://docs.eaeunion.org/docs/ru-ru/01411954/cncd_21112016_89'
                  },
                  {
                    title: 'Рекомендации Коллегии ЕЭК от 17 июля 2018 г. №11«Руководство по общим вопросам клинических исследований»',
                    url: 'https://docs.eaeunion.org/docs/ru-ru/01418320/clcr_20072018_11'
                  },
                  {
                    title: 'Решение Коллегии ЕЭК от 26 ноября 2019 г. № 202 «Об утверждении Руководства по доклиническим исследованиям безопасности в целях проведения клинических исследований и регистрации лекарственных препаратов»',
                    url: 'https://adilet.zan.kz/rus/docs/H19EK000202'
                  },
                  {
                    title: 'Рекомендации Коллегии ЕЭК от 17 декабря 2019 г. № 42 «О Руководстве по выбору не исследуемых лекарственных препаратов с целью проведения клинических исследований лекарственных препаратов»',
                    url: 'https://continent-online.com/Document/?doc_id=31993845&ysclid=lrq8363l8o477078394'
                  }
                ]}
                title="Правовое регулирование в области клинических исследований"
                bgColor="bg-gray-200"
              />
            </div>
      </section>

      <section className="text-gray-600 body-font pb-2 bg-white">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col text-center w-full mb-10 mt-12">
            <h2 className="text-2xl font-medium title-font text-gray-900 mb-4">Развитие потенциала клинических
            исследователей</h2>
          </div>
          
          <div className="bg-gray-200 p-8 rounded-lg shadow-sm mb-12">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4 leading-relaxed">
                Для унификации знаний и повышения потенциала исследователей, участвующих в реализации клинических исследований, Центр развития клинических исследований создал он-лайн образовательный ресурс.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Ресурс представляет собой виртуальную учебную среду для подготовки специалистов здравоохранения по вопросам клинических исследований.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Он-лайн образовательный ресурс является инструментом для повышения потенциала исследователей с опытом, а также предназначен для наделения новыми знаниями и навыками молодых специалистов (в том числе, обучающихся по образовательным программам магистратуры и докторантуры). Дистанционный подход к обучению позволит слушателям курса пройти обучение в удобное им время вне зависимости от места нахождения, и получить свидетельство об успешном освоении материалы курса после прохождения итогового тестирования.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Образовательные материалы ресурса разработаны на основе международных стандартов и национального законодательства РК. Презентационный материал и библиотечные ресурсы призваны являться подспорьем исследователю в процессе их деятельности, так как охватывают широкий перечень вопросов по изучаемой тематике.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Базовый курс</h3>
                  <p className="text-gray-700">
                    Курс – Основы GCP. Введение в организацию и проведение клинических исследований (базовый курс).
                  </p>
                  <a href="#" className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Подробнее о курсе
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Продвинутый курс</h3>
                  <p className="text-gray-700">
                    Курс – Международные стандарты GCP, актуальные вопросы организации и проведения клинических исследований (продвинутый курс).
                  </p>
                  <a href="#" className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Подробнее о курсе
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-2 bg-white">
        <div className="container px-5 mx-auto">
        <News />
        </div>
      </section>

    </>
  );
}

Clinical.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Центр развития клинических исследований"
  parentRoute={route('medical.science')} 
  parentName="Медицинская наука"
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
>{page}</LayoutFolderChlank>;
