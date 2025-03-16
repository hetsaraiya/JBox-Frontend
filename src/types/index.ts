export interface Folder {
  id: string;
  name: string;
}

export interface File {
  id?: string;
  name: string;
  size?: number;
  mime_type?: string;
  viewable?: boolean;
  type?: string;  // file type category: image, video, audio, pdf, text, code, other
}

export type FileTypeCategory = 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'code' | 'other';