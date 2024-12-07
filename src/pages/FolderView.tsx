import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { DropZone } from '../components/DropZone';
import { FileList } from '../components/FileList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { UploadProgress } from '../components/UploadProgress';
import { useFileUpload } from '../hooks/useFileUpload';
import { useFiles } from '../hooks/useFiles';

export const FolderView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('id');
  
  const { 
    files, 
    isLoading, 
    error, 
    fetchFiles,
    deleteFile,
    downloadFile 
  } = useFiles(folderId);

  const { uploadingFiles, uploadFiles } = useFileUpload(fetchFiles);

  const handleFilesDrop = async (files: FileList) => {
    if (!folderId) return;
    await uploadFiles(files, folderId);
  };

  if (!folderId) {
    return <ErrorMessage message="No folder ID provided" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="secondary"
        className="mb-6 flex items-center space-x-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Folders</span>
      </Button>

      <h1 className="text-3xl font-bold mb-8 dark:text-white">Files</h1>
      
      {error && <ErrorMessage message={error} />}

      <DropZone onFilesDrop={handleFilesDrop} />
      
      <UploadProgress files={uploadingFiles} />
      
      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FileList
            files={files}
            onDownload={downloadFile}
            onDelete={deleteFile}
          />
        )}
      </div>
    </div>
  );
};