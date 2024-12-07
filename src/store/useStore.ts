import { create } from 'zustand';
import { Folder, File } from '../types';

interface StoreState {
  folders: Folder[];
  files: File[];
  currentFolderId: string | null;
  isLoading: boolean;
  error: string | null;
  setFolders: (folders: Folder[]) => void;
  setFiles: (files: File[]) => void;
  setCurrentFolderId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  folders: [],
  files: [],
  currentFolderId: null,
  isLoading: false,
  error: null,
  setFolders: (folders) => set({ folders }),
  setFiles: (files) => set({ files }),
  setCurrentFolderId: (id) => set({ currentFolderId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));