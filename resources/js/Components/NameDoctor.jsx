import React from 'react';

function NameDoctor({ name, about }) {
  return (
    <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div className="h-full grid items-center content-start border-gray-200 border p-4 rounded-lg">
            <div className="flex-grow">
                <h2 className="text-gray-900 text-sm mb-2 font-medium">{name}</h2>
                <p className="text-gray-500 text-xs">{about}</p>
            </div>
        </div>
    </div>
  )
}

export default NameDoctor