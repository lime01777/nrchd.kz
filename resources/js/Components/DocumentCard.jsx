import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * DocumentCard component displays a single document or video in a card format
 * 
 * @param {Object} props
 * @param {string} props.file - File path relative to the storage folder
 * @param {string} props.title - Title to display for the document
 * @param {string} props.description - Optional description text
 * @param {string} props.bgColor - Background color class for the card
 * @param {function} props.onVideoClick - Callback for video clicks
 * @param {boolean} props.showDetails - Whether to show file details (size, date)
 * @param {string} props.imageUrl - Optional custom thumbnail image URL
 */
export default function DocumentCard({ 
  file, 
  title, 
  description = '', 
  bgColor = 'bg-blue-100', 
  onVideoClick,
  showDetails = true,
  imageUrl = null
}) {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the file extension to determine the file type
  const fileExt = file ? file.split('.').pop().toLowerCase() : '';
  
  // Determine if the file is a video
  const isVideo = ['mp4', 'mov', 'avi', 'webm'].includes(fileExt);
  
  // Determine if the file is an image
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

  // Determine appropriate icon based on file type
  const getFileIcon = () => {
    if (isVideo) return 'fas fa-video';
    if (isImage) return 'fas fa-image';
    
    switch (fileExt) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc':
      case 'docx': return 'fas fa-file-word';
      case 'xls':
      case 'xlsx': return 'fas fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fas fa-file-powerpoint';
      default: return 'fas fa-file';
    }
  };

  // Fetch file details (size, date) using HEAD request
  useEffect(() => {
    if (!file || !showDetails) {
      setLoading(false);
      return;
    }

    const fileUrl = `/storage/documents/${file}`;
    
    axios.head(fileUrl)
      .then(response => {
        const headers = response.headers;
        setFileDetails({
          size: headers['content-length'],
          lastModified: headers['last-modified']
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching file details:', err);
        setError('Failed to load file details');
        setLoading(false);
      });
  }, [file, showDetails]);

  // Format file size in human-readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  // Format date in a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle document click
  const handleDocumentClick = () => {
    if (isVideo && onVideoClick) {
      onVideoClick(`/storage/documents/${file}`);
    } else {
      window.open(`/storage/documents/${file}`, '_blank');
    }
  };

  // Generate thumbnail or icon for the card
  const renderThumbnail = () => {
    if (imageUrl) {
      return (
        <div className="document-thumbnail">
          <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-t-lg" />
        </div>
      );
    }
    
    if (isImage) {
      return (
        <div className="document-thumbnail">
          <img 
            src={`/storage/documents/${file}`} 
            alt={title} 
            className="w-full h-40 object-cover rounded-t-lg" 
          />
        </div>
      );
    }
    
    return (
      <div className="document-icon flex items-center justify-center h-40 bg-gray-200 rounded-t-lg">
        <i className={`${getFileIcon()} text-5xl text-gray-600`}></i>
      </div>
    );
  };

  return (
    <div className={`document-card rounded-lg shadow-md overflow-hidden ${bgColor} transition-transform duration-300 hover:shadow-lg hover:scale-105`}>
      {/* Thumbnail or icon section */}
      {renderThumbnail()}
      
      {/* Document info section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        
        {description && (
          <p className="text-gray-600 mb-3 text-sm line-clamp-3">{description}</p>
        )}
        
        {/* File details section */}
        {showDetails && (
          <div className="file-details text-xs text-gray-500 space-y-1 mb-3">
            {loading ? (
              <p>Loading file details...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : fileDetails && (
              <>
                <p><i className="fas fa-file-alt mr-1"></i> {fileExt.toUpperCase()}</p>
                <p><i className="fas fa-weight-hanging mr-1"></i> {formatFileSize(fileDetails.size)}</p>
                <p><i className="fas fa-calendar-alt mr-1"></i> {formatDate(fileDetails.lastModified)}</p>
              </>
            )}
          </div>
        )}
        
        {/* Action button */}
        <button
          onClick={handleDocumentClick}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <i className={`${isVideo ? 'fas fa-play' : 'fas fa-download'} mr-2`}></i>
          {isVideo ? 'Смотреть видео' : 'Открыть документ'}
        </button>
      </div>
    </div>
  );
}
