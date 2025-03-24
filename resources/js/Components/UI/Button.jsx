import React from 'react';

const Button = ({ 
    children, 
    type = 'button', 
    className = '', 
    variant = 'default',
    disabled = false,
    onClick = () => {},
    ...props 
}) => {
    const variantClasses = {
        default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    };

    const baseClasses = 'inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
