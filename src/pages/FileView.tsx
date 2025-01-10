import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const FileView = () => {
  const [searchParams] = useSearchParams();
  const fileName = searchParams.get('name');
  const folderId = searchParams.get('folderId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName || !folderId) {
      setError('Missing file name or folder ID');
      setLoading(false);
      return;
    }

    const openFile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/open/${encodeURIComponent(fileName)}?folder_id=${folderId}`
        );
        
        if (!response.ok) {
          const errorDetail = await response.json();
          throw new Error(errorDetail.detail || 'Failed to fetch file');
        }

        const contentType = response.headers.get('content-type');
        const disposition = response.headers.get('content-disposition');
        
        const isAttachment = disposition?.includes('attachment');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        if (isAttachment) {
          // Handle downloadable files
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          window.close();
        } else {
          // Handle viewable files
          if (contentType?.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'max-w-full h-auto';
            document.getElementById('viewer')?.appendChild(img);
          } else if (contentType?.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            video.className = 'max-w-full';
            document.getElementById('viewer')?.appendChild(video);
          } else if (contentType?.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = url;
            audio.controls = true;
            audio.className = 'w-full';
            document.getElementById('viewer')?.appendChild(audio);
          } else if (contentType?.startsWith('application/pdf')) {
            // Open PDF in new tab
            window.open(url, '_blank');
          } else {
            // For text, JSON, XML, etc., render in a new window or iframe
            window.open(url, '_blank');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to open file');
      } finally {
        setLoading(false);
      }
    };

    openFile();
  }, [fileName, folderId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div id="viewer" className="max-w-6xl mx-auto" />
    </div>
  );
};
