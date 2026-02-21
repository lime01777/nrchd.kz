import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function AlmatyRegion() {
    const title = translationService.t('branchesPages.almatyRegion.title', 'Территориальный департамент Алматинской области');
    const description = translationService.t('branchesPages.almatyRegion.description', 'Территориальный департамент Алматинской области Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическую поддержку системы здравоохранения Алматинской области. Территориальный департамент координирует деятельность медицинских организаций, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="AlmatyRegion"
        />
    );
}