import { FC } from 'react';
import { ProgressBar } from './ProgressBar';

interface UploadingFile {
  name: string;
  progress: number;
}

interface UploadProgressProps {
  files: UploadingFile[];
}

export const UploadProgress: FC<UploadProgressProps> = ({ files }) => {
  if (!files.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Uploading {files.length} {files.length === 1 ? 'file' : 'files'}
      </h3>

      <div className="space-y-4">
        {files.map((file) => (
          <div key={file.name} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {file.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {file.progress}%
              </span>
            </div>
            <ProgressBar progress={file.progress} />
          </div>
        ))}
      </div>
    </div>
  );
};