import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function Pavlodar() {
    const title = translationService.t('branchesPages.pavlodar.title', 'Территориальный департамент области Павлодар');
    const description = translationService.t('branchesPages.pavlodar.description', 'Павлодарский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Павлодарской области. Территориальный департамент проводит мониторинг качества медицинских услуг, координирует деятельность медицинских организаций и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Pavlodar"
        />
    );
}
