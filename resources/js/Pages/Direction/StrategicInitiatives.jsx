import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';

// Функция для получения перевода - перемещена в глобальную область видимости
const t = (key, fallback = '') => {
    // Получаем translations из window.__INERTIA_PROPS__ или используем fallback
    const translations = window.__INERTIA_PROPS__?.translations || {};
    return translations[key] || fallback;
};

export default function StrategicInitiatives() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода внутри компонента
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
  return (
    <>
      <Head title="NNCRZ" meta={[{ name: 'description', content: 'Стратегические инициативы ННЦРЗ: проекты, партнерства, экспертный совет, коалиция и ключевые направления развития.' }]} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed">

            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
          <div className='flex md:flex-row flex-wrap'>
            <FolderChlank h1="Инициативы" color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.initiatives')} />
            <FolderChlank h1="Партнерство" color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.partnership')} />
            <FolderChlank h1="Экспертный совет" color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.expert')} />
            <FolderChlank h1="Коалиция" color="bg-green-100" colorsec="bg-green-200" href={route('strategic.initiatives.coalition')} />
          </div>
        </div>
      </section>
    </>
  );
}

StrategicInitiatives.layout = page => <LayoutDirection img="strategy" h1={t('directions.strategic_initiatives', 'Стратегические инициативы и международное сотрудничество')} useVideo={true}>{page}</LayoutDirection>;
