import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Pavlodar() {
    const title = "Павлодарский филиал";
    const description = "Павлодарский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Павлодарской области. Филиал проводит мониторинг качества медицинских услуг, координирует деятельность медицинских организаций и реализует образовательные программы для медицинских работников региона.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Искаков Самат Каримович",
            position: "Директор Павлодарского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7182) 32-00-00",
            email: "pavlodar@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере здравоохранения более 18 лет."
        },
        {
            name: "Казантаева Жанар Сериковна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7182) 32-00-01",
            email: "zh.kazantaeva@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и анализа данных."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Pavlodar"
            leaders={leaders}
        />
    );
}
