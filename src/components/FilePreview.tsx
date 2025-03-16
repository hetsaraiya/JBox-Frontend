// filepath: c:\Users\hp\Desktop\Jbox-Frontend\src\components\FilePreview.tsx
import { FC, useState } from 'react';
import { Download, AlertTriangle, FileText, FileCode, Video, Image, Music, FileArchive } from 'lucide-react';
import { Button } from './Button';
import type { FileTypeCategory } from '../types';

interface FilePreviewProps {
  fileUrl: string | null;
  fileName: string | null;
  fileType?: FileTypeCategory;
  mimeType?: string;
  isError?: boolean;
  errorMessage?: string;
  onDownload?: () => void;
}

export const FilePreview: FC<FilePreviewProps> = ({
  fileUrl,
  fileName,
  fileType = 'other',
  mimeType,
  isError = false,
  errorMessage,
  onDownload
}) => {
  const [imgError, setImgError] = useState(false);

  if (isError || !fileUrl) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center space-y-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {errorMessage || "Unable to preview file"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This file type is not supported for viewing in the browser.
        </p>
        {onDownload && (
          <Button 
            onClick={onDownload} 
            className="mt-4 flex items-center justify-center space-x-2 mx-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </Button>
        )}
      </div>
    );
  }

  const renderFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image className="h-12 w-12 text-blue-500" />;
      case 'video':
        return <Video className="h-12 w-12 text-blue-500" />;
      case 'audio':
        return <Music className="h-12 w-12 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-12 w-12 text-blue-500" />;
      case 'text':
      case 'code':
        return <FileCode className="h-12 w-12 text-blue-500" />;
      default:
        return <FileArchive className="h-12 w-12 text-blue-500" />;
    }
  };

  const renderFileContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <>
            {!imgError ? (
              <img 
                src={fileUrl} 
                alt={fileName || 'Image'} 
                className="max-w-full h-auto rounded" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-8">
                <div className="mb-4 flex justify-center">
                  {renderFileIcon()}
                </div>
                <p>Failed to load image. The file may be corrupted or in an unsupported format.</p>
                {onDownload && (
                  <Button onClick={onDownload} variant="secondary" className="mt-4">
                    Download Instead
                  </Button>
                )}
              </div>
            )}
          </>
        );
      case 'video':
        return (
          <video controls className="max-w-full rounded">
            <source src={fileUrl} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="mb-6 flex justify-center">
              {renderFileIcon()}
            </div>
            <audio controls className="w-full">
              <source src={fileUrl} type={mimeType} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'pdf':
        return (
          <iframe
            title={fileName || 'PDF Viewer'}
            src={fileUrl}
            className="w-full h-[80vh] border-0 rounded"
          />
        );
      case 'text':
      case 'code':
        return (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[80vh] w-full">
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              {renderFileIcon()}
              <span className="font-medium">{fileName}</span>
            </div>
            <iframe 
              src={fileUrl} 
              className="w-full h-[calc(80vh-4rem)] border-0"
              title={fileName || "Text file content"}
            />
          </div>
        );
      default:
        return (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="mb-6 flex justify-center">
              {renderFileIcon()}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {fileName || "File"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Preview not available for this file type
            </p>
            {onDownload && (
              <Button onClick={onDownload}>
                Download File
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderFileContent()}
    </div>
  );
};