export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,
  me: `${API_BASE_URL}/auth/me`,

  // Folder endpoints
  folders: `${API_BASE_URL}/folders/`,
  createFolder: (name: string) => `${API_BASE_URL}/create_folder/?name=${name}`,
  deleteFolder: (folderName: string) => `${API_BASE_URL}/folders/${folderName}`,

  // File endpoints
  files: (folderId: string) => `${API_BASE_URL}/files/${folderId}`,
  upload: (folderId: string) => `${API_BASE_URL}/upload/?folder_id=${folderId}`,
  download: (fileName: string, folderId: string) => 
    `${API_BASE_URL}/download/${fileName}?folder_id=${folderId}`,
  deleteFile: (fileName: string, folderId: string) => 
    `${API_BASE_URL}/files/${encodeURIComponent(fileName)}?folder_id=${folderId}`,
  openFile: (fileName: string, folderId: string) => 
    `${API_BASE_URL}/open/${encodeURIComponent(fileName)}?folder_id=${folderId}`,
  fileMetadata: (fileName: string, folderId: string) =>
    `${API_BASE_URL}/metadata/${encodeURIComponent(fileName)}?folder_id=${folderId}`,
  checkFileSupport: (fileName: string, folderId: string) =>
    `${API_BASE_URL}/check/${encodeURIComponent(fileName)}?folder_id=${folderId}`,

  // WebSocket
  wsProgress: `ws://127.0.0.1:8000/ws/progress`
};