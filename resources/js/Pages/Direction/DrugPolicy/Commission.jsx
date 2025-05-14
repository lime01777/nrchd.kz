import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import ActualFile from '@/Components/ActualFile';
import VideoModal from '@/Components/VideoModal';
import { Link } from '@inertiajs/react';

export default function Commission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

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
      <Head title="Формулярная комиссия МЗ РК" />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">О Формулярной комиссии</h3>
              
              <p className="text-gray-700 mb-4">
                Формулярная комиссия является постоянно действующим консультативно-совещательным органом при Министерстве здравоохранения Республики Казахстан и в своей деятельности руководствуется Конституцией Республики Казахстан, Законами Республики Казахстан и иными нормативными правовыми актами Республики Казахстан, а также Положением о ФК МЗ РК.  
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">Актуальный состав комиссии</h4>
              <p className="text-gray-700 mb-4">
                Приказом Министра здравоохранения РК от 24 июля 2024 года №478 утвержден новый состав ФК МЗ РК. В состав вошли 11 человек, представители уполномоченного органа и клинические фармакологи экспертного уровня. 
              </p>
              <p className="text-gray-700 mb-4">
                Председателем состава ФК МЗ РК был назначен <strong>Нурлыбаев Ержан Шакирович</strong> – вице-министр здравоохранения Республики Казахстан, заместителем был избран <strong>Адильхан Жандос Койшибаевич</strong> - директор Департамента лекарственной политики МЗ РК.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">История состава комиссии</h4>
              <p className="text-gray-700 mb-4">
                Ранее Приказом Министра здравоохранения РК от 5 мая 2021 года №263 был утвержден состав ФК МЗ РК из 32 человек, который состоял из представителей уполномоченного органа, фармацевтических ассоциаций, руководители и ведущие специалисты медицинских центров, профильные эксперты в сфере обращения лекарственных средств и др.  
              </p>
              <p className="text-gray-700 mb-4">
                Председателем состава ФК МЗ РК был назначен <strong>Буркитбаев Жандос Конысович</strong> – вице-министр здравоохранения Республики Казахстан. За годы работы (с 2022 по 2023 годы) ФК МЗ РК состав менялся 3 раза.
              </p>
              
              <div className="pl-4 border-l-4 border-amber-200 my-4">
                <p className="text-gray-700 mb-2">
                  В основной состав ФК МЗ РК, утвержденный приказом Министра здравоохранения Республики Казахстан от 05 мая 2021 года №263, были внесены изменения приказами министра здравоохранения Республики Казахстан:
                </p>
                <ul className="list-disc pl-8 mb-2">
                  <li className="text-gray-700">№ 485 от 21.06.2022г. (замена 2 членов ФК и секретаря)</li>
                  <li className="text-gray-700">№988 от 08.11.2022г. (замена заместителя Председателя и 1 члена ФК)</li>
                  <li className="text-gray-700">№ 305 от 26.05.2023г (замена Председателя и секретаря ФК, внесение 1 члена ФК, вывод из состава 6 членов ФК)</li>
                </ul>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">Нормативная база</h4>
              <p className="text-gray-700 mb-4">
                Приказом исполняющего обязанности Министра здравоохранения Республики Казахстан от 15 апреля 2021 года №215 «Об утверждении положения о Формулярной комиссии Министерства здравоохранения Республики Казахстан» (далее – Приказ №215) РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» МЗ РК (далее – РГП «ННЦРЗ») определен Рабочим органом ФК МЗ РК.
              </p>

              <p className="text-gray-700 mb-4">
                Приказом Министра здравоохранения от 14 мая 2024 года №309 внесены изменения и дополнения в Приказ №215, в части количества членов ФК МЗ РК, функций Рабочего органа и Секретаря, а именно:
              </p>

              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <ul className="list-none space-y-3">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Общее количество членов Формулярной комиссии составляет нечетное число и не превышает 15 (пятнадцать) человек. В состав Комиссии входят председатель, заместитель председателя, члены, секретарь.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Рабочий орган осуществляет учет и хранение материалов и протоколов заседаний ФК МЗ РК;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-1">•</span>
                    <span>Секретарь ФК МЗ РК осуществляет организационно-техническое обеспечение работы ФК МЗ РК, в том числе запрашивает необходимую информацию, готовит предложения по повестке дня заседания, рассылку материалов членам, в том числе проектов протоколов заседания до их подписания, размещает протокола заседаний на интернет-ресурсе КНФ не позднее трех календарных дней со дня подписания.</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 mb-4 italic">
                Отмечаем, что Рабочим органом протоколы заседаний размещаются на интернет-ресурсе КНФ не позднее трех календарных дней со дня подписания.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">Результаты работы</h4>
              <p className="text-gray-700 mb-4">
                С 2021 по 2024 годы проведено всего 107 заседаний:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">24</div>
                  <div className="text-sm text-gray-600">с мая 2021 г.</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">12</div>
                  <div className="text-sm text-gray-600">2022 г.</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">46</div>
                  <div className="text-sm text-gray-600">2023 г.</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">25</div>
                  <div className="text-sm text-gray-600">по октябрь 2024 г.</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                На заседаниях были рассмотрены проекты:
              </p>

              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Казахстанского национального лекарственного формуляра (КНФ)</li>
                <li>Перечня лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан (перечень АЛО)</li>
                <li>Перечня лекарственных средств и медицинских изделий, закупаемых у единого дистрибьютора (перечень закупа)</li>
                <li>Предельных цен на международное непатентованное и торговое наименование лекарственного средства или техническую характеристику медицинского изделия в рамках ГОБМП и ОСМС</li>
              </ul>

              <p className="text-gray-700 mb-4">
                Вместе с тем ФК МЗ РК рассмотрены вопросы по включению лекарственных средств, в том числе орфанных и медицинских изделий в перечень орфанных заболеваний и лекарственных средств для их лечения, КНФ и перечни возмещения в рамках ГОБМП и ОСМС, вопросы по списку не закупленных ЛС и МИ. Также одобрен проект номенклатуры лекарственных средств и медицинских изделий для заключения долгосрочных договоров с отечественными товаропроизводителями.
              </p>

              <div className="bg-amber-100 p-4 rounded-lg mb-4">
                <h5 className="font-semibold text-gray-800 mb-3">Актуальные приказы по составу ФК МЗ РК:</h5>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="cursor-pointer hover:text-blue-600" onClick={() => window.open('https://www.google.com', '_blank')}>№ 478 от 24.07.2024 приказ по составу ФК</li>
                  <li className="cursor-pointer hover:text-blue-600" onClick={() => window.open('https://www.google.com', '_blank')}>№ 724 от 17.10.2024 приказ по составу ФК</li>
                </ul>
              </div>
            </div>
            
            <SimpleFileDisplay 
              folder="Лекарственная политика\Папка — Формулярная комиссия МЗ РК\Набор — Приказы по составу Формулярной комиссии МЗ РК" 
              title="Приказы по составу Формулярной комиссии МЗ РК" 
              bgColor="bg-white"
            />
            
            <ActualFile 
              folder="Лекарственная политика/Папка — Формулярная комиссия МЗ РК" 
              title="Актуальный состав Формулярной комиссии" 
              bgColor="bg-amber-100"
            />
          </div>
        </div>
      </section>
    </>
  );
}

Commission.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Формулярная комиссия МЗ РК" 
  parentRoute={route('drug.policy')} 
  parentName="Лекарственная политика"
  heroBgColor="bg-amber-100"
>{page}</LayoutFolderChlank>;
