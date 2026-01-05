import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/ziggy-helper';

export default function ClinicCard({ clinic }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    const name = clinic.name || '';
    const description = clinic.short_desc || '';
    const image = clinic.logo_url || clinic.hero_url || '/img/clinics/default-clinic.jpg';
    const specialties = clinic.specialties || [];
    const address = clinic.address || '';
    const phone = clinic.phone || '';
    const slug = clinic.slug || '';
    const detailsButton = t('clinics.view_details', 'Подробнее');

    return (
        <Link 
            href={route('clinics.show.public', slug)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col block"
        >
            <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
                <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/img/clinics/default-clinic.jpg';
                    }}
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {name}
                </h4>
                {description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {description}
                    </p>
                )}
                {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {specialties.map((specialty, index) => (
                            <span 
                                key={index}
                                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                                {specialty}
                            </span>
                        ))}
                    </div>
                )}
                {address && (
                    <p className="text-gray-500 text-xs mb-2">
                        📍 {address}
                    </p>
                )}
                {phone && (
                    <p className="text-gray-500 text-xs mb-3">
                        📞 {phone}
                    </p>
                )}
                <span className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-center mt-auto inline-block">
                    {detailsButton}
                </span>
            </div>
        </Link>
    );
}
