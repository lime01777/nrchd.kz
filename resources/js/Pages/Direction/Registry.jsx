import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import HealthTechnologyRegistry from '@/Components/HealthTechnologyRegistry';
import translationService from '@/Services/TranslationService';

const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

export default function Registry({ registryData = [] }) {
    return (
        <>
            <Head title={t('registry.title', 'Реестр технологий здравоохранения')} />
            <HealthTechnologyRegistry registryData={registryData} />
        </>
    );
}

Registry.layout = (page) => <LayoutDirection img="electronichealth" h1={t('registry.title', 'Реестр технологий здравоохранения')}>{page}</LayoutDirection>;
