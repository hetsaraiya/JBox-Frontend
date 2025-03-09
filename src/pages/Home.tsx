import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FolderList } from '../components/FolderList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { UserProfile } from '../components/UserProfile';
import { useStore } from '../store/useStore';
import { apiGet, apiPost, apiDelete } from '../utils/apiService';

export const Home = () => {
  const navigate = useNavigate();
  const { folders, setFolders, isLoading, error, setLoading, setError } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('/folders/');
      setFolders(data);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      setIsCreating(true);
      setError(null);
      await apiPost(`/create_folder/?name=${folderName}`);
      fetchFolders();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    try {
      setError(null);
      await apiDelete(`/folders/${folderName}`);
      fetchFolders();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to delete folder');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Folders</h1>
        <div className="flex items-center space-x-4">
          <UserProfile />
          <Button
            onClick={handleCreateFolder}
            disabled={isCreating || isLoading}
          >
            Create Folder
          </Button>
        </div>
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