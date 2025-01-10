export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  folders: `${API_BASE_URL}/folders/`,
  createFolder: (name: string) => `${API_BASE_URL}/create_folder/?name=${name}`,
  files: (folderId: string) => `${API_BASE_URL}/files/${folderId}`,
  upload: (folderId: string) => `${API_BASE_URL}/upload/?folder_id=${folderId}`,
  download: (fileName: string) => `${API_BASE_URL}/download/${fileName}`,
  deleteFile: (fileName: string, folderId: string) => 
    `${API_BASE_URL}/files/${encodeURIComponent(fileName)}?folder_id=${folderId}`,
  deleteFolder: (folderName: string) => `${API_BASE_URL}/folders/${folderName}`,
  wsProgress: `ws://127.0.0.1:8000/ws/progress`
};