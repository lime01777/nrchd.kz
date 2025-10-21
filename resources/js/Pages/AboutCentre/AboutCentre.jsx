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

export default function AboutCentre() {
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
    <Head title="NNCRZ"/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
          Постановлением Правительства Республики Казахстан от 6 августа 2021 года №532 «О некоторых вопросах Министерства здравоохранения Республики Казахстан» республиканское государственное предприятие на праве хозяйственного ведения «Республиканский центр развития здравоохранения» (РЦРЗ) Министерства здравоохранения Республики Казахстан было переименовано в республиканское государственное предприятие на праве хозяйственного ведения «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» Министерства здравоохранения Республики Казахстан.
          <br />Если начать с истории становления, то РЦРЗ был создан в 1994 году в Алматы как Научный центр медицинских и экономических проблем здравоохранения. Правопреемник Центра – Институт развития здравоохранения перебазировался в Астану, а в 2011 году путем объединения с Республиканским информационно-аналитическим центром получил название Республиканского центра развития здравоохранения. У истоков важных направлений в деятельности Центра стояла Салидат Зекеновна Каирбекова.
          <br />Первая женщина-министр здравоохранения Республики Казахстан, государственный и общественный деятель РК, деятель в области здравоохранения, доктор медицинских наук С. Каирбекова посвятила свою жизнь служению людям, проделала колоссальную работу в сфере отечественного здравоохранения.
          <br />В знак признания особых заслуг в сфере отечественного здравоохранения и в целях увековечения памяти Каирбековой С.З. коллектив РЦРЗ совместно с Советом ветеранов Министерства здравоохранения, а также с представителями медицинской общественности вышел с ходатайством о присвоении Центру имени Салидат Каирбековой. 
          <br />Всего за время своей работы Центр внес огромный вклад в развитие системы отечественного здравоохранения, участвуя в разработке и сопровождая методологически реализацию государственных программ, дорожных карт, отраслевых проектов и различных нормативно-правовых актов. 
          <br />Также Центр является рабочим органом Объединенной комиссии по качеству медицинских услуг, рабочим органом Формулярной комиссии, обеспечивая экспертно-аналитическое сопровождение их работы, Национальным координатором по кадровым ресурсам в области здравоохранения.
          </p>
        </div>
      </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className='flex md:flex-row flex-wrap'>
                <FolderChlank h1="Финансовая отчетность" color="bg-fuchsia-100" colorsec="bg-fuchsia-200" />
            </div>
        </div>
    </section>

    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-8 pb-12 mx-auto">
        <ActualFile 
          folder="О центре/Устав" 
          title="Устав национального научного центра развития здравоохранения имени Салидат Каирбековой" 
          bgColor="bg-fuchsia-100"
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font">
      <div className="container px-5 pb-8 mx-auto">
        <div className="bg-fuchsia-100 p-6 rounded-lg mb-8">
          <FilesAccord 
            folder="О центре/Стратегия развития" 
            title="Стратегия развития" 
            bgColor="bg-fuchsia-100"
          />
          <FilesAccord 
            folder="О центре/Политика" 
            title="Антикоррупционная политика" 
            bgColor="bg-fuchsia-100"
            defaultOpen={true}
          />
          <FilesAccord 
            folder="О центре/Закупки" 
            title="Закупки" 
            bgColor="bg-fuchsia-100"
          />
          <FilesAccord 
            folder="О центре/Нормативные документы" 
            title="Нормативные документы" 
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
          <h1 className="sm:text-3xl text-2xl font-bold title-font text-gray-900 mb-4">Руководство центра</h1>
          <p className="text-gray-600 max-w-3xl">
            Наши руководители обеспечивают стратегическое развитие и эффективное управление центром, 
            руководствуясь принципами инновационности и качества медицинских услуг.
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
    <section className="text-gray-600 body-font">
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
    </section>

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
