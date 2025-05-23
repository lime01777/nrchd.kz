import React from 'react';

export default function Leadership({ leaders, title = "Руководство", bgColor = "bg-blue-50" }) {
  if (!leaders || leaders.length === 0) {
    return null;
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        <h2 className="sm:text-3xl text-2xl font-medium title-font mb-8 text-gray-900 text-center">
          {title}
        </h2>
        <div className="flex flex-wrap -m-4">
          {leaders.map((leader, index) => (
            <div key={index} className="p-4 md:w-1/2 lg:w-1/3">
              <div className={`h-full ${bgColor} rounded-lg p-6 flex flex-col relative overflow-hidden`}>
                <div className="flex items-center mb-4">
                  {leader.photo ? (
                    <img 
                      alt={leader.name} 
                      src={leader.photo} 
                      className="w-20 h-20 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mr-4 bg-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 title-font mb-1">{leader.name}</h2>
                    <p className="leading-relaxed text-base">{leader.position}</p>
                  </div>
                </div>
                {leader.contact && (
                  <div className="mt-2 mb-2 border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Контакты:</p>
                    {leader.phone && (
                      <p className="text-sm mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {leader.phone}
                      </p>
                    )}
                    {leader.email && (
                      <p className="text-sm mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${leader.email}`} className="text-blue-600 hover:underline">
                          {leader.email}
                        </a>
                      </p>
                    )}
                  </div>
                )}
                {leader.bio && (
                  <p className="leading-relaxed mt-2">{leader.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
