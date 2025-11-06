import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';
import FilesAccord from '@/Components/FilesAccord';
import NameDoctor from '@/Components/NameDoctor';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

export default function Council() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const allNameDoctors = [
    { name: "Кулкаева Гульнара Утепергеновна", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Иванов Иван Иванович", about: "Заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Сидоров Сидор Сидорович", about: "Профессор, доктор медицинских наук"},
    { name: "Сергеев Сергей Сергеевич", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Николаев Николай Николаевич", about: "Доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Александрова Александра Александровна", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Александрова Александра Александровна", about: "Профессор, доктор медицинских наук"},
    { name: "Николаев Николай Николаевич", about: "Заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Сергеев Сергей Сергеевич", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Николаев Николай Николаевич", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Александрова Александра Александровна", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},
    { name: "Сергеев Сергей Сергеевич", about: "Профессор, доктор медицинских наук, заведующий кафедрой нейрофизиодогии Кахахского Национальгого Медицинского Университета"},

  ];

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head title={t('directionsPages.medicalScienceSubpages.council.title', 'Совет')} />
      <br /><br />
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg">
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">
              {t('directionsPages.medicalScienceSubpages.council.intro')}
      <br />{t('directionsPages.medicalScienceSubpages.council.tasksTitle')}
      <br />1) рассмотрение вопросов научной, исследовательской и инновационной деятельности Центра, выработка предложений по ее совершенствованию и внесение рекомендаций;
      <br />2) содействие реализации приоритетных направлений научной, и инновационной деятельности Республики Казахстан, определенных Президентом Республики Казахстан, Правительством Республики Казахстан и Министерством здравоохранения Республики Казахстан в области системы здравоохранения и смежных сферах экономики;
      <br />3) рассмотрение стратегических и текущих планов деятельности ННЦРЗ;
      <br />4) рассмотрение вопросов по взаимодействию ННЦРЗ с государственными уполномоченными органами, центральными и местными исполнительными органами, научными организациями, высшими учебными заведениями, медицинскими организациями, зарубежными и отечественными компаниями, а также научной и медицинской общественностью по участию в формировании и реализации единой государственной научно-технической и инновационной политики, программных и стратегических документов, определяющих направления научных исследований в области здравоохранения;
      <br />5) изучение и выработка предложений по совершенствованию организации научных и аналитических исследований, инновационных разработок ННЦРЗ; 
      <br />6) популяризация и пропаганда результатов научной, исследовательской деятельности, содействие их коммерциализации;
      <br />7) содействие развития международного сотрудничества в области науки и инноваций в здравоохранении;
      <br />8) содействие повышению эффективности работы ННЦРЗ и его структурных подразделений в области исследовательской деятельности.
      <br />{t('directionsPages.medicalScienceSubpages.council.contactInfo')} 
              </p>
            </div>
            
            <div className="mt-8">
              <FilesAccord 
                folder={t('directionsPages.medicalScienceSubpages.council.folder')}
                title={t('directionsPages.medicalScienceSubpages.council.accordionTitle')}
                bgColor="bg-gray-200"
                defaultOpen={true}
              />
            </div>



      
      <section className="text-gray-600 body-font">
      <div className="container px-5 pt-24 mx-auto">
        <div className="flex flex-col text-left w-full">
          <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-6">{t('directionsPages.medicalScienceSubpages.council.membersTitle')}</h1>
        </div>
        <div className="flex flex-wrap -m-2">
          {allNameDoctors.map((namedoctor, index) =>(
          <NameDoctor key={index} name={namedoctor.name} about={namedoctor.about} />))}
        </div>
      </div>
    </section>
    </div>
    </div>
    </section>
    </>
  );
}

Council.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1={translationService.t('directionsPages.medicalScienceSubpages.council.h1')} 
  parentRoute={route('medical.science')} 
  parentName={translationService.t('directionsPages.medicalScienceSubpages.council.parentName')}
  heroBgColor="bg-gray-200"
  buttonBgColor="bg-gray-200"
  buttonHoverBgColor="hover:bg-gray-300"
  breadcrumbs={[
    { name: translationService.t('directionsPages.medicalScienceSubpages.council.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.council.breadcrumbMedicalScience'), route: 'medical.science' },
    { name: translationService.t('directionsPages.medicalScienceSubpages.council.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>;
