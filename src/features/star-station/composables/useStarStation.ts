import { computed, ref } from "vue";
import type {
  StarStationArtwork,
  StarStationNavigationDestination,
  StarStationPhase,
  UniverseView,
} from "../types/artwork";
import { createStarStationScene, type StarStationScene } from "../three/createStarStationScene";

interface UseStarStationOptions {
  onHomeRequest: () => void;
}

export function useStarStation(
  artworks: readonly StarStationArtwork[],
  { onHomeRequest }: UseStarStationOptions,
) {
  const phase = ref<StarStationPhase>("intro");
  const universeView = ref<UniverseView>("main");
  const selectedArtwork = ref<StarStationArtwork | null>(null);
  const hoveredArtwork = ref<StarStationArtwork | null>(null);
  const hoveredNavigation = ref<StarStationNavigationDestination | null>(null);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scene: StarStationScene | null = null;

  const currentArtwork = computed(() => selectedArtwork.value ?? hoveredArtwork.value);

  const setUniverseView = (view: UniverseView, artworkId: string | null = null) => {
    universeView.value = view;
    selectedArtwork.value = view === "artwork"
      ? artworks.find((artwork) => artwork.id === artworkId) ?? null
      : null;
    hoveredArtwork.value = null;
    hoveredNavigation.value = null;
    scene?.setView(view, artworkId);

  };

  const start = async (container: HTMLElement) => {
    phase.value = "loading";
    setUniverseView("main");
    scene?.dispose();
    scene = null;

    try {
      scene = await createStarStationScene({
        container,
        artworks,
        reducedMotion,
        onArtworkChange: (artwork) => {
          selectedArtwork.value = artwork;
        },
        onHoverChange: (artwork) => {
          hoveredArtwork.value = artwork;
        },
        onNavigationHover: (destination) => {
          hoveredNavigation.value = destination;
        },
        onNavigateRequest: (destination) => {
          if (destination === "home") {
            onHomeRequest();
            return;
          }

          setUniverseView(destination);
        },
        onArtworkRequest: (artworkId) => {
          setUniverseView("artwork", artworkId);
        },
      });
      scene.setView(universeView.value, selectedArtwork.value?.id);
      phase.value = "ready";
    } catch {
      phase.value = "error";
    }
  };

  const navigateTo = (destination: StarStationNavigationDestination) => {
    if (destination === "home") {
      onHomeRequest();
      return;
    }

    setUniverseView(destination);
  };

  const selectArtwork = (artworkId: string) => setUniverseView("artwork", artworkId);

  const returnToGallery = () => setUniverseView("gallery");

  const resetSelection = () => setUniverseView("main");

  const dispose = () => {
    scene?.dispose();
    scene = null;
  };

  return {
    phase,
    universeView,
    selectedArtwork,
    hoveredNavigation,
    currentArtwork,
    start,
    navigateTo,
    selectArtwork,
    returnToGallery,
    resetSelection,
    dispose,
  };
}
