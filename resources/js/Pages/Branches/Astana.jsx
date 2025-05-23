import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Astana() {
    const title = "Астанинский филиал";
    const description = `Астанинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ведущим региональным центром в сфере развития здравоохранения. Филиал координирует научно-исследовательскую деятельность медицинских организаций города, внедряет инновационные подходы в сфере управления здравоохранением и оказывает консультативно-методическую помощь медицинским организациям столицы.`;
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Сериков Алмаз Булатович",
            position: "Директор Астанинского филиала",
            photo: "/storage/leadership/director-astana.jpg",
            phone: "+7 (7172) 70-09-50",
            email: "astana@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 15 лет."
        },
        {
            name: "Искакова Айгуль Муратовна",
            position: "Заместитель директора по научной работе",
            photo: "/storage/leadership/deputy-astana.jpg",
            phone: "+7 (7172) 70-09-51",
            email: "a.iskakova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и анализа данных."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Astana"
            leaders={leaders}
        />
    );
}
