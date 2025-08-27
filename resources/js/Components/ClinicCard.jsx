import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Chips from './Chips';

export default function ClinicCard({ clinic }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
                {clinic.hero_url ? (
                    <img
                        src={clinic.hero_url}
                        alt={clinic.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                )}
                
                {/* Logo overlay */}
                {clinic.logo_url && (
                    <div className="absolute top-4 left-4">
                        <img
                            src={clinic.logo_url}
                            alt={`${clinic.name} logo`}
                            className="w-12 h-12 bg-white rounded-lg shadow-sm object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title and City */}
                <div className="mb-3">
                    <Link
                        href={route('clinics.show.public', clinic.slug)}
                        className="block group"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {clinic.name}
                        </h3>
                    </Link>
                    {clinic.city && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {clinic.city}
                        </p>
                    )}
                </div>

                {/* Description */}
                {clinic.short_desc && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {clinic.short_desc}
                    </p>
                )}

                {/* Specialties */}
                {clinic.specialties && clinic.specialties.length > 0 && (
                    <div className="mb-4">
                        <Chips
                            items={clinic.specialties}
                            maxVisible={3}
                            moreLabel={`+${clinic.specialties_count - 3}`}
                        />
                    </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                    {clinic.phone && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${clinic.phone}`} className="hover:text-blue-600 transition-colors">
                                {clinic.phone}
                            </a>
                        </div>
                    )}
                    
                    {clinic.email && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${clinic.email}`} className="hover:text-blue-600 transition-colors">
                                {clinic.email}
                            </a>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-6">
                    <Link
                        href={route('clinics.show.public', clinic.slug)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {t('clinics.view_details')}
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
