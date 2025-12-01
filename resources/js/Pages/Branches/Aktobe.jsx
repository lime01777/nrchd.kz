import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Aktobe() {
    const title = translationService.t('branchesPages.aktobe.title', 'Филиал области Актобе');
    const description = translationService.t('branchesPages.aktobe.description', 'Актюбинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой координирует работу медицинских организаций региона, внедряет инновационные методы организации медицинской помощи, проводит научно-практические исследования и образовательные мероприятия для повышения квалификации медицинских работников Актюбинской области.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Aktobe"
        />
    );
}
