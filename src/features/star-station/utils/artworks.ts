import type { StarStationArtwork } from "../types/artwork";

const DRAWINGS_DIRECTORY = "/images/desenhos";

const artworkFiles = [
  "mirai.webp",
  "eye_blue.webp",
  "jujutsu.webp",
  "katarina.png",
  "kyoukai.jpg",
  "madoka.webp",
  "makima.webp",
] as const;

function titleFromFilename(filename: string): string {
  const filenameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

  return filenameWithoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export const starStationArtworks: StarStationArtwork[] = artworkFiles.map((filename) => {
  const title = titleFromFilename(filename);

  return {
    id: filename.replace(/\.[^/.]+$/, ""),
    title,
    src: `${DRAWINGS_DIRECTORY}/${filename}`,
    alt: `Colored pencil illustration on paper: ${title} | TheStarArt_`,
  };
});
