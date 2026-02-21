import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function Turkestan() {
    const title = translationService.t('branchesPages.turkestan.title', 'Территориальный департамент области Туркестан');
    const description = translationService.t('branchesPages.turkestan.description', 'Туркестанский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Туркестанской области. Территориальный департамент координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Turkestan"
        />
    );
}
