import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import News from '@/Components/News';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';

export default function MedicalAccreditation() {
  return (
    <>
    <Head title="NNCRZ" />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <p className="tracking-wide leading-relaxed">
                    Эффективность, доступность и безопасность — важнейшие аспекты развития здравоохранения в Республике
                    Казахстан. Для обеспечения этих стандартов в ННЦРЗ работает Департамент аккредитации. Аккредитация
                    медицинских организаций — ключевой инструмент для повышения качества медицинских услуг. Процесс
                    включает:
                    <ul className='list-disc list-inside px-12 my-4'>
                        <li>Добровольное участие заявителя.</li>
                        <li>Самооценку на основе стандартов аккредитации и собственных нормативов.</li>
                        <li>Внешнюю оценку качества по установленным стандартам.</li>
                    </ul>
                </p>
            </div>
        </div>
    </section>

    {/* Блок этапов аккредитации */}
    <section className="text-gray-700 body-font">
        <div className="container px-5 py-8 mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8">Этапы подачи заявки</h2>
            
            {/* Шестигранные этапы */}
            <div className="flex flex-col space-y-8 items-center md:items-start">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">1</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Бесплатная консультация по аккредитации</h3>
                        <p>8 (7172) 570-951 (вн.1000, 1143,1127)</p>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">2</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Заявление на прохождение внешней комплексной оценки</h3>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">3</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Расчет стоимости услуг</h3>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">4</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Заключение договора и оплата услуг</h3>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">5</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Прохождение внешней комплексной оценки</h3>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 text-white rounded-lg flex items-center justify-center relative hexagon">
                        <span className="text-xl font-bold">6</span>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold">Свидетельство об аккредитации/мотивированный отказ</h3>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    background: linear-gradient(to bottom, #2a4365 0%, #1a365d 100%);
                }
            `}</style>
        </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 mx-auto">
            <div className='flex md:flex-row flex-wrap'>
                <FolderChlank h1="Руководства" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.guides')} />
                <FolderChlank h1="Эксперты внешней оценки" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.experts')} />
                <FolderChlank h1="Обучающие материалы" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.training')} />
                <FolderChlank h1="Действующие стандарты и критерии аккредитации" color="bg-yellow-200"
                    colorsec="bg-yellow-300" href={route('accreditation.standards')} />
                <FolderChlank h1="Архив стандартов" color="bg-yellow-200" colorsec="bg-yellow-300" href={route('accreditation.archive')} />
            </div>
        </div>
    </section>
    <News />
    <ActualFile 
        title="Проверьте себя в списке аккредитованных медицинских организаций" 
        folder="Accreditation/Reports" 
        bgColor="bg-yellow-100" 
    />
    </>
  )
}

MedicalAccreditation.layout = page => <LayoutDirection img="medicalaccreditation" h1="Аккредитация медицинских организаций">{page}</LayoutDirection>
