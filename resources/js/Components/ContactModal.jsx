import React from 'react';
import { usePage } from '@inertiajs/react';
import KeyValue from './KeyValue';

export default function ContactModal({ isOpen, onClose, clinic }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {t('clinics.contact_info')}
                                </h3>
                                
                                <div className="space-y-4">
                                    {clinic.address && (
                                        <KeyValue
                                            label={t('clinics.address')}
                                            value={clinic.address}
                                            icon="location"
                                        />
                                    )}
                                    
                                    {clinic.phone && (
                                        <KeyValue
                                            label={t('clinics.phone')}
                                            value={clinic.phone}
                                            icon="phone"
                                            isLink
                                            linkType="tel"
                                        />
                                    )}
                                    
                                    {clinic.email && (
                                        <KeyValue
                                            label={t('clinics.email')}
                                            value={clinic.email}
                                            icon="email"
                                            isLink
                                            linkType="mailto"
                                        />
                                    )}
                                    
                                    {clinic.website && (
                                        <KeyValue
                                            label={t('clinics.website')}
                                            value={clinic.website}
                                            icon="globe"
                                            isLink
                                            linkType="url"
                                        />
                                    )}

                                    {clinic.working_hours && Object.keys(clinic.working_hours).length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-2">
                                                {t('clinics.working_hours')}
                                            </p>
                                            <div className="space-y-1">
                                                {Object.entries(clinic.working_hours).map(([day, hours]) => (
                                                    <div key={day} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">{day}</span>
                                                        <span className="font-medium">{hours}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
