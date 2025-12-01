import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Turkestan() {
    const title = translationService.t('branchesPages.turkestan.title', 'Филиал области Туркестан');
    const description = translationService.t('branchesPages.turkestan.description', 'Туркестанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Туркестанской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Turkestan"
        />
    );
}
