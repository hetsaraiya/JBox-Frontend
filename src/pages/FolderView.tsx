import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FileList } from '../components/FileList';
import { DropZone } from '../components/DropZone';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { UploadProgress } from '../components/UploadProgress';
import { useFiles } from '../hooks/useFiles';
import { useFileUpload } from '../hooks/useFileUpload';
import { UserProfile } from '../components/UserProfile';
import { apiGet } from '../utils/apiService';

export const FolderView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const folderId = searchParams.get('id');
  const [folderName, setFolderName] = useState<string>('');
  const { files, isLoading, error, deleteFile, downloadFile, fetchFiles } = useFiles(folderId);
  const { uploadingFiles, uploadFiles } = useFileUpload(fetchFiles);

  // Fetch folder name
  useEffect(() => {
    const fetchFolderName = async () => {
      if (!folderId) return;
      
      try {
        const response = await apiGet('/folders/');
        const folders = response as Array<{ id: number; name: string }>;
        const folder = folders.find((f) => f.id === parseInt(folderId));
        if (folder) {
          setFolderName(folder.name);
        }
      } catch (error) {
        console.error('Error fetching folder name:', error);
      }
    };
    
    fetchFolderName();
  }, [folderId]);

  const handleFileUpload = async (files: File[]) => {
    if (!folderId) return;
    
    // Convert File[] to FileList for the useFileUpload hook
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    await uploadFiles(dataTransfer.files, folderId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Folders
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {folderName || 'Folder'}
          </h1>
        </div>
        <UserProfile />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="mb-8">
        <DropZone onFilesDrop={handleFileUpload} disabled={uploadingFiles.length > 0} />
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mb-8">
          <UploadProgress files={uploadingFiles} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FileList
          files={files}
          onFileClick={(fileName) => navigate(`/file?name=${encodeURIComponent(fileName)}&folder=${folderId}`)}
          onDownload={downloadFile}
          onDelete={deleteFile}
        />
      )}
    </div>
  );
};