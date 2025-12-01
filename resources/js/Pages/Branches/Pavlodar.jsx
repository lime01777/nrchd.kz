import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Pavlodar() {
    const title = translationService.t('branchesPages.pavlodar.title', 'Филиал области Павлодар');
    const description = translationService.t('branchesPages.pavlodar.description', 'Павлодарский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Павлодарской области. Филиал проводит мониторинг качества медицинских услуг, координирует деятельность медицинских организаций и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Pavlodar"
        />
    );
}
