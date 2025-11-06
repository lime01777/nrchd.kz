import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function East() {
    const title = translationService.t('branchesPages.east.title', 'Восточно-Казахстанский филиал');
    const description = translationService.t('branchesPages.east.description', 'Восточно-Казахстанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Восточно-Казахстанской области. Филиал проводит научно-практические исследования, аналитическую работу и реализует образовательные программы для повышения квалификации медицинских работников региона.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Ермеков Серик Канатович",
            position: "Директор Восточно-Казахстанского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7232) 70-00-00",
            email: "east@nrchd.kz",
            bio: "Кандидат медицинских наук. Заслуженный работник здравоохранения Республики Казахстан."
        },
        {
            name: "Турсунова Айгерим Жанарбековна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7232) 70-00-01",
            email: "a.tursunova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Эксперт в области организации медицинской помощи и эпидемиологии."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="East"
            leaders={leaders}
        />
    );
}
