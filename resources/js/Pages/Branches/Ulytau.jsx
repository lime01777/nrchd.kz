import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Ulytau() {
    const title = translationService.t('branchesPages.ulytau.title', 'Улытауский филиал');
    const description = translationService.t('branchesPages.ulytau.description', 'Улытауский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Улытауской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Мусинов Серик Жанатович",
            position: "Директор Улытауского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (71064) 5-00-00",
            email: "ulytau@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 10 лет."
        },
        {
            name: "Жанатова Айнагуль Сериковна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (71064) 5-00-01",
            email: "a.zhanatova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области управления качеством медицинских услуг."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Ulytau"
            leaders={leaders}
        />
    );
}
