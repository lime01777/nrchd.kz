import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Atyrau() {
    const title = "Атырауский филиал";
    const description = "Атырауский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет координацию деятельности медицинских организаций Атырауской области. Филиал занимается внедрением современных методов управления здравоохранением, проводит мониторинг качества медицинских услуг и участвует в реализации государственных программ в области здравоохранения.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Бектурганов Аскар Муратович",
            position: "Директор Атырауского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7122) 45-00-00",
            email: "atyrau@nrchd.kz",
            bio: "Кандидат медицинских наук. Эксперт в области общественного здравоохранения и организации медицинской помощи."
        },
        {
            name: "Сарсенбаева Динара Кайратовна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7122) 45-00-01",
            email: "d.sarsenbaeva@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и информатизации здравоохранения."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Atyrau"
            leaders={leaders}
        />
    );
}
