import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function HumanResources() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title="Кадровые ресурсы" meta={[{ name: 'description', content: 'Кадровые ресурсы в сфере здравоохранения: информация для медработников, руководителей и выпускников.' }]} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
          <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
            Кадровые ресурсы здравоохранения — не абстрактные значения, а настоящие врачи, медицинские сестры, фармацевты и другие работники системы здравоохранения, которые ежедневно заботятся о нашем здоровье. Чтобы эта система работала слаженно и эффективно, действует Национальная обсерватория кадровых ресурсов здравоохранения (далее - Обсерватория).
          </p>
          
          <div className="w-full overflow-hidden transition-all duration-500 ease-in-out mt-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3" data-translate>Ключевая задача Обсерватории</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Оказание методологического сопровождения государственной политики в области развития кадровых ресурсов здравоохранения путем:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li data-translate>разработки и внедрения инструментов эффективного планирования и прогнозирования потребности в медицинских кадрах;</li>
              <li data-translate>систематического анализа и мониторинга обеспеченности медицинскими кадрами;</li>
              <li data-translate>разработки методических рекомендаций направленных на устойчивое развитие и оптимальное распределение кадровых ресурсов здравоохранения.</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Проводимая работа помогает принимать обоснованные решения и обеспечивает сбалансированное развитие системы здравоохранения.
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3" data-translate>Формирование кадров</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Кадры важно не только удерживать, но и формировать. Таким образом, одним из инструментов, направленных на обеспечение качественной подготовки медицинских специалистов, является размещение государственного образовательного заказа на подготовку кадров в резидентуре. Обсерватория, в свою очередь является рабочим орган Комиссии по размещению государственного образовательного заказа на подготовку медицинских кадров в резидентуре.
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3 mt-6" data-translate>Деятельность экспертной команды в области управления медицинскими кадрами</h3>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              В целях повышения устойчивости кадрового потенциала здравоохранения и обеспечения качественного планирования медицинских ресурсов, команда экспертов осуществляет комплексный подход к анализу и прогнозированию медицинских кадров с учетом региональных особенностей. Работа строится по следующим основным направлениям:
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2" data-translate>1. Подготовка аналитических исследований.</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Эксперты проводят системную оценку кадровой ситуации в регионах с учетом:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li data-translate>текущей потребностей в специалистах;</li>
              <li data-translate>демографического прогноза роста/снижения численности населения;</li>
              <li data-translate>специфики оказываемых медицинских услуг.</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Цель проводимой экспертной работы - формирование объективной картины кадровой обеспеченности, выработка предложений по распределению государственного образовательного заказа на подготовку медицинских кадров в резидентуре.
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2" data-translate>2. Анализ дефицита и оттока медицинских кадров</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Команда изучает причины:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li data-translate>недостаточных условий для профессионального развития;</li>
              <li data-translate>низкого уровня оплаты труда;</li>
              <li data-translate>жилищных проблем;</li>
              <li data-translate>показатели текучести кадров в целом по отрасли, организациях ПМСП;</li>
              <li data-translate>исследует миграцию как внутреннюю, так и внешнюю медицинских кадров.</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Результаты используются для принятия обоснованных политических решений, увеличения мер социальной поддержки.
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2" data-translate>3. Планирование и прогнозирование необходимого количества медицинских кадров</h4>
            <p className="mb-2 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Планирование ведется на кратко- средне- и долгосрочную перспективу. Особое внимание уделяется:
            </p>
            <ul className="list-disc pl-6 mb-3 space-y-1">
              <li data-translate>учету числа работников предпенсионного и пенсионного возраста;</li>
              <li data-translate>динамике заболеваемости росту/снижению;</li>
              <li data-translate>оценке рисков массового выхода из профессии.</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Деятельность экспертной команды направлена на формирование сбалансированной, устойчивой и ориентированной на будущее кадровой политики в здравоохранении.
            </p>
            
            <h3 className="font-bold text-lg text-gray-800 mb-3" data-translate>Основные направления работы Обсерватории</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li data-translate>Мониторинг кадровой обеспеченности, проводит аналитику о состоянии кадровых ресурсов в системе здравоохранения.</li>
              <li data-translate>Разработка подходов и методик по анализу количественного и качественного состава медицинских работников.</li>
              <li data-translate>Прогнозирование кадровых ресурсов здравоохранения.</li>
              <li data-translate>Разработка предложений по совершенствованию нормативно правой базы, регулирующей вопросы кадрового обеспечения.</li>
              <li data-translate>Разработка методических руководств и рекомендаций в области кадровых ресурсов здравоохранения.</li>
            </ul>
            <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
              Внедрение современных HR-технологий управления персоналом – ключ к трансформации кадровых служб в организациях здравоохранения всех уровней.
              Обсерватория помогает при разработке и изучении на уровне медицинских организаций корпоративной политики управления персоналом с внедрением современных HR-технологий, аутсорсинга, определения и эффективности управления, а также качественного рекрутинга.
            </p>
          </div>
          </div>
{/*             <div className="flex justify-center mt-4">
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
            </div> */}
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

HumanResources.layout = (page) => <LayoutDirection img={'humanresources'} h1={'Кадровые ресурсы здравоохранения'} useVideo={true}>{page}</LayoutDirection>;