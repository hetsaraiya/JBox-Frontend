import { FC, useState, useEffect, useRef } from 'react';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';
import type { Folder as FolderType } from '../types';

interface FolderListProps {
  folders: FolderType[];
  onFolderClick: (id: string) => void;
  onDelete: (name: string) => void;
}

export const FolderList: FC<FolderListProps> = ({ folders, onFolderClick, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between group relative cursor-pointer"
          onClick={() => onFolderClick(folder.id)}
        >
          <div className="flex items-center space-x-3">
            <Folder className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{folder.name}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === folder.id ? null : folder.id);
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {activeMenu === folder.id && (
            <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder.name);
                  setActiveMenu(null);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 text-red-600"
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