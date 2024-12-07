import { FC } from 'react';
import { ProgressBar } from './ProgressBar';

interface UploadProgressProps {
  files: UploadingFile[];
}

interface UploadingFile {
  name: string;
  progress: number;
}

export const UploadProgress: FC<UploadProgressProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {files.map((file) => (
        <div key={file.name} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2 truncate">
            {file.name}
          </div>
          <ProgressBar progress={file.progress} />
        </div>
      ))}
    </div>
  );
};