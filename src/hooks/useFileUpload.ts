import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface UploadingFile {
  name: string;
  progress: number;
}

interface UseFileUploadReturn {
  uploadingFiles: UploadingFile[];
  uploadFiles: (files: FileList, folderId: string) => Promise<void>;
}

export const useFileUpload = (onUploadComplete?: () => void): UseFileUploadReturn => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const uploadFiles = useCallback(async (files: FileList, folderId: string) => {
    // Initialize upload progress for all files
    setUploadingFiles(
      Array.from(files).map(file => ({
        name: file.name,
        progress: 0
      }))
    );

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_id', folderId);

      try {
        await axios.post(API_ENDPOINTS.upload(folderId), formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadingFiles(prev => 
                prev.map(f => 
                  f.name === file.name 
                    ? { ...f, progress } 
                    : f
                )
              );
            }
          }
        });

        // Remove completed file from list after a delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        }, 1000);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        // Remove failed file from list
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
      }
    });

    await Promise.all(uploadPromises);

    // Call completion callback when all files are done
    if (onUploadComplete) {
      onUploadComplete();
    }
  }, [onUploadComplete]);

  return {
    uploadingFiles,
    uploadFiles
  };
};