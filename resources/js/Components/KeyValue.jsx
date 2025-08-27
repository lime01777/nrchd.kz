import React from 'react';

export default function KeyValue({ label, value, icon, isLink = false, linkType = null }) {
    const getIcon = () => {
        switch (icon) {
            case 'location':
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'phone':
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'email':
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'globe':
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const renderValue = () => {
        if (isLink && linkType) {
            let href = value;
            if (linkType === 'tel') {
                href = `tel:${value}`;
            } else if (linkType === 'mailto') {
                href = `mailto:${value}`;
            }

            return (
                <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    target={linkType === 'url' ? '_blank' : undefined}
                    rel={linkType === 'url' ? 'noopener noreferrer' : undefined}
                >
                    {value}
                </a>
            );
        }

        return <span className="text-gray-900">{value}</span>;
    };

    return (
        <div className="flex items-start space-x-3">
            {icon && (
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className="mt-1">
                    {renderValue()}
                </div>
            </div>
        </div>
    );
}
