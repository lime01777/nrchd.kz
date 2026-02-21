import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function West() {
    const title = translationService.t('branchesPages.west.title', 'Территориальный департамент Западно-Казахстанской области');
    const description = translationService.t('branchesPages.west.description', 'Западно-Казахстанский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Западно-Казахстанской области. Территориальный департамент координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="West"
        />
    );
}
