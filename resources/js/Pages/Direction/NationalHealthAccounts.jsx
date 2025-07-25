import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import FolderChlank from '@/Components/FolderChlank';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FilesAccord from '@/Components/FilesAccord';
import PageAccordions from "@/Components/PageAccordions";

export default function NationalHealthAccounts() {
    return (
        <>
            <Head title="Национальные счета здравоохранения" />
            <PageHeader title="Национальные счета здравоохранения" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">Национальные счета здравоохранения</h2>
                            
                            <p className="mb-4">
                                Национальные счета здравоохранения (НСЗ) представляют собой систему учета и анализа расходов на здравоохранение 
                                в Республике Казахстан. Эта система позволяет отслеживать финансовые потоки в сфере здравоохранения, 
                                оценивать эффективность расходования средств и принимать обоснованные решения по финансированию отрасли.
                            </p>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-medium mb-4">Основные цели НСЗ:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Обеспечение прозрачности финансовых потоков в системе здравоохранения</li>
                                    <li>Оценка эффективности использования ресурсов здравоохранения</li>
                                    <li>Предоставление информации для принятия стратегических решений</li>
                                    <li>Мониторинг достижения целей в области здравоохранения</li>
                                </ul>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-medium mb-4">Структура НСЗ:</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Источники финансирования</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Государственный бюджет</li>
                                            <li>Фонд социального медицинского страхования</li>
                                            <li>Частные расходы граждан</li>
                                            <li>Добровольное медицинское страхование</li>
                                            <li>Внешние источники (международные организации)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Поставщики медицинских услуг</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Больницы</li>
                                            <li>Амбулаторно-поликлинические организации</li>
                                            <li>Организации долгосрочного ухода</li>
                                            <li>Аптеки</li>
                                            <li>Другие поставщики медицинских услуг</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Функции здравоохранения</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Лечебная помощь</li>
                                            <li>Реабилитация</li>
                                            <li>Профилактика</li>
                                            <li>Управление и администрирование</li>
                                            <li>Образование и научные исследования</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Факторы производства</h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            <li>Оплата труда медицинских работников</li>
                                            <li>Лекарственные средства и медицинские изделия</li>
                                            <li>Капитальные затраты</li>
                                            <li>Другие ресурсы</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10">
                                <p className="italic text-gray-600">
                                    ННЦРЗ им. С. Каирбековой проводит регулярный анализ и публикует отчеты по национальным счетам здравоохранения. 
                                    Для получения подробной информации о методологии НСЗ и текущих отчетах, пожалуйста, обратитесь 
                                    в соответствующий отдел центра.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

NationalHealthAccounts.layout = (page) => <LayoutDirection img={'reiting'} h1={'Оценка медицинских технологий'}>{page}</LayoutDirection>
