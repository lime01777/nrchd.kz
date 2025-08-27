import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import MediaGallery from './MediaGallery';
import ContactModal from './ContactModal';
import KeyValue from './KeyValue';

export default function ClinicDetail({ clinic }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
    const [activeTab, setActiveTab] = useState('about');
    const [showContactModal, setShowContactModal] = useState(false);

    const tabs = [
        { id: 'about', label: t('clinics.tabs.about'), icon: 'info' },
        { id: 'services', label: t('clinics.tabs.services'), icon: 'medical' },
        { id: 'specialties', label: t('clinics.tabs.specialties'), icon: 'heart' },
        { id: 'equipment', label: t('clinics.tabs.equipment'), icon: 'cog' },
        { id: 'doctors', label: t('clinics.tabs.doctors'), icon: 'users' },
        { id: 'accreditations', label: t('clinics.tabs.accreditations'), icon: 'certificate' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'about':
                return (
                    <div className="prose max-w-none">
                        {clinic.full_desc ? (
                            <div dangerouslySetInnerHTML={{ __html: clinic.full_desc }} />
                        ) : (
                            <p className="text-gray-600">{clinic.short_desc}</p>
                        )}
                    </div>
                );
            
            case 'services':
                return clinic.services && clinic.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clinic.services.map((service, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-800">{service}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('clinics.no_services')}</p>
                );
            
            case 'specialties':
                return clinic.specialties && clinic.specialties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clinic.specialties.map((specialty, index) => (
                            <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-gray-800 font-medium">{specialty}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('clinics.no_specialties')}</p>
                );
            
            case 'equipment':
                return clinic.equipment && clinic.equipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clinic.equipment.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-800">{item}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('clinics.no_equipment')}</p>
                );
            
            case 'doctors':
                return clinic.doctors && clinic.doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clinic.doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-200">
                                    {doctor.photo_url ? (
                                        <img
                                            src={doctor.photo_url}
                                            alt={doctor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">{doctor.name}</h4>
                                    {doctor.position && (
                                        <p className="text-sm text-gray-600 mb-3">{doctor.position}</p>
                                    )}
                                    {doctor.contacts && (
                                        <div className="space-y-1 text-sm">
                                            {doctor.contacts.phone && (
                                                <a href={`tel:${doctor.contacts.phone}`} className="block text-blue-600 hover:text-blue-800">
                                                    {doctor.contacts.phone}
                                                </a>
                                            )}
                                            {doctor.contacts.email && (
                                                <a href={`mailto:${doctor.contacts.email}`} className="block text-blue-600 hover:text-blue-800">
                                                    {doctor.contacts.email}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('clinics.no_doctors')}</p>
                );
            
            case 'accreditations':
                return clinic.accreditations && clinic.accreditations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clinic.accreditations.map((accreditation, index) => (
                            <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-gray-800 font-medium">{accreditation}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">{t('clinics.no_accreditations')}</p>
                );
            
            default:
                return null;
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Header */}
                            <div className="flex items-start space-x-4 mb-6">
                                {clinic.logo_url && (
                                    <img
                                        src={clinic.logo_url}
                                        alt={`${clinic.name} logo`}
                                        className="w-16 h-16 bg-white rounded-lg shadow-sm object-contain"
                                    />
                                )}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {clinic.name}
                                    </h1>
                                    {clinic.city && (
                                        <p className="text-lg text-gray-600 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {clinic.city}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                            </div>

                            {/* Hero Image */}
                            {clinic.hero_url && (
                                <div className="mb-8">
                                    <img
                                        src={clinic.hero_url}
                                        alt={clinic.name}
                                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                {/* Working Hours */}
                                {clinic.working_hours && Object.keys(clinic.working_hours).length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {t('clinics.working_hours')}
                                        </h3>
                                        <div className="space-y-2">
                                            {Object.entries(clinic.working_hours).map(([day, hours]) => (
                                                <div key={day} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{day}</span>
                                                    <span className="font-medium">{hours}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    {t('clinics.contact_clinic')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="py-8">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            {clinic.gallery_urls && clinic.gallery_urls.length > 0 && (
                <div className="bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {t('clinics.gallery')}
                        </h2>
                        <MediaGallery images={clinic.gallery_urls} />
                    </div>
                </div>
            )}

            {/* Map Section */}
            {clinic.map_lat && clinic.map_lng && (
                <div className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {t('clinics.location')}
                        </h2>
                        <div className="h-96 bg-gray-200 rounded-lg">
                            {/* Здесь можно интегрировать карту (Google Maps, Yandex Maps и т.д.) */}
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p>Карта будет отображаться здесь</p>
                                    <p className="text-sm">Координаты: {clinic.map_lat}, {clinic.map_lng}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            <ContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                clinic={clinic}
            />
        </>
    );
}
