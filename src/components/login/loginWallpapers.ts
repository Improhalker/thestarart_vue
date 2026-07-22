export type LoginWallpaper = {
  id: number;
  label: string;
  src: string;
};

export const fallbackLoginWallpaper: LoginWallpaper = {
  id: 1,
  label: "Archive_01",
  src: "/images/wallpaper/1.jpg",
};

export const loginWallpapers: readonly LoginWallpaper[] = [
  fallbackLoginWallpaper,
  { id: 2, label: "Archive_02", src: "/images/wallpaper/2.png" },
  { id: 3, label: "Archive_03", src: "/images/wallpaper/3.png" },
  { id: 4, label: "Archive_04", src: "/images/wallpaper/4.png" },
  { id: 5, label: "Archive_05", src: "/images/wallpaper/5.png" },
];

export const selectLoginWallpaper = (): LoginWallpaper => {
  const index = Math.floor(Math.random() * loginWallpapers.length);

  return loginWallpapers[index] ?? fallbackLoginWallpaper;
};
