import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Mangistau() {
    const title = "Мангистауский филиал";
    const description = "Мангистауский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Мангистауской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества оказываемых услуг и реализует образовательные программы для медицинских работников региона.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Байжанов Медет Аманжолович",
            position: "Директор Мангистауского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7292) 30-00-00",
            email: "mangistau@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в системе здравоохранения более 20 лет."
        },
        {
            name: "Сагинова Сауле Телеугалиевна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7292) 30-00-01",
            email: "s.saginova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области эпидемиологии и организации здравоохранения."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Mangistau"
            leaders={leaders}
        />
    );
}