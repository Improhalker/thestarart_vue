import * as THREE from "three";
import type { StarStationArtwork } from "../types/artwork";

export interface StarStationArtworkPanel {
  artwork: StarStationArtwork;
  group: THREE.Group;
  interactiveMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  setHighlighted: (highlighted: boolean) => void;
  setSelected: (selected: boolean) => void;
  dispose: () => void;
}

const PANEL_HEIGHT = 2.7;
const MIN_PANEL_WIDTH = 1.8;
const MAX_PANEL_WIDTH = 4.7;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const PANEL_POSITION_OVERRIDES: Readonly<Record<string, readonly [number, number, number]>> = {
  // These two portrait-oriented pieces need separate visual corridors in the overview.
  jujutsu: [1.1, -2.7, -5.8],
  makima: [8.4, -3.6, -7.5],
   madoka: [6.5, 1.2, -5.6],
};

function getPanelPosition(artwork: StarStationArtwork, index: number, total: number): THREE.Vector3 {
  const overriddenPosition = PANEL_POSITION_OVERRIDES[artwork.id];
  if (overriddenPosition) {
    return new THREE.Vector3(...overriddenPosition);
  }

  const angle = index * GOLDEN_ANGLE + Math.PI / 6;
  const ring = Math.floor(index / 3);
  const radius = 4.7 + ring * 2 + (index % 2) * 0.65;
  const verticalOffset = ((index % 3) - 1) * 1.75;

  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.58 + verticalOffset,
    -2.3 - (index % Math.max(total, 1)) * 0.72,
  );
}

async function createArtworkPanel(
  textureLoader: THREE.TextureLoader,
  artwork: StarStationArtwork,
  index: number,
  total: number,
): Promise<StarStationArtworkPanel> {
  const texture = await textureLoader.loadAsync(artwork.src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const textureImage = texture.image as { width: number; height: number };
  const aspectRatio = textureImage.width / textureImage.height;
  const panelWidth = THREE.MathUtils.clamp(
    PANEL_HEIGHT * aspectRatio,
    MIN_PANEL_WIDTH,
    MAX_PANEL_WIDTH,
  );

  const group = new THREE.Group();
  group.name = `star-station-artwork-${artwork.id}`;
  group.position.copy(getPanelPosition(artwork, index, total));
  group.rotation.set((index % 2 === 0 ? 1 : -1) * 0.045, Math.sin(index) * 0.14, 0);
  group.lookAt(0, 0, 10);

  const panelGeometry = new THREE.PlaneGeometry(panelWidth + 0.38, PANEL_HEIGHT + 0.38);
  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0x100a2b,
    transparent: true,
    opacity: 0.96,
  });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.z = -0.035;
  group.add(panel);

  const imageGeometry = new THREE.PlaneGeometry(panelWidth, PANEL_HEIGHT);
  const imageMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.98,
    toneMapped: false,
  });
  const interactiveMesh = new THREE.Mesh(imageGeometry, imageMaterial);
  interactiveMesh.name = `star-station-interactive-${artwork.id}`;
  group.add(interactiveMesh);

  const frameGeometry = new THREE.EdgesGeometry(panelGeometry);
  const frameMaterial = new THREE.LineBasicMaterial({
    color: 0x3d56b6,
    transparent: true,
    opacity: 0.82,
  });
  const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
  frame.position.z = 0.025;
  group.add(frame);

  let isHighlighted = false;
  let isSelected = false;

  const refreshAppearance = () => {
    const isEmphasized = isHighlighted || isSelected;
    frameMaterial.color.set(isEmphasized ? 0xff4fc4 : 0x3d56b6);
    frameMaterial.opacity = isEmphasized ? 1 : 0.82;
    panelMaterial.color.set(isSelected ? 0x24093d : 0x100a2b);
    imageMaterial.opacity = isEmphasized ? 1 : 0.98;
    group.scale.setScalar(isSelected ? 1.035 : isHighlighted ? 1.018 : 1);
  };

  return {
    artwork,
    group,
    interactiveMesh,
    setHighlighted: (highlighted) => {
      isHighlighted = highlighted;
      refreshAppearance();
    },
    setSelected: (selected) => {
      isSelected = selected;
      refreshAppearance();
    },
    dispose: () => {
      panelGeometry.dispose();
      panelMaterial.dispose();
      imageGeometry.dispose();
      imageMaterial.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      texture.dispose();
    },
  };
}

export async function createArtworkPanels(
  artworks: readonly StarStationArtwork[],
): Promise<StarStationArtworkPanel[]> {
  const textureLoader = new THREE.TextureLoader();
  const settledPanels = await Promise.allSettled(
    artworks.map((artwork, index) => createArtworkPanel(textureLoader, artwork, index, artworks.length)),
  );

  return settledPanels.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}
