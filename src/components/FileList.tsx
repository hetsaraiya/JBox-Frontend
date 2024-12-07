import { FC, useState, useEffect, useRef } from 'react';
import { File, MoreVertical, Download, Trash2 } from 'lucide-react';
import type { File as FileType } from '../types';

interface FileListProps {
  files: FileType[];
  onDownload: (fileName: string) => void;
  onDelete: (fileName: string) => void;
}

export const FileList: FC<FileListProps> = ({ files, onDownload, onDelete }) => {
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

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between group relative"
        >
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
          </div>
          
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
                <span className="text-gray-700 dark:text-gray-200">Download</span>
              </button>
              <button
                onClick={() => {
                  onDelete(file.name);
                  setActiveMenu(null);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-red-600 dark:text-red-400">Delete</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};