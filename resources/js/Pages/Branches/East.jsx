import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function East() {
    const title = translationService.t('branchesPages.east.title', 'Территориальный департамент Восточно-Казахстанской области');
    const description = translationService.t('branchesPages.east.description', 'Восточно-Казахстанский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Восточно-Казахстанской области. Территориальный департамент проводит научно-практические исследования, аналитическую работу и реализует образовательные программы для повышения квалификации медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="East"
        />
    );
}
