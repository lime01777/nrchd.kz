import React from 'react';
import useI18n from '../Utils/useI18n';

const DocumentCards = ({ documents, title, bgColor = 'bg-purple-100' }) => {
    const { t } = useI18n();
    return (
        <div className={`${bgColor} p-6 rounded-lg shadow-md mb-6`}>
            {title && <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {documents.map((doc, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md"
                    >
                        <h3 className="text-md font-medium text-gray-800 mb-4 h-24 overflow-hidden">{doc.title}</h3>
                        <div className="flex justify-end">
                            <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-purple-600 hover:text-purple-800 inline-flex items-center border border-purple-600 px-4 py-2 rounded-lg transition-all hover:bg-purple-50"
                            >
                                {t('common.open')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentCards;
