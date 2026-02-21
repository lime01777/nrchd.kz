import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import translationService from '@/Services/TranslationService';
import FileAccordTitle from '@/Components/FileAccordTitle';
import Modal from '@/Components/UI/Modal';

export default function Communications() {
    const [pageTitle, setPageTitle] = useState('');
    const [title, setTitle] = useState('');
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');
    const [item4, setItem4] = useState('');
    const [infographicsTitle, setInfographicsTitle] = useState('');
    const [videosTitle, setVideosTitle] = useState('');
    const [openInfographics, setOpenInfographics] = useState(false);
    const [openVideos, setOpenVideos] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Глобальная функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };

    useEffect(() => {
        const updateTranslations = () => {
            setPageTitle(t('directionsPages.centerPrevention.column3Title', 'Коммуникации и просвещение'));
            setTitle(t('directionsPages.centerPrevention.column3Title', 'Коммуникации и просвещение'));
            setItem1(t('directionsPages.centerPrevention.column3Item1', 'Мероприятия'));
            setItem2(t('directionsPages.centerPrevention.column3Item2', 'Видеоролики'));
            setItem3(t('directionsPages.centerPrevention.column3Item3', 'Информационно-разъяснительная работа'));
            setItem4(t('directionsPages.centerPrevention.column3Item4', 'Инфографика, публикации, подкасты'));

            setInfographicsTitle(t('directionsPages.centerPrevention.infographicsTitle', 'Инфографики'));
            setVideosTitle(t('directionsPages.centerPrevention.videosTitle', 'Видеоролики'));
        };

        updateTranslations();
        window.addEventListener('languageChanged', updateTranslations);

        return () => {
            window.removeEventListener('languageChanged', updateTranslations);
        };
    }, []);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const downloadFile = (url, name) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Head title={pageTitle} />

            <section className="text-gray-600 body-font py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

                        <div className="w-full md:w-2/3 lg:w-1/2 mb-10 text-center">
                            <div className="aspect-square mx-auto rounded-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-white shadow-lg max-w-sm">
                                <img src="/img/CenterPrevention/col3.png" alt={title} className="object-cover w-full h-full" />
                            </div>
                        </div>

                        <div className="w-full md:w-2/3 lg:w-1/2 mb-12">
                            <ul className="list-disc list-inside space-y-4 text-lg text-gray-700 bg-gray-50 p-8 rounded-xl shadow-inner">
                                {item1 && <li className="pl-2">{item1}</li>}
                                {item2 && <li className="pl-2">{item2}</li>}
                                {item3 && <li className="pl-2">{item3}</li>}
                                {item4 && <li className="pl-2">{item4}</li>}
                            </ul>

                            {/* Аккордеон Инфографики */}
                            <div className="mt-8 bg-blue-50 rounded-lg overflow-hidden">
                                <FileAccordTitle
                                    title={infographicsTitle}
                                    isOpen={openInfographics}
                                    toggleOpen={() => setOpenInfographics(!openInfographics)}
                                />
                                {openInfographics && (
                                    <div className="p-4">
                                        <ul className="space-y-2">
                                            <li>
                                                <button
                                                    onClick={() => openModal({
                                                        type: 'infographic',
                                                        title: 'Инфографика 1',
                                                        // ... data ...
                                                    })}
                                                    className="text-blue-600 hover:text-blue-800 underline text-left"
                                                >
                                                    Инфографика 1
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Аккордеон Видеоролики */}
                            <div className="mt-4 bg-blue-50 rounded-lg overflow-hidden">
                                <FileAccordTitle
                                    title={videosTitle}
                                    isOpen={openVideos}
                                    toggleOpen={() => setOpenVideos(!openVideos)}
                                />
                                {openVideos && (
                                    <div className="p-4">
                                        <ul className="space-y-2">
                                            <li>
                                                <button
                                                    onClick={() => openModal({
                                                        type: 'video',
                                                        title: 'Видеоролик 1',
                                                        // ... data ...
                                                    })}
                                                    className="text-blue-600 hover:text-blue-800 underline text-left"
                                                >
                                                    Видеоролик 1
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Модальное окно */}
            <Modal show={modalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {selectedItem?.title || 'Выберите действие'}
                        </h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Content similar to parent... simplified for brevity layout */}
                    <div className="text-center p-4">Content placeholder</div>
                </div>
            </Modal>
        </>
    );
}

Communications.layout = (page) => {
    const h1 = translationService.t('directions.center_prevention', 'Центр профилактики и укрепления здоровья');
    return <LayoutDirection img="zozh" h1={h1}>{page}</LayoutDirection>;
};
