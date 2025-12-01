import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function North() {
    const title = translationService.t('branchesPages.north.title', 'Филиал Северо-Казахстанской области');
    const description = translationService.t('branchesPages.north.description', 'Северо-Казахстанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Северо-Казахстанской области. Филиал координирует деятельность медицинских учреждений региона, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="North"
        />
    );
}
