import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FolderList } from '../components/FolderList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useStore } from '../store/useStore';
import { API_ENDPOINTS } from '../config/api';

export const Home = () => {
  const navigate = useNavigate();
  const { folders, setFolders, isLoading, error, setLoading, setError } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.folders);
      if (!response.ok) throw new Error('Failed to fetch folders');
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      setIsCreating(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.createFolder(folderName), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to create folder');
      await response.json();
      fetchFolders();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    try {
      setError(null);
      const response = await fetch(API_ENDPOINTS.deleteFolder(folderName), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete folder');
      await response.json();
      fetchFolders();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete folder');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Folders</h1>
        <Button
          onClick={handleCreateFolder}
          disabled={isCreating || isLoading}
        >
          Create Folder
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FolderList
          folders={folders}
          onFolderClick={(id) => navigate(`/folder?id=${id}`)}
          onDelete={handleDeleteFolder}
        />
      )}
    </div>
  );
};