import * as THREE from "three";
import type {
  StarStationArtwork,
  StarStationNavigationDestination,
  UniverseView,
} from "../types/artwork";
import { createAboutBeacon } from "./createAboutBeacon";
import { createArtworkPanels, type StarStationArtworkPanel } from "./createArtworkPanels";
import { createCosmicField } from "./createCosmicField";
import { createGalleryConstellation } from "./createGalleryConstellation";
import { createNavigationConstellation } from "./createNavigationConstellation";

interface CreateStarStationSceneOptions {
  container: HTMLElement;
  artworks: readonly StarStationArtwork[];
  reducedMotion: boolean;
  onArtworkChange: (artwork: StarStationArtwork | null) => void;
  onHoverChange: (artwork: StarStationArtwork | null) => void;
  onNavigationHover: (destination: StarStationNavigationDestination | null) => void;
  onNavigateRequest: (destination: StarStationNavigationDestination) => void;
  onArtworkRequest: (artworkId: string) => void;
}

export interface StarStationScene {
  setView: (view: UniverseView, artworkId?: string | null) => void;
  dispose: () => void;
}

type InteractiveTarget =
  | { type: "navigation"; destination: StarStationNavigationDestination }
  | { type: "artwork"; panel: StarStationArtworkPanel };

function supportsWebGL(): boolean {
  const canvas = document.createElement("canvas");

  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function getContainerSize(container: HTMLElement): { width: number; height: number } {
  return {
    width: Math.max(container.clientWidth, 1),
    height: Math.max(container.clientHeight, 1),
  };
}

export async function createStarStationScene({
  container,
  artworks,
  reducedMotion,
  onArtworkChange,
  onHoverChange,
  onNavigationHover,
  onNavigateRequest,
  onArtworkRequest,
}: CreateStarStationSceneOptions): Promise<StarStationScene> {
  if (!supportsWebGL()) {
    throw new Error("WebGL is unavailable in this browser.");
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const useStackedArtworkDetails = window.matchMedia("(max-width: 1023px)").matches;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03010e);
  scene.fog = new THREE.FogExp2(0x010325, 0.026);

  const { width, height } = getContainerSize(container);
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  const mainCameraPosition = new THREE.Vector3(0, 0.2, 15);
  const mainLookAt = new THREE.Vector3(0, 0, -5.6);
  const desiredCameraPosition = mainCameraPosition.clone();
  const desiredLookAt = mainLookAt.clone();
  const currentLookAt = mainLookAt.clone();
  const cursorOffset = new THREE.Vector2();
  const raycastPointer = new THREE.Vector2(2, 2);
  const raycaster = new THREE.Raycaster();
  camera.position.copy(mainCameraPosition);
  camera.lookAt(mainLookAt);

  let renderer: THREE.WebGLRenderer | null = null;
  let animationFrameId: number | null = null;
  let isAnimating = false;
  let isDisposed = false;
  let lastFrameTime = performance.now();
  let elapsedSeconds = 0;
  let activeView: UniverseView = "main";
  let selectedPanel: StarStationArtworkPanel | null = null;
  let hoveredTarget: InteractiveTarget | null = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let panels: StarStationArtworkPanel[] = [];

  const cosmicField = createCosmicField({ isMobile });
  const aboutBeacon = createAboutBeacon({ isMobile });
  const navigationConstellation = createNavigationConstellation({ isMobile });
  const galleryConstellation = createGalleryConstellation({ artworks, isMobile });
  scene.add(
    cosmicField.group,
    navigationConstellation.group,
    galleryConstellation.group,
    aboutBeacon.group,
  );

  const getActiveInteractiveObjects = (): THREE.Object3D[] => {
    if (activeView === "main") {
      return navigationConstellation.interactiveObjects;
    }

    if (activeView === "gallery") {
      return galleryConstellation.interactiveObjects;
    }

    return [];
  };

  const setHoveredTarget = (target: InteractiveTarget | null) => {
    if (hoveredTarget === target) {
      return;
    }

    if (hoveredTarget?.type === "navigation") {
      navigationConstellation.setHighlighted(hoveredTarget.destination, false);
    }
    if (hoveredTarget?.type === "artwork") {
      galleryConstellation.setHighlighted(hoveredTarget.panel.artwork.id, false);
    }

    hoveredTarget = target;
    onHoverChange(target?.type === "artwork" ? target.panel.artwork : null);
    onNavigationHover(target?.type === "navigation" ? target.destination : null);

    if (target?.type === "navigation") {
      navigationConstellation.setHighlighted(target.destination, true);
    }
    if (target?.type === "artwork") {
      galleryConstellation.setHighlighted(target.panel.artwork.id, true);
    }

    if (renderer) {
      renderer.domElement.style.cursor = target ? "pointer" : "default";
    }
  };

  try {
    renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "manipulation";
    container.replaceChildren(renderer.domElement);

    panels = await createArtworkPanels(artworks, { useStackedDetails: useStackedArtworkDetails });
    if (panels.length === 0) {
      throw new Error("No StarStation artwork texture could be loaded.");
    }

    const interactiveTargets = new Map<THREE.Object3D, InteractiveTarget>();
    panels.forEach((panel) => {
      panel.group.visible = false;
      scene.add(panel.group);
      interactiveTargets.set(panel.interactiveMesh, { type: "artwork", panel });
    });
    navigationConstellation.interactiveObjects.forEach((object) => {
      const destination = object.name.replace("star-station-navigation-hit-", "") as StarStationNavigationDestination;
      interactiveTargets.set(object, { type: "navigation", destination });
    });
    galleryConstellation.interactiveObjects.forEach((object) => {
      const artworkId = object.name.replace("star-station-gallery-hit-", "");
      const panel = panels.find((candidate) => candidate.artwork.id === artworkId);
      if (panel) {
        interactiveTargets.set(object, { type: "artwork", panel });
      }
    });

    const setCameraTarget = (position: THREE.Vector3, lookAt: THREE.Vector3) => {
      desiredCameraPosition.copy(position);
      desiredLookAt.copy(lookAt);
    };

    const setView = (view: UniverseView, artworkId: string | null = null) => {
      activeView = view;
      selectedPanel = view === "artwork"
        ? panels.find((panel) => panel.artwork.id === artworkId) ?? null
        : null;
      setHoveredTarget(null);

      navigationConstellation.setActive(view === "main");
      galleryConstellation.setActive(view === "gallery");
      galleryConstellation.setSelected(view === "gallery" ? null : artworkId);
      aboutBeacon.group.visible = view === "about-project" || view === "about-me";
      aboutBeacon.setTab(view === "about-me" ? "me" : "project");
      aboutBeacon.setSelected(view === "about-project" || view === "about-me");
      panels.forEach((panel) => {
        panel.group.visible = panel === selectedPanel;
        panel.setSelected(panel === selectedPanel);
      });

      cosmicField.setFocused(view !== "main");
      cosmicField.setAboutMode(view === "about-me" ? "me" : view === "about-project" ? "project" : null);

      if (view === "gallery") {
        setCameraTarget(
          new THREE.Vector3(galleryConstellation.position.x, galleryConstellation.position.y + 0.25, galleryConstellation.position.z + 10.6),
          galleryConstellation.position,
        );
      } else if (view === "about-project" || view === "about-me") {
        setCameraTarget(
          new THREE.Vector3(aboutBeacon.position.x, aboutBeacon.position.y + 0.08, aboutBeacon.position.z + 4.8),
          aboutBeacon.position,
        );
      } else if (selectedPanel) {
        setCameraTarget(
          new THREE.Vector3(
            selectedPanel.group.position.x,
            selectedPanel.group.position.y + (useStackedArtworkDetails ? -0.35 : 0.05),
            selectedPanel.group.position.z + (useStackedArtworkDetails ? 7.2 : 6.1),
          ),
          selectedPanel.group.position,
        );
      } else {
        setCameraTarget(mainCameraPosition, mainLookAt);
      }

      onArtworkChange(selectedPanel?.artwork ?? null);
    };

    const resolveTargetAtPointer = (): InteractiveTarget | null => {
      raycaster.setFromCamera(raycastPointer, camera);
      const intersections = raycaster.intersectObjects(getActiveInteractiveObjects(), false);
      const firstHit = intersections[0];

      return firstHit ? interactiveTargets.get(firstHit.object) ?? null : null;
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = renderer?.domElement.getBoundingClientRect();
      if (!bounds || bounds.width === 0 || bounds.height === 0) {
        return;
      }

      raycastPointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      cursorOffset.set(raycastPointer.x, raycastPointer.y);
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      setHoveredTarget(resolveTargetAtPointer());
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      updatePointer(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      const pointerTravel = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY);
      if (pointerTravel > 10) {
        return;
      }

      updatePointer(event);
      const target = resolveTargetAtPointer();
      if (target?.type === "navigation") {
        onNavigateRequest(target.destination);
      }
      if (target?.type === "artwork") {
        onArtworkRequest(target.panel.artwork.id);
      }
    };

    const onPointerLeave = () => {
      cursorOffset.set(0, 0);
      setHoveredTarget(null);
    };

    const onResize = () => {
      if (!renderer || isDisposed) {
        return;
      }

      const nextSize = getContainerSize(container);
      camera.aspect = nextSize.width / nextSize.height;
      camera.updateProjectionMatrix();
      renderer.setSize(nextSize.width, nextSize.height, false);
    };

    const stopAnimation = () => {
      isAnimating = false;
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const animate = (now: number) => {
      if (!isAnimating || !renderer || isDisposed) {
        return;
      }

      const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      elapsedSeconds += deltaSeconds;

      if (activeView === "main" && !reducedMotion) {
        desiredCameraPosition.x = mainCameraPosition.x + cursorOffset.x * 0.48;
        desiredCameraPosition.y = mainCameraPosition.y + cursorOffset.y * 0.32;
      }

      camera.position.lerp(desiredCameraPosition, reducedMotion ? 0.13 : 0.055);
      currentLookAt.lerp(desiredLookAt, reducedMotion ? 0.14 : 0.08);
      camera.lookAt(currentLookAt);
      cosmicField.update(deltaSeconds, reducedMotion);
      navigationConstellation.update(deltaSeconds, reducedMotion);
      galleryConstellation.update(deltaSeconds, reducedMotion);
      aboutBeacon.update(deltaSeconds, elapsedSeconds, reducedMotion);
      selectedPanel?.update(elapsedSeconds, reducedMotion);
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (isAnimating || isDisposed || document.hidden) {
        return;
      }

      isAnimating = true;
      lastFrameTime = performance.now();
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    setView("main");
    startAnimation();

    return {
      setView,
      dispose: () => {
        if (isDisposed) {
          return;
        }

        isDisposed = true;
        stopAnimation();
        renderer?.domElement.removeEventListener("pointermove", onPointerMove);
        renderer?.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer?.domElement.removeEventListener("pointerup", onPointerUp);
        renderer?.domElement.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        setHoveredTarget(null);
        panels.forEach((panel) => {
          scene.remove(panel.group);
          panel.dispose();
        });
        scene.remove(
          aboutBeacon.group,
          cosmicField.group,
          navigationConstellation.group,
          galleryConstellation.group,
        );
        aboutBeacon.dispose();
        cosmicField.dispose();
        navigationConstellation.dispose();
        galleryConstellation.dispose();
        renderer?.renderLists.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
        renderer?.domElement.remove();
        renderer = null;
      },
    };
  } catch (error) {
    panels.forEach((panel) => panel.dispose());
    scene.remove(
      aboutBeacon.group,
      cosmicField.group,
      navigationConstellation.group,
      galleryConstellation.group,
    );
    aboutBeacon.dispose();
    cosmicField.dispose();
    navigationConstellation.dispose();
    galleryConstellation.dispose();
    renderer?.renderLists.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    throw error;
  }
}
