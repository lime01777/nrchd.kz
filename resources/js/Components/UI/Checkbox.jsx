import React from 'react';

const Checkbox = ({ 
    name, 
    id, 
    checked, 
    onChange, 
    className = '', 
    label = '',
    ...props 
}) => {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                name={name}
                id={id || name}
                checked={checked}
                onChange={onChange}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
                {...props}
            />
            {label && (
                <label htmlFor={id || name} className="ml-2 block text-sm text-gray-900">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;
