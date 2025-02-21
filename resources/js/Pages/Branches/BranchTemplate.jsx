import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function BranchTemplate({ title, description }) {
    return (
        <>
            <Head title={title} />
            <LayoutDirection img="branch-hero" h1={title}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                                <p className="mb-4">
                                    {description}
                                </p>
                                {/* Здесь можно добавить дополнительные секции и компоненты */}
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutDirection>
        </>
    );
}
