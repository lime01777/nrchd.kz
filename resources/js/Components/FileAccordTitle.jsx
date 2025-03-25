import React from 'react';

function FileAccordTitle({title, isOpen, toggleOpen}) {
  return (
    <div 
      className="flex flex-row w-full items-center justify-between p-4 cursor-pointer rounded-lg transition-colors duration-200"
      onClick={toggleOpen}
    >
        <div className='flex flex-grow'>
            <h1 className="sm:text-xl text-lg font-semibold title-font text-gray-900">{title}</h1>
        </div>
        <div className='flex'>
            <div className="text-black inline-flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path
                        d="M12 19c-.39 0-.77-.15-1.06-.44l-7-7a1.5 1.5 0 0 1 2.12-2.12L12 15.88l5.94-5.94a1.5 1.5 0 0 1 2.12 2.12l-7 7c-.29.29-.67.44-1.06.44z" />
                    </svg>
            </div>
        </div>
    </div>
  )
}

export default FileAccordTitle