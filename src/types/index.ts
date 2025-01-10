export interface Folder {
  id: string;
  name: string;
}

export interface File {
  id: string;
  name: string;
  size?: number;
  type?: string;
}