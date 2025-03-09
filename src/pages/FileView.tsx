import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import api from '../utils/apiService';
import { API_ENDPOINTS } from '../config/api';
import { UserProfile } from '../components/UserProfile';

export const FileView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const fileName = searchParams.get('name');
  const folderId = searchParams.get('folder');
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName || !folderId) return;

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Request the file with authentication headers via our API service
        const response = await api.get(API_ENDPOINTS.openFile(fileName, folderId), {
          responseType: 'blob'
        });
        
        // Create a blob URL from the response
        const url = URL.createObjectURL(response.data);
        setFileUrl(url);
      } catch (error: any) {
        console.error('Error loading file:', error);
        setError(error.response?.data?.detail || 'Failed to load file');
      } finally {
        setLoading(false);
      }
    };

    loadFile();
    
    // Cleanup URL object when component unmounts
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileName, folderId]);

  const getFileType = () => {
    if (!fileName) return '';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return 'audio';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else if (['txt', 'md', 'js', 'ts', 'html', 'css', 'json'].includes(extension || '')) {
      return 'text';
    }
    
    return 'other';
  };

  const renderFileContent = () => {
    if (!fileUrl) return null;

    const fileType = getFileType();

    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt={fileName || 'File'} className="max-w-full h-auto" />;
      case 'video':
        return (
          <video controls className="max-w-full">
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="w-full mt-4">
            <source src={fileUrl} />
            Your browser does not support the audio tag.
          </audio>
        );
      case 'pdf':
        return (
          <iframe
            title={fileName || 'PDF Viewer'}
            src={fileUrl}
            className="w-full h-[80vh]"
          />
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Preview not available. <a href={fileUrl} download={fileName || 'file'} className="text-blue-500 hover:underline">Download file</a>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate(`/folder?id=${folderId}`)}
            className="mb-4"
          >
            ← Back to Files
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {fileName || 'File Viewer'}
          </h1>
        </div>
        <UserProfile />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {renderFileContent()}
          </div>
        )}
      </div>
    </div>
  );
};
