import { useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { apiGet, apiDelete } from '../utils/apiService';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { File } from '../types';

export const useFiles = (folderId: string | null) => {
  const { files, setFiles, isLoading, error, setLoading, setError } = useStore();

  const fetchFiles = useCallback(async () => {
    if (!folderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiGet<{ files: File[], status: boolean, count: number }>(`/files/${folderId}`);
      if (response.status && Array.isArray(response.files)) {
        setFiles(response.files);
      } else {
        setFiles([]);
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to fetch files');
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
      await apiDelete(`/files/${encodeURIComponent(fileName)}?folder_id=${folderId}`);
      fetchFiles();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to delete file');
    }
  };

  const downloadFile = async (fileName: string) => {
    if (!folderId) return;
    
    try {
      const response = await axios.get(API_ENDPOINTS.download(fileName, folderId), {
        responseType: 'blob',
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

  const getFileMetadata = async (fileName: string) => {
    if (!folderId) return null;
    
    try {
      const response = await apiGet<{ file: File }>(API_ENDPOINTS.fileMetadata(fileName, folderId));
      return response.file;
    } catch (error: any) {
      console.error('Failed to fetch file metadata:', error);
      return null;
    }
  };

  return {
    files,
    isLoading,
    error,
    fetchFiles,
    deleteFile,
    downloadFile,
    getFileMetadata
  };
};