import React, { useState } from 'react';
import Overview from './Overview';
import NormativeBase from './NormativeBase';
import Algorithm from './Algorithm';
import Registry from './Registry';
import PilotSites from './PilotSites';
import SubmissionForm from './SubmissionForm';

/**
 * Основной компонент технологической платформы MedTech
 * Содержит табы для навигации между разделами
 */
export default function MedTechPlatform({ 
    documents = [],
    registry = [],
    pilotSites = [],
    content = {},
    algorithmImage = null 
}) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Обзор платформы' },
        { id: 'normative', label: 'Нормативная база' },
        { id: 'algorithm', label: 'Алгоритм внедрения' },
        { id: 'registry', label: 'Реестр технологий' },
        { id: 'pilot-sites', label: 'Пилотные площадки' },
        { id: 'submission', label: 'Как подать технологию' },
    ];

    const scrollToSection = (tabId) => {
        setActiveTab(tabId);
        // Плавная прокрутка к секции
        const element = document.getElementById(`medtech-${tabId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="medtech-platform bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Технологическая платформа MedTech
            </h2>

            {/* Горизонтальное навигационное меню (табы) */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px overflow-x-auto" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => scrollToSection(tab.id)}
                            className={`
                                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Контентные блоки */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div id="medtech-overview">
                        <Overview 
                            onViewRegistry={() => scrollToSection('registry')}
                            onSubmitTechnology={() => scrollToSection('submission')}
                        />
                    </div>
                )}

                {activeTab === 'normative' && (
                    <div id="medtech-normative">
                        <NormativeBase documents={documents} />
                    </div>
                )}

                {activeTab === 'algorithm' && (
                    <div id="medtech-algorithm">
                        <Algorithm 
                            image={algorithmImage}
                            steps={content.algorithm_steps || []}
                            indicators={content.algorithm_indicators || []}
                        />
                    </div>
                )}

                {activeTab === 'registry' && (
                    <div id="medtech-registry">
                        <Registry registry={registry} />
                    </div>
                )}

                {activeTab === 'pilot-sites' && (
                    <div id="medtech-pilot-sites">
                        <PilotSites pilotSites={pilotSites} />
                    </div>
                )}

                {activeTab === 'submission' && (
                    <div id="medtech-submission">
                        <SubmissionForm />
                    </div>
                )}
            </div>
        </div>
    );
}

