import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ClinicCard from '@/Components/ClinicCard';
import SearchInput from '@/Components/SearchInput';
import Select from '@/Components/Select';
import Pagination from '@/Components/Pagination';

export default function ClinicsIndex({ clinics, filters, filterOptions, pagination }) {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };
    const [localFilters, setLocalFilters] = useState(filters);

    // Обновляем фильтры при изменении
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.visit(route('clinics'), {
                data: localFilters,
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localFilters]);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearchChange = (value) => {
        setLocalFilters(prev => ({
            ...prev,
            search: value
        }));
    };

    return (
        <>
            <Head>
                <title>{t('clinics.title')} - NRCHD</title>
                <meta name="description" content={t('clinics.description')} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                {t('clinics.title')}
                            </h1>
                            <p className="mt-3 text-lg text-gray-600">
                                {t('clinics.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <SearchInput
                                    value={localFilters.search}
                                    onChange={handleSearchChange}
                                    placeholder={t('clinics.search_placeholder')}
                                />
                            </div>

                            {/* City Filter */}
                            <Select
                                value={localFilters.city}
                                onChange={(value) => handleFilterChange('city', value)}
                                options={[
                                    { value: 'all', label: t('clinics.all_cities') },
                                    ...filterOptions.cities
                                ]}
                                placeholder={t('clinics.select_city')}
                            />

                            {/* Specialty Filter */}
                            <Select
                                value={localFilters.specialty}
                                onChange={(value) => handleFilterChange('specialty', value)}
                                options={[
                                    { value: 'all', label: t('clinics.all_specialties') },
                                    ...filterOptions.specialties
                                ]}
                                placeholder={t('clinics.select_specialty')}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            {t('clinics.found_count', { count: pagination.total })}
                        </p>
                    </div>

                    {/* Clinics Grid */}
                    {clinics.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clinics.data.map((clinic) => (
                                <ClinicCard key={clinic.id} clinic={clinic} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {t('clinics.no_results_title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('clinics.no_results_description')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={pagination.current_page}
                                lastPage={pagination.last_page}
                                total={pagination.total}
                                perPage={pagination.per_page}
                                onPageChange={(page) => {
                                    router.visit(route('clinics'), {
                                        data: { ...localFilters, page },
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
