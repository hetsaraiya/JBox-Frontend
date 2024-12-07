export interface Folder {
  id: string;
  name: string;
}

export interface File {
  name: string;
  size?: number;
  type?: string;
}