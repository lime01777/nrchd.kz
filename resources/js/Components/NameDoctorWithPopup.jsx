import React, { useState } from 'react';

function NameDoctorWithPopup({ name, about, photo, biography }) {
  const [showPopup, setShowPopup] = useState(false);
  
  const handleOpen = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);
  
  return (
    <div 
      className="p-2 lg:w-1/3 md:w-1/2 w-full relative"
    >
      <div 
        className="h-full grid items-center content-start border-gray-200 border p-4 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="flex-grow">
          <h2 className="text-gray-900 text-sm mb-2 font-medium" data-translate>{name}</h2>
          <p className="text-gray-500 text-xs" data-translate>{about}</p>
        </div>
      </div>
      
      {/* Модальное окно с биографией и фото */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={handleClose}>
          <div 
            className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 p-8 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative">
              {/* Фотография в верхнем правом углу */}
              {photo && (
                <div className="float-right ml-6 mb-4 w-1/3 max-w-xs">
                  <img 
                    src={photo} 
                    alt={name} 
                    className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-md"
                  />
                </div>
              )}
              
              {/* Заголовок и должность */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2" data-translate>{name}</h3>
              <p className="text-gray-700 text-base font-medium mb-4" data-translate>{about}</p>
              
              {/* Биография с обтеканием фото */}
              {biography && (
                <div className="text-gray-600 text-sm lg:text-base leading-relaxed" data-translate>
                  {typeof biography === 'string' ? biography : biography}
                </div>
              )}
              
              {/* Очистка float */}
              <div className="clear-both"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NameDoctorWithPopup;
