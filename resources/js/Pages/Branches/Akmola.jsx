import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Akmola() {
    const title = translationService.t('branchesPages.akmola.title', 'Филиал области Акмола');
    const description = translationService.t('branchesPages.akmola.description', 'Акмолинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Акмолинской области, проводит мониторинг и оценку качества медицинских услуг, участвует в разработке и внедрении инновационных методов организации медицинской помощи населению.');
    
    return (
        <BranchTemplate 
            img={'branch'}
            overlay={0.8}
            title={<span className="text-primary">{title}</span>} 
            description={description}
            branchFolder="Akmola"
        />
    );
}
