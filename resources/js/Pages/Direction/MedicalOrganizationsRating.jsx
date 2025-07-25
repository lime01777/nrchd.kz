import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import FolderChlank from '@/Components/FolderChlank';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FilesAccord from '@/Components/FilesAccord';
import PageAccordions from "@/Components/PageAccordions";

export default function MedicalOrganizationsRating() {
    return (
        <>
            <Head title="Рейтинг медицинских организаций" />
            <PageHeader title="Рейтинг медицинских организаций" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">Рейтинг медицинских организаций</h2>
                            
                            <p className="mb-4">
                                Рейтинг медицинских организаций представляет собой систему оценки качества и эффективности работы 
                                медицинских учреждений в Республике Казахстан. Данная система позволяет объективно оценивать 
                                деятельность организаций здравоохранения на основе ключевых показателей.
                            </p>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-medium mb-4">Основные цели рейтинга:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Повышение качества медицинских услуг</li>
                                    <li>Стимулирование конкуренции между медицинскими организациями</li>
                                    <li>Обеспечение прозрачности в оценке деятельности медицинских учреждений</li>
                                    <li>Предоставление населению информации для выбора медицинской организации</li>
                                </ul>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-medium mb-4">Критерии оценки:</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Качество медицинской помощи</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Клинические показатели</li>
                                            <li>Безопасность пациентов</li>
                                            <li>Соблюдение клинических протоколов</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Удовлетворенность пациентов</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Опросы пациентов</li>
                                            <li>Обратная связь</li>
                                            <li>Количество жалоб</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Ресурсное обеспечение</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Материально-техническая база</li>
                                            <li>Кадровое обеспечение</li>
                                            <li>Информационные технологии</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Эффективность управления</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Финансовые показатели</li>
                                            <li>Оптимизация процессов</li>
                                            <li>Инновационная деятельность</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10">
                                <p className="italic text-gray-600">
                                    Информация о текущем рейтинге медицинских организаций обновляется ежеквартально. 
                                    Для получения подробной информации о методологии рейтинга и текущих результатах, 
                                    пожалуйста, обратитесь в соответствующий отдел ННЦРЗ им. С. Каирбековой.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

MedicalOrganizationsRating.layout = (page) => <LayoutDirection img={'reiting'} h1={'Оценка медицинских технологий'}>{page}</LayoutDirection>
