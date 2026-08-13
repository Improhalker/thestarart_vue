export const thumbnailTemplates = [
  { id: "drawing", label: "Drawing.exe" },
  { id: "gallery", label: "Gallery_Viewer.exe" },
  { id: "error", label: "Error Popup" },
  { id: "tutorial", label: "Tutorial.exe" },
  { id: "before-after", label: "Before / After" },
] as const;

export type ThumbnailTemplate = (typeof thumbnailTemplates)[number]["id"];

export interface ThumbnailState {
  title: string;
  template: ThumbnailTemplate;
  image: string | null;
  beforeImage: string | null;
  afterImage: string | null;
  imageScale: number;
  imageX: number;
  imageY: number;
}
