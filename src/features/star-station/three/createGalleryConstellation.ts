import * as THREE from "three";
import type { StarStationArtwork } from "../types/artwork";
import { createConstellationLabel } from "./createConstellationLabel";

interface CreateGalleryConstellationOptions {
  artworks: readonly StarStationArtwork[];
  isMobile: boolean;
}

interface GalleryStar {
  artwork: StarStationArtwork;
  interactiveObject: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  setHighlighted: (highlighted: boolean) => void;
  setSelected: (selected: boolean) => void;
  dispose: () => void;
}

export interface StarStationGalleryConstellation {
  group: THREE.Group;
  position: THREE.Vector3;
  interactiveObjects: THREE.Object3D[];
  setActive: (active: boolean) => void;
  setHighlighted: (artworkId: string, highlighted: boolean) => void;
  setSelected: (artworkId: string | null) => void;
  update: (deltaSeconds: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

const GALLERY_POSITION = new THREE.Vector3(9.2, -0.9, -8.2);
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function getStarPosition(index: number, total: number): THREE.Vector3 {
  const angle = index * GOLDEN_ANGLE + Math.PI / 7;
  const radius = 1.7 + Math.floor(index / 3) * 1.15 + (index % 2) * 0.28;

  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.68,
    -Math.min(index / Math.max(total, 1), 1) * 0.7,
  );
}

function createGalleryStar(
  artwork: StarStationArtwork,
  index: number,
  total: number,
  isMobile: boolean,
): GalleryStar {
  const group = new THREE.Group();
  group.position.copy(getStarPosition(index, total));
  group.name = `star-station-gallery-star-${artwork.id}`;

  const color = index % 2 === 0 ? 0x68b5ff : 0xff78c8;
  const coreGeometry = new THREE.SphereGeometry(isMobile ? 0.13 : 0.16, 10, 8);
  const coreMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.94 });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  const haloGeometry = new THREE.RingGeometry(isMobile ? 0.21 : 0.25, isMobile ? 0.24 : 0.29, 20);
  const haloMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.position.z = -0.012;

  const hitGeometry = new THREE.SphereGeometry(isMobile ? 0.42 : 0.52, 12, 10);
  const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false });
  const hitArea = new THREE.Mesh(hitGeometry, hitMaterial);
  hitArea.name = `star-station-gallery-hit-${artwork.id}`;

  const label = createConstellationLabel(artwork.title, "#ffd0e8", isMobile ? 0.66 : 1.08);
  label.sprite.position.set(0, isMobile ? 0.34 : 0.42, 0);
  label.sprite.visible = false;
  group.add(core, halo, hitArea, label.sprite);

  let highlighted = false;
  let selected = false;
  const refreshAppearance = () => {
    const emphasized = highlighted || selected;
    coreMaterial.opacity = emphasized ? 1 : 0.94;
    haloMaterial.opacity = emphasized ? 1 : 0.5;
    label.sprite.visible = emphasized;
    group.scale.setScalar(selected ? 1.2 : highlighted ? 1.12 : 1);
  };

  return {
    artwork,
    interactiveObject: hitArea,
    setHighlighted: (nextHighlighted) => {
      highlighted = nextHighlighted;
      refreshAppearance();
    },
    setSelected: (nextSelected) => {
      selected = nextSelected;
      refreshAppearance();
    },
    dispose: () => {
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      hitGeometry.dispose();
      hitMaterial.dispose();
      label.dispose();
    },
  };
}

function createConnectionLines(points: readonly THREE.Vector3[]): { line: THREE.Line; dispose: () => void } {
  const geometry = new THREE.BufferGeometry().setFromPoints([...points, points[0]!]);
  const material = new THREE.LineBasicMaterial({
    color: 0x6b45aa,
    transparent: true,
    opacity: 0.42,
  });

  return {
    line: new THREE.Line(geometry, material),
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

export function createGalleryConstellation({ artworks, isMobile }: CreateGalleryConstellationOptions): StarStationGalleryConstellation {
  const group = new THREE.Group();
  group.name = "star-station-gallery-constellation";
  group.position.copy(GALLERY_POSITION);
  group.visible = false;
  const stars = artworks.map((artwork, index) => createGalleryStar(artwork, index, artworks.length, isMobile));
  const connections = createConnectionLines(stars.map((star) => star.interactiveObject.parent!.position));
  group.add(connections.line);
  stars.forEach((star) => group.add(star.interactiveObject.parent!));

  return {
    group,
    position: GALLERY_POSITION.clone(),
    interactiveObjects: stars.map((star) => star.interactiveObject),
    setActive: (active) => {
      group.visible = active;
      if (!active) {
        stars.forEach((star) => {
          star.setHighlighted(false);
          star.setSelected(false);
        });
      }
    },
    setHighlighted: (artworkId, highlighted) => {
      stars.find((star) => star.artwork.id === artworkId)?.setHighlighted(highlighted);
    },
    setSelected: (artworkId) => {
      stars.forEach((star) => star.setSelected(star.artwork.id === artworkId));
    },
    update: () => undefined,
    dispose: () => {
      stars.forEach((star) => star.dispose());
      connections.dispose();
    },
  };
}
