import type { StarStationNavigationPoint } from "../types/artwork";

export const starStationNavigationPoints = [
  {
    id: "home",
    label: "HOME.SYS",
    description: "Return to the TheStarArt_ home signal.",
  },
  {
    id: "about-project",
    label: "ABOUT.PROJECT",
    description: "Read the project system file.",
  },
  {
    id: "about-me",
    label: "ABOUT.ME",
    description: "Read the artist and developer signal.",
  },
  {
    id: "gallery",
    label: "GALLERY.ARCHIVE",
    description: "Open the constellation of drawings.",
  },
] as const satisfies readonly StarStationNavigationPoint[];
