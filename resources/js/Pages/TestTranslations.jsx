import React from 'react';
import { Head } from '@inertiajs/react';
import DropdownLanguageSwitcher from '@/Components/DropdownLanguageSwitcher';
import TestTranslations from '@/Components/TestTranslations';

export default function TestTranslationsPage({ auth, locale, translations }) {
    return (
        <>
            <Head title="Тест переводов" />
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Тест системы переводов</h1>
                                <DropdownLanguageSwitcher />
                            </div>
                            <TestTranslations />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
