import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function West() {
    const title = "Западно-Казахстанский филиал";
    const description = "Западно-Казахстанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Западно-Казахстанской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Досмуханов Аскар Талгатович",
            position: "Директор Западно-Казахстанского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7112) 51-00-00",
            email: "west@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 12 лет."
        },
        {
            name: "Жумабаева Динара Ерболатовна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7112) 51-00-01",
            email: "d.zhumabaeva@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и анализа данных."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="West"
            leaders={leaders}
        />
    );
}
