import { FC, DragEvent, useCallback, useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFilesDrop: (files: FileList) => void;
}

export const DropZone: FC<DropZoneProps> = ({ onFilesDrop }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    onFilesDrop(e.dataTransfer.files);
  }, [onFilesDrop]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDrop(e.target.files);
    }
  };

  return (
    <>
      <div
        className="w-full border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <p className="text-blue-600 font-medium">Drag and drop files here to upload</p>
        <p className="text-gray-500 text-sm mt-2">or click to select files</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </>
  );
};