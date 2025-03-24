import React from 'react';

const Table = ({ children, className = '' }) => {
    return (
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
            {children}
        </table>
    );
};

const Head = ({ children, className = '' }) => {
    return (
        <thead className={`bg-gray-50 ${className}`}>
            {children}
        </thead>
    );
};

const Body = ({ children, className = '' }) => {
    return (
        <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
            {children}
        </tbody>
    );
};

const Row = ({ children, className = '' }) => {
    return (
        <tr className={className}>
            {children}
        </tr>
    );
};

const Cell = ({ children, className = '', colSpan, title }) => {
    return (
        <td 
            className={`px-6 py-4 whitespace-nowrap ${className}`} 
            colSpan={colSpan}
            title={title}
        >
            {children}
        </td>
    );
};

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export default Table;
