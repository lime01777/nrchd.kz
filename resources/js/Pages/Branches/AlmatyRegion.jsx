import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function AlmatyRegion() {
    const title = "Филиал Алматинской области";
    const description = "Филиал Алматинской области Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическую поддержку системы здравоохранения Алматинской области. Филиал координирует деятельность медицинских организаций, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Тургунов Дамир Аманжолович",
            position: "Директор филиала Алматинской области",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (728) 300-00-00",
            email: "almaty.region@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт руководящей работы в сфере здравоохранения более 10 лет."
        },
        {
            name: "Омарова Айгуль Бахытовна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (728) 300-00-01",
            email: "a.omarova@nrchd.kz",
            bio: "Магистр здравоохранения. Специалист в области общественного здоровья и эпидемиологии."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="AlmatyRegion"
            leaders={leaders}
        />
    );
}