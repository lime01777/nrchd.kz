import React from 'react';
import Modal from '@/Components/Modal';

export default function CatalogModal({ show, onClose }) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      maxWidth="6xl"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Каталог образовательных программ</h2>
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Закрыть</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative w-full h-[80vh]">
          <iframe 
            src="http://89.218.81.108/#/catalog/view" 
            className="absolute top-0 left-0 w-full h-full border-0" 
            title="Каталог образовательных программ"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </Modal>
  );
}
