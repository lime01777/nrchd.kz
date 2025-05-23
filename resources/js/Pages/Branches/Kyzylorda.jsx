import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Kyzylorda() {
    const title = "Кызылординский филиал";
    const description = "Кызылординский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет координацию и методическое сопровождение медицинских организаций Кызылординской области. Филиал проводит мониторинг качества медицинских услуг, реализует образовательные программы и участвует в реализации государственных программ в области здравоохранения.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Жанабаев Нурлан Еркинович",
            position: "Директор Кызылординского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7242) 26-00-00",
            email: "kyzylorda@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 12 лет."
        },
        {
            name: "Турсынбекова Айна Бекболатовна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7242) 26-00-01",
            email: "a.tursynbekova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области организации первичной медицинской помощи."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Kyzylorda"
            leaders={leaders}
        />
    );
}
