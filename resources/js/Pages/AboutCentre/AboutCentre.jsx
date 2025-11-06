import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import NameDoctor from '@/Components/NameDoctor';
import NameDoctorWithPopup from '@/Components/NameDoctorWithPopup';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';
import MainLeadershipCard from '@/Components/MainLeadershipCard';
import SimpleLeadershipCard from '@/Components/SimpleLeadershipCard';
import OrganizationalStructure from '@/Components/OrganizationalStructure';
import { leadershipData, organizationalStructureData } from '@/data/organizationalStructure';
import translationService from '@/services/TranslationService';

export default function AboutCentre() {
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    // Используем данные из отдельного файла
    const leadership = leadershipData;
    const departments = organizationalStructureData;

    const allNameWatchers = [
      { name: "Локшин Вячеслав Нотанович", about: "Президент Казахстанской ассоциации репродуктивной медицины. Доктор медицинских наук, профессор, академик Российской академии медико-технических наук, академик Национальной академии наук Казахстана, специальности – лечебное дело, общественное здравоохранение, акушерство и гинекология."},
      { name: "Султангазиев Тимур Сламжанович", about: "Первый вице-министр здравоохранения Республики Казахстан. Окончил Казахский национальный медицинский университет, специальность «Врач», интернатура по специальности «Общая хирургия», магистратура по специальности «Менеджер системы здравоохранения» в Университете Tulane, США по программе Болашак."},
      { name: "Бакиров Ильяс Келесович", about: "Директор департамента стратегического развития. Мастер делового администрирования (МВА), врач, организатор здравоохранения высшей категории."},
      { name: "Идрисова Салтанат Садыровна", about: "Директор TOO \"Viva Consulting\". МВА «Финансовый менеджмент», докторантура «Менеджмент в здравоохранении», специальности - экономист, юрист. Сертификат профессионального бухгалтера Республики Казахстан. Диплом профессионального внутреннего аудитора DipPIA, медиатор-тренер, коуч, Член ассоциации независимых директоров QID."},
      { name: "Карибеков Темирлан Сибирьевич", about: "Доктор медицинских наук, специальности – лечебное дело, экономика и менеджмент."},
    ];


  return (
    <>
    <Head title={t('aboutCentre.pageTitle')}/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed" dangerouslySetInnerHTML={{__html: t('aboutCentre.history')}}>
          </p>
        </div>
      </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className='flex md:flex-row flex-wrap'>
                <FolderChlank h1={t('aboutCentre.financialReporting')} color="bg-fuchsia-100" colorsec="bg-fuchsia-200" />
            </div>
        </div>
    </section>

    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-8 pb-12 mx-auto">
        <ActualFile 
          folder="О центре/Устав" 
          title={t('aboutCentre.charter')} 
          bgColor="bg-fuchsia-100"
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font">
      <div className="container px-5 pb-8 mx-auto">
        <div className="bg-fuchsia-100 p-6 rounded-lg mb-8">
          <FilesAccord 
            folder="О центре/Стратегия развития" 
            title={t('aboutCentre.developmentStrategy')} 
            bgColor="bg-fuchsia-100"
          />
          <FilesAccord 
            folder="О центре/Политика" 
            title={t('aboutCentre.anticorruptionPolicy')} 
            bgColor="bg-fuchsia-100"
            defaultOpen={true}
          />
          <FilesAccord 
            folder="О центре/Закупки" 
            title={t('aboutCentre.procurement')} 
            bgColor="bg-fuchsia-100"
          />
          <FilesAccord 
            folder="О центре/Нормативные документы" 
            title={t('aboutCentre.regulatoryDocuments')} 
            bgColor="bg-fuchsia-100"
            defaultOpen={true}
          />
        </div>
      </div>
    </section>

    {/* Секция руководства */}
    <section className="text-gray-600 body-font bg-gray-50">
      <div className="container px-5 py-16 mx-auto">
        <div className="flex flex-col text-left w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-bold title-font text-gray-900 mb-4">{t('aboutCentre.leadership.title')}</h1>
          <p className="text-gray-600 max-w-3xl">
            {t('aboutCentre.leadership.description')}
          </p>
        </div>
        {/* Главный руководитель */}
        <div className="mb-12">
          {leadership.filter(leader => leader.isMain).map((leader, index) => (
            <MainLeadershipCard 
              key={index} 
              name={leader.name} 
              position={leader.position} 
              photo={leader.photo} 
              biography={leader.biography}
              contact={leader.contact}
            />
          ))}
        </div>

        {/* Остальное руководство */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Заместители</h3>
          <div className="flex flex-wrap -m-4">
                      {leadership.filter(leader => !leader.isMain).map((leader, index) => (
              <SimpleLeadershipCard 
                key={index} 
                name={leader.name} 
                position={leader.position} 
                photo={leader.photo} 
                contact={leader.contact}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Секция организационной структуры */}
{/*     <section className="text-gray-600 body-font">
      <div className="container px-5 py-16 mx-auto">
        <div className="flex flex-col text-left w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-bold title-font text-gray-900 mb-4">Организационная структура</h1>
          <p className="text-gray-600 max-w-3xl">
            Структура центра организована по департаментному принципу для обеспечения 
            эффективного управления и координации всех направлений деятельности.
          </p>
        </div>
        <OrganizationalStructure departments={departments} />
      </div>
    </section> */}

    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-12 mx-auto">
        <div className="flex flex-col text-left w-full">
          <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-6">Наблюдательный совет</h1>
        </div>
        <div className="flex flex-wrap -m-2">
          {allNameWatchers.map((namewatcher, index) =>(
          <NameDoctor key={index} name={namewatcher.name} about={namewatcher.about} />))}
        </div>
      </div>
    </section>
    <br />

    </>
  )
}

AboutCentre.layout = (page) => <LayoutDirection img="headcentre" h1="О центре">{page}</LayoutDirection>
