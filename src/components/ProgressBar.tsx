import { FC } from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({ 
  progress, 
  color = 'bg-blue-500' 
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${color} transition-all duration-300 ease-in-out`}
        style={{ width: `${normalizedProgress}%` }}
      ></div>
    </div>
  );
};