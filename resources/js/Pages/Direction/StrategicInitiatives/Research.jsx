import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';

export default function Research() {
  return (
    <>
      <Head title="Стратегические исследования и инициативы" />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">Стратегические исследования и инициативы</h2>
            <p className="tracking-wide leading-relaxed mb-4">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой проводит 
              стратегические исследования, направленные на совершенствование системы здравоохранения 
              Казахстана и достижение ключевых показателей здоровья населения.
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              Стратегические исследования и инициативы Центра основаны на анализе текущей ситуации в 
              здравоохранении, изучении международного опыта и передовых практик, а также на прогнозировании 
              будущих тенденций и вызовов в сфере здравоохранения.
            </p>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Основные направления стратегических исследований:</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
              <li>
                <strong>Анализ системы здравоохранения</strong> - комплексная оценка эффективности системы 
                здравоохранения, выявление сильных и слабых сторон, разработка рекомендаций по улучшению.
              </li>
              <li>
                <strong>Эпидемиологические исследования</strong> - изучение распространенности заболеваний, 
                факторов риска и детерминант здоровья населения.
              </li>
              <li>
                <strong>Оценка технологий здравоохранения</strong> - анализ эффективности, безопасности и 
                экономической целесообразности медицинских технологий, лекарственных средств и методов лечения.
              </li>
              <li>
                <strong>Исследования в области организации медицинской помощи</strong> - разработка оптимальных 
                моделей оказания медицинской помощи, включая первичную медико-санитарную помощь, 
                специализированную и высокотехнологичную помощь.
              </li>
              <li>
                <strong>Исследования в области кадровой политики</strong> - анализ потребности в медицинских 
                кадрах, разработка рекомендаций по подготовке и распределению медицинских работников.
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Стратегические инициативы Центра:</h3>
            <p className="tracking-wide leading-relaxed mb-4">
              На основе проводимых исследований Центр разрабатывает и реализует стратегические инициативы, 
              направленные на совершенствование системы здравоохранения Казахстана:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 w-full">
              <li>Программа развития первичной медико-санитарной помощи</li>
              <li>Инициатива по борьбе с неинфекционными заболеваниями</li>
              <li>Программа цифровизации здравоохранения</li>
              <li>Инициатива по развитию медицинского образования и науки</li>
              <li>Программа повышения качества медицинской помощи</li>
            </ul>
            <p className="tracking-wide leading-relaxed mt-4">
              Каждая стратегическая инициатива включает в себя комплекс мероприятий, направленных на достижение 
              конкретных целей и показателей, а также механизмы мониторинга и оценки эффективности.
            </p>
          </div>
        </div>
      </section>
      
      <PageAccordions />
    </>
  );
}

Research.layout = page => <LayoutFolderChlank 
  img="strategy" 
  h1="Стратегические исследования и инициативы" 
  parentRoute={route('strategic.initiatives')} 
  parentName="Стратегические инициативы и международное сотрудничество"
>{page}</LayoutFolderChlank>;
