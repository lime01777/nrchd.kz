import React from 'react';
import BranchTemplate from './BranchTemplate';
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
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Abay"
            leaders={leaders}
        />
    );
}
