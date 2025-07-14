import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

export default function ZiggyTest() {
    const [routeInfo, setRouteInfo] = useState({
        hasRoute: false,
        homeRoute: '',
        error: null
    });

    useEffect(() => {
        try {
            // Check if route function is available
            if (typeof route === 'function') {
                setRouteInfo({
                    hasRoute: true,
                    homeRoute: route('home'),
                    error: null
                });
            } else {
                setRouteInfo({
                    hasRoute: false,
                    homeRoute: '',
                    error: 'route function is not defined'
                });
            }
        } catch (error) {
            setRouteInfo({
                hasRoute: false,
                homeRoute: '',
                error: error.message
            });
        }
    }, []);

    return (
        <>
            <Head title="Ziggy Test" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Ziggy Routes Test</h1>
                            
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">Route Function Available:</h2>
                                <p className="text-lg">{routeInfo.hasRoute ? 'Yes' : 'No'}</p>
                            </div>
                            
                            {routeInfo.hasRoute && (
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold">Home Route:</h2>
                                    <p className="text-lg">{routeInfo.homeRoute}</p>
                                </div>
                            )}
                            
                            {routeInfo.error && (
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-red-600">Error:</h2>
                                    <p className="text-lg text-red-600">{routeInfo.error}</p>
                                </div>
                            )}
                            
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold">Ziggy Object in Window:</h2>
                                <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-96">
                                    {JSON.stringify(window.Ziggy, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
