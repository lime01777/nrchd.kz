import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";

export default function MedicalStatistics() {
    return (
        <LayoutDirection img="static" h1="Медицинская статистика">
            <Head title="Медицинская статистика | NNCRZ" />
            
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Национальный научный центр развития здравоохранения им. Салидат Каирбековой предоставляет 
                        актуальные статистические данные в области здравоохранения Республики Казахстан.
                    </p>
                </div>
                
                <div className="flex flex-wrap -m-4">
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Демографические показатели</h1>
                                <p className="leading-relaxed mb-3">Данные о рождаемости, смертности, продолжительности жизни и других демографических показателях.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Заболеваемость</h1>
                                <p className="leading-relaxed mb-3">Статистические данные о распространенности различных заболеваний среди населения Казахстана.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Ресурсы здравоохранения</h1>
                                <p className="leading-relaxed mb-3">Информация о медицинских учреждениях, кадровых ресурсах и материально-техническом обеспечении.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Финансирование здравоохранения</h1>
                                <p className="leading-relaxed mb-3">Данные о государственных расходах на здравоохранение и источниках финансирования.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Качество медицинской помощи</h1>
                                <p className="leading-relaxed mb-3">Показатели качества и доступности медицинских услуг в Республике Казахстан.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 lg:w-1/3 md:w-1/2">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">СТАТИСТИКА</h2>
                                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Аналитические отчеты</h1>
                                <p className="leading-relaxed mb-3">Комплексные отчеты и аналитические материалы по различным аспектам здравоохранения.</p>
                                <div className="flex items-center flex-wrap">
                                    <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">Подробнее
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutDirection>
    );
}
