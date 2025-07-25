import React, { forwardRef, useEffect, useRef } from 'react';

const Textarea = forwardRef(({ className = '', ...props }, ref) => {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (input.current.hasAttribute('autofocus')) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        />
    );
});

export default Textarea;
