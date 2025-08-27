import React from 'react';

export default function Chips({ items = [], maxVisible = null, moreLabel = '+N' }) {
    if (!items || items.length === 0) {
        return null;
    }

    const visibleItems = maxVisible ? items.slice(0, maxVisible) : items;
    const hiddenCount = maxVisible ? items.length - maxVisible : 0;

    return (
        <div className="flex flex-wrap gap-2">
            {visibleItems.map((item, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                    {item}
                </span>
            ))}
            
            {hiddenCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {moreLabel.replace('N', hiddenCount)}
                </span>
            )}
        </div>
    );
}
