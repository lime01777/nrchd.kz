import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentCard from '@/Components/DocumentCard';

/**
 * DocumentGrid component displays multiple documents in a responsive grid layout
 * 
 * @param {Object} props
 * @param {string} props.folder - Folder name within storage/documents to fetch files from
 * @param {string} props.title - Optional title for the document grid section
 * @param {string} props.bgColor - Background color for the section
 * @param {function} props.onVideoClick - Callback for video clicks
 * @param {number} props.limit - Optional limit for the number of documents to display
 * @param {number} props.columns - Number of columns on medium and larger screens
 * @param {boolean} props.showDetails - Whether to show file details in cards
 */
export default function DocumentGrid({ 
  folder, 
  title = '', 
  bgColor = 'bg-blue-100', 
  onVideoClick,
  limit = 0, 
  columns = 3,
  showDetails = true
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine column classes based on the columns prop
  const getColumnClass = () => {
    switch(columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  // Fetch files from the API
  useEffect(() => {
    if (!folder) {
      setLoading(false);
      return;
    }

    axios.get(`/api/files?folder=${folder}`)
      .then(response => {
        let filesData = response.data;
        
        // If limit is specified and greater than 0, limit the number of files
        if (limit > 0 && filesData.length > limit) {
          filesData = filesData.slice(0, limit);
        }
        
        setFiles(filesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching files:', err);
        setError('Failed to load files');
        setLoading(false);
      });
  }, [folder, limit]);

  // Extract document title from the filename by removing extension and replacing hyphens/underscores with spaces
  const formatDocumentTitle = (filename) => {
    // Remove file extension
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
    
    // Replace hyphens and underscores with spaces and capitalize first letter of each word
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className={`document-grid-container ${bgColor} p-6 rounded-lg`}>
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{title}</h2>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-2"></div>
          <p className="text-gray-600">Загрузка документов...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <i className="fas fa-exclamation-circle text-3xl mb-2"></i>
          <p>{error}</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-folder-open text-3xl mb-2"></i>
          <p>В этой папке нет документов</p>
        </div>
      ) : (
        <div className={`grid ${getColumnClass()} gap-6`}>
          {files.map((file, index) => (
            <DocumentCard
              key={index}
              file={`${folder}/${file.name}`}
              title={formatDocumentTitle(file.name)}
              bgColor="bg-white"
              onVideoClick={onVideoClick}
              showDetails={showDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
