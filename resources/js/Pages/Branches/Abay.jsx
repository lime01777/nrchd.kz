import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';

export default function Abay() {
    const title = "Филиал области Абай";
    const description = "Филиал области Абай занимается координацией и реализацией государственной политики в сфере здравоохранения на территории области Абай. Филиал осуществляет мониторинг качества медицинских услуг, проводит анализ состояния здоровья населения и разрабатывает рекомендации по улучшению системы здравоохранения в регионе.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Рахимов Саян Мухтарович",
            position: "Директор филиала области Абай",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7222) 50-00-00",
            email: "abay@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 10 лет."
        },
        {
            name: "Нурланова Карлыгаш Есенбаевна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7222) 50-00-01",
            email: "k.nurlanova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области управления качеством медицинских услуг."
        }
    ];
    
    return (
        <>
            <Head title={title} />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-wrap px-12 text-justify">
                        <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </section>
            {page}
                            {/* Страница будет отображаться через layout */}
        </>
    );
}
Abay.layout = (page) => <LayoutBranch 
img={'branch'}
h1={title} 
description={description}
branchFolder="Abay"
leaders={leaders}
>{page}</LayoutBranch>