import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import ActualFile from '@/Components/ActualFile';
import VideoModal from '@/Components/VideoModal';
import { Link } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Commission() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
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
      <Head title={t('directionsPages.drugPolicySubpages.commission.title', 'Формулярная комиссия')} />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('directionsPages.drugPolicySubpages.commission.aboutTitle')}</h3>
              
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.aboutText')}
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">{t('directionsPages.drugPolicySubpages.commission.currentCompositionTitle')}</h4>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.currentComposition1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.currentComposition2')}
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">{t('directionsPages.drugPolicySubpages.commission.historyTitle')}</h4>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.history1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.history2')}
              </p>
              
              <div className="pl-4 border-l-4 border-amber-200 my-4">
                <p className="text-gray-700 mb-2">
                  {t('directionsPages.drugPolicySubpages.commission.changesIntro')}
                </p>
                <ul className="list-disc pl-8 mb-2">
                  <li className="text-gray-700">№ 485 от 21.06.2022г. (замена 2 членов ФК и секретаря)</li>
                  <li className="text-gray-700">№988 от 08.11.2022г. (замена заместителя Председателя и 1 члена ФК)</li>
                  <li className="text-gray-700">№ 305 от 26.05.2023г (замена Председателя и секретаря ФК, внесение 1 члена ФК, вывод из состава 6 членов ФК)</li>
                </ul>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">{t('directionsPages.drugPolicySubpages.commission.legalBasisTitle')}</h4>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.legalBasis1')}
              </p>

              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.legalBasis2')}
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
                {t('directionsPages.drugPolicySubpages.commission.noteText')}
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-3">{t('directionsPages.drugPolicySubpages.commission.resultsTitle')}</h4>
              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.resultsIntro')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">24</div>
                  <div className="text-sm text-gray-600">{t('directionsPages.drugPolicySubpages.commission.since2021')}</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">12</div>
                  <div className="text-sm text-gray-600">{t('directionsPages.drugPolicySubpages.commission.year2022')}</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">46</div>
                  <div className="text-sm text-gray-600">{t('directionsPages.drugPolicySubpages.commission.year2023')}</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-700">25</div>
                  <div className="text-sm text-gray-600">{t('directionsPages.drugPolicySubpages.commission.until2024')}</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {t('directionsPages.drugPolicySubpages.commission.reviewedIntro')}
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
                <h5 className="font-semibold text-gray-800 mb-3">{t('directionsPages.drugPolicySubpages.commission.actualOrdersTitle')}</h5>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="cursor-pointer hover:text-blue-600" onClick={() => window.open('https://www.google.com', '_blank')}>№ 478 от 24.07.2024 приказ по составу ФК</li>
                  <li className="cursor-pointer hover:text-blue-600" onClick={() => window.open('https://www.google.com', '_blank')}>№ 724 от 17.10.2024 приказ по составу ФК</li>
                </ul>
              </div>
            </div>
            
            <SimpleFileDisplay 
              folder={t('directionsPages.drugPolicySubpages.commission.ordersFolder')} 
              title={t('directionsPages.drugPolicySubpages.commission.ordersTitle')} 
              bgColor="bg-white"
            />
            
            <ActualFile 
              folder={t('directionsPages.drugPolicySubpages.commission.actualFolder')} 
              title={t('directionsPages.drugPolicySubpages.commission.actualTitle')} 
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
  h1={translationService.t('directionsPages.drugPolicySubpages.commission.h1')} 
  parentRoute={route('drug.policy')} 
  parentName={translationService.t('directionsPages.drugPolicySubpages.commission.parentName')}
  heroBgColor="bg-amber-100"
  breadcrumbs={[
    { name: translationService.t('directionsPages.drugPolicySubpages.commission.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.drugPolicySubpages.commission.breadcrumbDrugPolicy'), route: 'drug.policy' },
    { name: translationService.t('directionsPages.drugPolicySubpages.commission.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;
