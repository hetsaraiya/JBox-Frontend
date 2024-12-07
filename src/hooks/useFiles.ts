import { useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { API_ENDPOINTS } from '../config/api';

export const useFiles = (folderId: string | null) => {
  const { files, setFiles, isLoading, error, setLoading, setError } = useStore();

  const fetchFiles = useCallback(async () => {
    if (!folderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.files(folderId));
      if (!response.ok) throw new Error('Failed to fetch files');
      
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [folderId, setFiles, setLoading, setError]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const deleteFile = async (fileName: string) => {
    if (!folderId) return;
    
    try {
      setError(null);
      const response = await fetch(
        API_ENDPOINTS.deleteFile(fileName, folderId),
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete file');
      await response.json();
      fetchFiles();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete file');
    }
  };

  const downloadFile = (fileName: string) => {
    window.location.href = API_ENDPOINTS.download(fileName);
  };

  return {
    files,
    isLoading,
    error,
    fetchFiles,
    deleteFile,
    downloadFile
  };
};