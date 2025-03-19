import React from 'react';

function FileAccordChlank({ description, filetype, img, filesize = "24 KB", date = "27.03.2024", url = "#" }) {
  return (
    <div className="p-4 md:w-1/3 w-full">
        <div className="flex flex-col h-[250px] bg-white p-8 rounded-xl text-left content-between justify-between">
            <div className='flex'>
                <h1 className="font-medium leading-relaxed mb-3">{description}</h1>
            </div>
            <div className="flex mt-4 justify-between">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3">
                    Открыть
                </a>
                <div className='flex flex-col text-sm my-auto'>
                    <div className='flex flex-row'>
                        <img src={`/images/${img}.png`} alt="" className='w-5 h-5' />

                        <p className='ml-1 uppercase'>{filetype}, {filesize}</p>
                    </div>
                    <p className='text-gray-400 self-end'>{date}</p>

                </div>
            </div>

        </div>
    </div>
  )
}

export default FileAccordChlank