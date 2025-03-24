import React from 'react';

const Input = ({ 
    type = 'text', 
    name, 
    id, 
    value, 
    onChange, 
    className = '', 
    placeholder = '', 
    required = false,
    error = null,
    label = null,
    ...props 
}) => {
    const baseClasses = 'shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md';
    const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : '';
    
    return (
        <div>
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                className={`${baseClasses} ${errorClasses} ${className}`}
                placeholder={placeholder}
                required={required}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
