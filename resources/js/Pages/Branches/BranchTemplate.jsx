import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { getBranchContacts } from '@/data/branchesContacts';

export default function BranchTemplate({ title, description, branchFolder, address, phone, email }) {
    
    // Получаем контактную информацию из файла данных, если не передана через пропсы
    const contacts = address && phone && email 
        ? { address, phone, email }
        : getBranchContacts(branchFolder) || {
            address: 'г. Нур-Султан, ул. Примерная, 123',
            phone: '+7(7172) 700-000',
            email: branchFolder ? `${branchFolder.toLowerCase()}@nrchd.kz` : 'branch@nrchd.kz'
        };
    
    return (
        <>
            <Head title={title} />
            <LayoutBranch img="branch" h1={title} className="text-white" branchFolder={branchFolder}>
                {/* 1. Блок с текстовой информацией о филиале */}
                <section className="text-gray-600 body-font pb-8">
                    <div className="container px-5 py-12 mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6" data-translate>О филиале</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed" data-translate>
                                {description || "Филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ведущим учреждением в регионе, осуществляющим научно-исследовательскую, образовательную и консультативную деятельность в сфере здравоохранения."}
                            </p>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3" data-translate>Основные направления деятельности:</h3>
                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                    <ul className="list-none space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2 mt-1">•</span>
                                            <span data-translate>Научно-исследовательская работа</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2 mt-1">•</span>
                                            <span data-translate>Образовательная деятельность</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2 mt-1">•</span>
                                            <span data-translate>Экспертно-аналитическая работа</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2 mt-1">•</span>
                                            <span data-translate>Консультативно-методическая помощь организациям здравоохранения</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Контактная информация */}
                <section className="text-gray-600 body-font pb-8">
                    <div className="container px-5 py-12 mx-auto">
                        <div className="bg-blue-100 p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4" data-translate>
                                Контактная информация
                            </h3>
                            
                            <div className="pl-4 border-l-4 border-blue-300 mt-5 mb-5">
                                <p className="font-medium text-gray-700 mb-1" data-translate>{title}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3 mt-1 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1" data-translate>Адрес:</p>
                                            <p className="text-base font-medium" data-translate>{contacts.address}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3 mt-1 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1" data-translate>Телефон:</p>
                                            <a href={`tel:${contacts.phone.replace(/\s/g, '')}`} className="text-base font-medium text-blue-700 hover:underline">{contacts.phone}</a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3 mt-1 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1" data-translate>Электронный адрес:</p>
                                            <a href={`mailto:${contacts.email}`} className="text-base font-medium text-blue-700 hover:underline">{contacts.email}</a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3 mt-1 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1" data-translate>Режим работы:</p>
                                            <p className="text-base font-medium" data-translate>Пн-Пт: 9:00-18:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </LayoutBranch>
        </>
    );
}
