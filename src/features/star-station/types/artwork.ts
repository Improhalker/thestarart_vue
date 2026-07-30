export interface StarStationArtwork {
  id: string;
  title: string;
  src: string;
  alt: string;
}

export type StarStationPhase = "intro" | "loading" | "ready" | "error";

export type StarStationAboutTab = "project" | "me";

// Vue owns this navigation state. Three.js only receives it to decide which
// constellation should be visible and where the camera should travel.
export type UniverseView = "main" | "about-project" | "about-me" | "gallery" | "artwork";

export type StarStationNavigationDestination = "home" | Exclude<UniverseView, "main" | "artwork">;

export interface StarStationNavigationPoint {
  id: StarStationNavigationDestination;
  label: string;
  description: string;
}
