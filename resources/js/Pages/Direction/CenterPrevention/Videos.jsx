import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import translationService from '@/Services/TranslationService';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function Videos() {
    const t = (key, fallback = '') => translationService.t(key, fallback);
    const title = t('directionsPages.centerPrevention.videosTitle', 'Видеоролики');

    return (
        <>
            <Head title={title} />
            <section className="text-gray-600 body-font py-20 bg-white">
                <div className="container px-5 mx-auto">
                    <div className="max-w-6xl mx-auto">
                        <SimpleFileDisplay
                            folder="CenterPrevention/Videos"
                            title={title}
                            bgColor="bg-white"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

Videos.layout = (page) => {
    return (
        <LayoutFolderChlank
            h1={translationService.t('directionsPages.centerPrevention.videosTitle', 'Видеоролики')}
            parentRoute={route('direction.center_prevention')}
            parentName={translationService.t('directions.center_prevention', 'Центр профилактики')}
            heroBgColor="bg-pink-200"
            heroColorSec="bg-pink-300"
            buttonBgColor="bg-pink-100"
            buttonHoverBgColor="hover:bg-pink-200"
            buttonBorderColor="border-pink-300"
            bgColor="bg-white"
        >
            {page}
        </LayoutFolderChlank>
    );
};
