import { FC, useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  ExternalLink, 
  FileText, 
  FileCode, 
  Video, 
  Image as ImageIcon, 
  Music, 
  FileArchive, 
  File as FileIcon, 
  Eye,
  EyeOff
} from 'lucide-react';
import type { File as FileType } from '../types';
import { useSearchParams } from 'react-router-dom';

interface FileListProps {
  files: FileType[];
  onFileClick: (fileName: string) => void;
  onDownload: (fileName: string) => void;
  onDelete: (fileName: string) => void;
}

export const FileList: FC<FileListProps> = ({ files, onFileClick, onDownload, onDelete }) => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('id');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenu && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  const getFileIcon = (file: FileType) => {
    const fileType = file.type || getFileTypeFromName(file.name);
    
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileTypeFromName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'audio';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['txt', 'md', 'rtf'].includes(extension)) {
      return 'text';
    } else if (['js', 'ts', 'html', 'css', 'json', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp'].includes(extension)) {
      return 'code';
    }
    
    return 'other';
  };

  const formatFileSize = (size?: number): string => {
    if (!size) return '';
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">No files in this folder</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Drop files above to upload</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between group relative"
        >
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-grow"
            onClick={() => onFileClick(file.name)}
          >
            <div className="flex-shrink-0">
              {getFileIcon(file)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100 block truncate">
                {file.name}
              </span>
              {(file.size !== undefined || file.mime_type) && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  {file.size !== undefined && (
                    <span>{formatFileSize(file.size)}</span>
                  )}
                  {file.mime_type && file.size !== undefined && (
                    <span>•</span>
                  )}
                  {file.mime_type && (
                    <span>{file.mime_type.split('/')[1]}</span>
                  )}
                  {file.viewable !== undefined && (
                    <span className="ml-1 flex items-center" title={file.viewable ? "Viewable in browser" : "Download only"}>
                      {file.viewable ? (
                        <Eye className="w-3 h-3 text-green-500" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-amber-500" />
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFileClick(file.name)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Open file"
            >
              <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              ref={activeMenu === file.name ? buttonRef : null}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === file.name ? null : file.name);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {activeMenu === file.name && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
            >
              <button
                onClick={() => {
                  onDownload(file.name);
                  setActiveMenu(null);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => {
                  onDelete(file.name);
                  setActiveMenu(null);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};