import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import ChartHead from '@/Components/ChartHead'
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import { Link } from '@inertiajs/react';

export default function HumanResources() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title="Кадровые ресурсы" />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className="tracking-wide leading-relaxed">
            Кадровые ресурсы — не абстрактные единицы, а реальные врачи, медицинские сестры, фармацевты и другие работники системы здравоохранения. Чтобы все они, как одно целое, эффективно заботились о самом главном — здоровье населения, работает Обсерватория кадровых ресурсов здравоохранения.
            Ключевая задача Обсерватории — методологическое сопровождение государственной политики в области развития кадровых ресурсов здравоохранения. Она реализуется благодаря эффективной системе кадрового планирования и прогнозирования, мониторингу кадровой обеспеченности организаций здравоохранения и разработке эффективных управленческих решений по кадровым ресурсам здравоохранения.
            </p>
            
            <div 
              className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
                showFullText ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="tracking-wide mt-4">
                <span className="font-bold text-lg text-gray-800 mb-3 block">Ключевая задача Обсерватории</span>
                Методологическое сопровождение государственной политики в области развития кадровых ресурсов здравоохранения. Она реализуется благодаря эффективной системе кадрового планирования и прогнозирования, мониторингу кадровой обеспеченности организаций здравоохранения и разработке эффективных управленческих решений по кадровым ресурсам здравоохранения.
                <br /><br />
                <span className="font-bold text-lg text-gray-800 mb-3 block">Формирование кадров</span>
                Кадры важно не только удерживать, но и формировать. Поэтому одним из инструментов, направленных на обеспечение качественной подготовки медицинских специалистов, является размещение государственного образовательного заказа на подготовку кадров в резидентуре. Обсерватория, в свою очередь — рабочий орган Комиссии по размещению государственного образовательного заказа на подготовку медицинских кадров в резидентуре.
                <br /><br />
                <span className="font-semibold">Наши специалисты в её составе занимаются:</span>
                <ul className="list-disc pl-6 my-2 space-y-1">
                  <li>подготовкой аналитики с учётом анализа потребности регионов в подготовке клинических специалистов;</li>
                  <li>мониторингом готовности регионов и организаций медицинского образования и науки к размещению государственного заказа;</li>
                  <li>учётом существующего дефицита медицинских кадров и оттока медицинских работников;</li>
                  <li>мониторингом количества медицинских работников предпенсионного и пенсионного возраста.</li>
                </ul>
                <br />
                <span className="font-bold text-lg text-gray-800 mb-3 block">Какие ключевые направления работы Обсерватории кадровых ресурсов?</span>
                <ul className="list-disc pl-6 my-2 space-y-1">
                  <li>Мониторинг кадровой обеспеченности, формирование аналитики о состоянии кадровых ресурсов в системе здравоохранения.</li>
                  <li>Разработка методологических подходов к анализу количественной и качественной составляющих кадрового потенциала.</li>
                  <li>Разработка региональных Карт потребности в медицинских кадрах, включая долгосрочное и среднесрочное прогнозирование кадровых ресурсов здравоохранения.</li>
                  <li>Разработка предложений по совершенствованию законодательной и нормативной правовой базы, регулирующей вопросы кадрового обеспечения, включая методологическое сопровождение внедрения в регионах минимального норматива обеспеченности медицинскими работниками.</li>
                  <li>Прогноз спроса и предложения рабочей силы в здравоохранении на средне- и долгосрочный период.</li>
                  <li>Обеспечение эффективной коммуникации с государственными и местными органами управления, субъектами здравоохранения, научно-исследовательскими центрами и институтами, медицинскими организациями, частными и иностранными компаниями по вопросам управления кадровыми ресурсами.</li>
                  <li>Разработка методических руководств и рекомендаций в области кадровых ресурсов здравоохранения.</li>
                </ul>
                <br />
                <span className="font-bold text-lg text-gray-800 mb-3 block">Как Обсерватория снижает дефицит медицинских кадров?</span>
                <p>Для снижения дефицита медицинских кадров Обсерватория проводит мониторинг исполнения рекомендаций Дорожной карты «О принимаемых мерах по снижению дефицита медицинских кадров в регионах».</p>
                <br />
                <span className="font-bold text-lg text-gray-800 mb-3 block">Как проводится модернизация политики управления медицинским персоналом?</span>
                <p>Внедрение современных HR-технологий управления персоналом – ключ к модернизации кадровых служб в организациях здравоохранения всех уровней. В частности, Обсерватория помогает при разработке и принятии на уровне медицинских организаций корпоративной политики управления персоналом с внедрением HR-бэнчмаркинга, аутсорсинга, управления знаниями и эффективностью, а также качественного рекрутинга.</p>
                <br />
                <span className="font-bold text-lg text-gray-800 mb-3 block">Какие пилотные проекты реализует Обсерватория?</span>
                <p>Проектным офисом на базе Обсерватории реализуются два амбициозных проекта:</p>
                <ul className="list-disc pl-6 my-2 space-y-1">
                  <li>«Укомплектование профессиональными кадрами введенных в эксплуатацию объектов МЦРБ»</li>
                  <li>«Укомплектование медицинскими кадрами введенных в эксплуатацию объектов ПМСП»</li>
                </ul>
              </p>
            </div>
          </div>
            <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setShowFullText(!showFullText)}
                  className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                  rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105">
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

    <section className="text-gray-600 body-font">
        <div className="container pt-8 pb-24 mx-auto">
            <div className="flex md:flex-row flex-wrap">
                <FolderChlank 
                    h1="Выпускникам" 
                    color="bg-red-100" 
                    colorsec="bg-red-200" 
                    href={route('human.resources.graduates')}
                />
                <FolderChlank 
                    h1="Руководителям" 
                    color="bg-red-100" 
                    colorsec="bg-red-200" 
                    href={route('human.resources.managers')}
                />
                <FolderChlank 
                    h1="Медработникам" 
                    color="bg-red-100" 
                    colorsec="bg-red-200" 
                    href={route('human.resources.medical.workers')}
                />
            </div>
        </div>
    </section>
    <ChartHead />
    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}

                <FilesAccord 
                    folder="Кадровые ресурсы/Набор - Кадровый дефицит"
                    title="Кадровый дефицит"
                    bgColor="bg-red-100"
                    defaultOpen={true}
                />
            
            {/* Второй аккордеон */}
            
                <FilesAccord 
                    folder="Кадровые ресурсы/Набор - Планирование и прогнозирвоание кадровых ресурсов здравоохранения"
                    title="Планирование и прогнозирование кадровых ресурсов здравоохранения"
                    bgColor="bg-red-100"
                />
        </div>
    </section>
    </>
  )
}

HumanResources.layout = (page) => <LayoutDirection img={'humanresources'} h1={'Кадровые ресурсы'} useVideo={true}>{page}</LayoutDirection>;