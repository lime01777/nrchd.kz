import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Aktobe() {
    const title = translationService.t('branchesPages.aktobe.title', 'Актюбинский филиал');
    const description = translationService.t('branchesPages.aktobe.description', 'Актюбинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой координирует работу медицинских организаций региона, внедряет инновационные методы организации медицинской помощи, проводит научно-практические исследования и образовательные мероприятия для повышения квалификации медицинских работников Актюбинской области.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Абдрахманов Марат Кадырович",
            position: "Директор Актюбинского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7132) 56-00-00",
            email: "aktobe@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 12 лет."
        },
        {
            name: "Жанузакова Алия Сериковна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7132) 56-00-01",
            email: "a.zhanuzakova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Опыт работы в управлении здравоохранением более 8 лет."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Aktobe"
            leaders={leaders}
        />
    );
}
