import * as THREE from "three";
import type { StarStationArtwork } from "../types/artwork";

export interface StarStationArtworkPanel {
  artwork: StarStationArtwork;
  group: THREE.Group;
  interactiveMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  setHighlighted: (highlighted: boolean) => void;
  setSelected: (selected: boolean) => void;
  update: (elapsedSeconds: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

interface CreateArtworkPanelsOptions {
  useStackedDetails: boolean;
}

const PANEL_HEIGHT = 2.7;
const MIN_PANEL_WIDTH = 1.8;
const MAX_PANEL_WIDTH = 4.7;
const DETAILS_PANEL_WIDTH = 2.65;
const DETAILS_PANEL_HEIGHT = 2.15;
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

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(/\s+/);
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
      return;
    }

    line = candidate;
  });

  if (line) {
    context.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function createArtworkDetailsTexture(artwork: StarStationArtwork): { texture: THREE.CanvasTexture; dispose: () => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 720;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas details are unavailable in this browser.");
  }

  context.fillStyle = "rgba(8, 5, 27, 0.96)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#3d56b6";
  context.lineWidth = 12;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  context.fillStyle = "#ff78c8";
  context.fillRect(44, 52, 10, canvas.height - 104);

  const contentX = 86;
  const contentWidth = canvas.width - contentX - 56;
  let cursorY = 104;

  context.font = "700 34px monospace";
  context.fillStyle = "#68b5ff";
  context.fillText("ARCHIVE ITEM", contentX, cursorY);
  cursorY += 68;

  context.font = "700 42px monospace";
  context.fillStyle = "#f2efff";
  cursorY = drawWrappedText(context, artwork.title, contentX, cursorY, contentWidth, 54) + 24;

  context.font = "30px monospace";
  context.fillStyle = "#d4d0e8";
  cursorY = drawWrappedText(context, artwork.alt, contentX, cursorY, contentWidth, 42) + 38;

  context.font = "700 34px monospace";
  context.fillStyle = "#68b5ff";
  context.fillText("SOURCE", contentX, cursorY);
  cursorY += 56;

  context.font = "28px monospace";
  context.fillStyle = "#ffb3db";
  cursorY = drawWrappedText(context, artwork.src, contentX, cursorY, contentWidth, 38) + 28;

  context.font = "28px monospace";
  context.fillStyle = "#f2efff";
  context.fillText("Original archive artwork", contentX, Math.min(cursorY, canvas.height - 58));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return {
    texture,
    dispose: () => texture.dispose(),
  };
}

async function createArtworkPanel(
  textureLoader: THREE.TextureLoader,
  artwork: StarStationArtwork,
  index: number,
  total: number,
  useStackedDetails: boolean,
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

  const detailsTexture = createArtworkDetailsTexture(artwork);
  const detailsGeometry = new THREE.PlaneGeometry(DETAILS_PANEL_WIDTH, DETAILS_PANEL_HEIGHT);
  const detailsMaterial = new THREE.MeshBasicMaterial({
    map: detailsTexture.texture,
    transparent: true,
    opacity: 0.98,
    toneMapped: false,
  });
  const detailsPanel = new THREE.Mesh(detailsGeometry, detailsMaterial);
  const detailsBaseY = useStackedDetails
    ? -(PANEL_HEIGHT / 2 + DETAILS_PANEL_HEIGHT / 2 + 0.38)
    : 0.06;
  detailsPanel.position.set(
    useStackedDetails ? 0 : panelWidth / 2 + DETAILS_PANEL_WIDTH / 2 + 0.42,
    detailsBaseY,
    0.02,
  );
  const detailsFrameGeometry = new THREE.EdgesGeometry(detailsGeometry);
  const detailsFrameMaterial = new THREE.LineBasicMaterial({ color: 0x68b5ff, transparent: true, opacity: 0.92 });
  const detailsFrame = new THREE.LineSegments(detailsFrameGeometry, detailsFrameMaterial);
  detailsFrame.position.copy(detailsPanel.position);
  detailsFrame.position.z += 0.025;
  group.add(detailsPanel, detailsFrame);

  let isHighlighted = false;
  let isSelected = false;

  const refreshAppearance = () => {
    const isEmphasized = isHighlighted || isSelected;
    frameMaterial.color.set(isEmphasized ? 0xff4fc4 : 0x3d56b6);
    frameMaterial.opacity = isEmphasized ? 1 : 0.82;
    panelMaterial.color.set(isSelected ? 0x24093d : 0x100a2b);
    imageMaterial.opacity = isEmphasized ? 1 : 0.98;
    detailsPanel.visible = isSelected;
    detailsFrame.visible = isSelected;
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
    update: (elapsedSeconds, reducedMotion) => {
      if (!isSelected || reducedMotion) {
        detailsPanel.position.y = detailsBaseY;
        detailsFrame.position.y = detailsBaseY;
        return;
      }

      const floatingOffset = Math.sin(elapsedSeconds * 1.35 + index) * 0.045;
      detailsPanel.position.y = detailsBaseY + floatingOffset;
      detailsFrame.position.y = detailsBaseY + floatingOffset;
    },
    dispose: () => {
      panelGeometry.dispose();
      panelMaterial.dispose();
      imageGeometry.dispose();
      imageMaterial.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      detailsGeometry.dispose();
      detailsMaterial.dispose();
      detailsFrameGeometry.dispose();
      detailsFrameMaterial.dispose();
      detailsTexture.dispose();
      texture.dispose();
    },
  };
}

export async function createArtworkPanels(
  artworks: readonly StarStationArtwork[],
  { useStackedDetails }: CreateArtworkPanelsOptions,
): Promise<StarStationArtworkPanel[]> {
  const textureLoader = new THREE.TextureLoader();
  const settledPanels = await Promise.allSettled(
    artworks.map((artwork, index) => createArtworkPanel(
      textureLoader,
      artwork,
      index,
      artworks.length,
      useStackedDetails,
    )),
  );

  return settledPanels.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}
