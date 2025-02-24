import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Указываем путь к локальному worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('PDF Viewer');

    // Преобразуем ссылку Google Drive в прямой URL для PDF
    const getDirectPdfUrl = (url) => {
        const fileId = url.match(/\/d\/(.+?)\//)?.[1];
        return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : url;
    };

    // Получаем название файла из Google Drive API
    const fetchFileName = async (fileId) => {
        const apiKey = 'ВАШ_API_KEY'; // Замените на ваш API Key
        const url = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name&key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Не удалось получить название файла');
            }
            const data = await response.json();
            setFileName(data.name);
        } catch (error) {
            console.error('Ошибка при получении названия файла:', error);
        }
    };

    // Открытие документа
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setError(null);
    }

    // Ошибка загрузки документа
    function onDocumentLoadError(error) {
        setError('Не удалось загрузить PDF. Пожалуйста, проверьте ссылку.');
        console.error("Ошибка загрузки PDF:", error);
    }

    // При открытии модального окна получаем название файла
    useEffect(() => {
        if (isOpen) {
            const fileId = pdfUrl.match(/\/d\/(.+?)\//)?.[1];
            if (fileId) {
                fetchFileName(fileId);
            }
        }
    }, [isOpen, pdfUrl]);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {isOpen ? 'Закрыть документ' : 'Открыть документ'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">{fileName}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Document
                            file={getDirectPdfUrl(pdfUrl)}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            className="flex flex-col items-center"
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    className="mb-4"
                                    width={Math.min(window.innerWidth * 0.8, 800)}
                                />
                            ))}
                        </Document>
                    </div>
                </div>
            )}
        </div>
    );
}