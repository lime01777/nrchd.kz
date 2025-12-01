import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function West() {
    const title = translationService.t('branchesPages.west.title', 'Филиал Западно-Казахстанской области');
    const description = translationService.t('branchesPages.west.description', 'Западно-Казахстанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Западно-Казахстанской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="West"
        />
    );
}
