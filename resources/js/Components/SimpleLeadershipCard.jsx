import React from 'react';

function SimpleLeadershipCard({ name, position, photo, contact }) {
  return (
    <div className="p-4 lg:w-1/2 xl:w-1/3 w-full">
      <div className="h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
        {/* Аватар с инициалами */}
        <div className="p-6 pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-xl font-bold">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Информация о руководителе */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center line-clamp-2">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center line-clamp-3">
            {position}
          </p>
          
          {/* Контактная информация */}
          {contact && (
            <div className="space-y-1 text-xs text-gray-500">
              {contact.email && (
                <p className="flex items-center justify-center">
                  <span className="mr-2">📧</span>
                  {contact.email}
                </p>
              )}
              {contact.phone && (
                <p className="flex items-center justify-center">
                  <span className="mr-2">📞</span>
                  {contact.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimpleLeadershipCard;
