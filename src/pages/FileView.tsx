import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FilePreview } from '../components/FilePreview';
import api, { apiGet } from '../utils/apiService';
import { API_ENDPOINTS } from '../config/api';
import { UserProfile } from '../components/UserProfile';
import { Download } from 'lucide-react';
import type { FileTypeCategory } from '../types';

interface FileMetadata {
  name: string;
  mime_type: string;
  viewable: boolean;
  type: FileTypeCategory;
  chunk_count: number;
}

export const FileView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const fileName = searchParams.get('name');
  const folderId = searchParams.get('folder');
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [unsupportedFormat, setUnsupportedFormat] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName || !folderId) return;

    const checkFileSupport = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if the file is supported via the HEAD request
        const checkResponse = await fetch(API_ENDPOINTS.checkFileSupport(fileName, folderId), {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
              JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token : ''}`
          }
        });

        // Get metadata to know more about the file
        const metadataResponse = await apiGet<{ file: FileMetadata, status: boolean }>(
          API_ENDPOINTS.fileMetadata(fileName, folderId)
        );
        
        setMetadata(metadataResponse.file);
        
        if (checkResponse.status === 415 || !metadataResponse.file.viewable) {
          setUnsupportedFormat(true);
          setErrorMessage("This file type is not supported for viewing in browser");
          
          // Create a download URL for the user to download instead
          // No need to set fileUrl since we'll show an error state
          setLoading(false);
          return;
        }

        // File is supported, proceed with loading content
        const response = await api.get(API_ENDPOINTS.openFile(fileName, folderId), {
          responseType: 'blob'
        });
        
        // Create a blob URL from the response
        const url = URL.createObjectURL(response.data);
        setFileUrl(url);
      } catch (error: any) {
        console.error('Error loading file:', error);
        if (error.response?.status === 415) {
          setUnsupportedFormat(true);
          setErrorMessage("This file type is not supported for viewing in browser");
        } else {
          setError(error.response?.data?.detail || error.response?.data?.message || 'Failed to load file');
        }
      } finally {
        setLoading(false);
      }
    };

    checkFileSupport();
    
    // Cleanup URL object when component unmounts
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileName, folderId]);

  const handleDownload = async () => {
    if (!fileName || !folderId) return;

    try {
      const response = await api.get(API_ENDPOINTS.download(fileName, folderId), {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to download file');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate flex items-center">
            {fileName || 'File Viewer'}
            {metadata?.viewable === false && (
              <span className="ml-3 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                Download only
              </span>
            )}
          </h1>
          {metadata && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {metadata.mime_type || "Unknown type"}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!loading && (
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          )}
          <UserProfile />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <FilePreview
            fileUrl={fileUrl}
            fileName={fileName}
            fileType={metadata?.type as FileTypeCategory}
            mimeType={metadata?.mime_type}
            isError={unsupportedFormat}
            errorMessage={errorMessage || undefined}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};
