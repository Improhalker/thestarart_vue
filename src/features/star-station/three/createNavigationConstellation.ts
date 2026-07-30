import * as THREE from "three";
import type { StarStationNavigationDestination } from "../types/artwork";
import { starStationNavigationPoints } from "../utils/navigation";
import { createConstellationLabel } from "./createConstellationLabel";

interface CreateNavigationConstellationOptions {
  isMobile: boolean;
}

interface NavigationNode {
  destination: StarStationNavigationDestination;
  interactiveObject: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  setHighlighted: (highlighted: boolean) => void;
  dispose: () => void;
}

export interface StarStationNavigationConstellation {
  group: THREE.Group;
  interactiveObjects: THREE.Object3D[];
  setActive: (active: boolean) => void;
  setHighlighted: (destination: StarStationNavigationDestination, highlighted: boolean) => void;
  update: (deltaSeconds: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

const NAVIGATION_POSITIONS: Record<StarStationNavigationDestination, readonly [number, number, number]> = {
  home: [-4.4, 1.45, -6.8],
  "about-project": [0, 3.25, -7.2],
  "about-me": [4.25, 1.25, -6.8],
  gallery: [0, -2.9, -7.1],
};

const NAVIGATION_COLORS: Record<StarStationNavigationDestination, number> = {
  home: 0x68b5ff,
  "about-project": 0x8b7bff,
  "about-me": 0xff78c8,
  gallery: 0xff4fc4,
};

function createConnectionLines(): { line: THREE.LineSegments; dispose: () => void } {
  const positions = new Float32Array([
    -4.4, 1.45, -6.8, 0, 3.25, -7.2,
    0, 3.25, -7.2, 4.25, 1.25, -6.8,
    4.25, 1.25, -6.8, 0, -2.9, -7.1,
    0, -2.9, -7.1, -4.4, 1.45, -6.8,
  ]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0x3d56b6,
    transparent: true,
    opacity: 0.48,
  });

  return {
    line: new THREE.LineSegments(geometry, material),
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

function createNavigationNode(
  destination: StarStationNavigationDestination,
  label: string,
  color: number,
  position: readonly [number, number, number],
  isMobile: boolean,
): NavigationNode {
  const group = new THREE.Group();
  group.position.set(...position);
  group.name = `star-station-navigation-${destination}`;

  const coreGeometry = new THREE.OctahedronGeometry(isMobile ? 0.19 : 0.24, 0);
  const coreMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.96 });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);

  const ringGeometry = new THREE.RingGeometry(isMobile ? 0.31 : 0.38, isMobile ? 0.35 : 0.43, 28);
  const ringMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.z = -0.015;

  const hitGeometry = new THREE.SphereGeometry(isMobile ? 0.58 : 0.68, 12, 10);
  const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false });
  const hitArea = new THREE.Mesh(hitGeometry, hitMaterial);
  hitArea.name = `star-station-navigation-hit-${destination}`;

  const labelSprite = createConstellationLabel(label, "#e7ecff", isMobile ? 1 : 3);
  labelSprite.sprite.position.set(0, isMobile ? 0.48 : 0.58, 0);
  group.add(core, ring, hitArea, labelSprite.sprite);

  let highlighted = false;
  const refreshAppearance = () => {
    coreMaterial.opacity = highlighted ? 1 : 0.96;
    ringMaterial.opacity = highlighted ? 1 : 0.72;
    group.scale.setScalar(highlighted ? 1.18 : 1);
  };

  return {
    destination,
    interactiveObject: hitArea,
    setHighlighted: (nextHighlighted) => {
      highlighted = nextHighlighted;
      refreshAppearance();
    },
    dispose: () => {
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      hitGeometry.dispose();
      hitMaterial.dispose();
      labelSprite.dispose();
    },
  };
}

export function createNavigationConstellation({ isMobile }: CreateNavigationConstellationOptions): StarStationNavigationConstellation {
  const group = new THREE.Group();
  group.name = "star-station-main-constellation";
  const nodes = starStationNavigationPoints.map((point) => createNavigationNode(
    point.id,
    point.label,
    NAVIGATION_COLORS[point.id],
    NAVIGATION_POSITIONS[point.id],
    isMobile,
  ));
  const connections = createConnectionLines();
  group.add(connections.line);
  nodes.forEach((node) => group.add(node.interactiveObject.parent!));

  return {
    group,
    interactiveObjects: nodes.map((node) => node.interactiveObject),
    setActive: (active) => {
      group.visible = active;
      if (!active) {
        nodes.forEach((node) => node.setHighlighted(false));
      }
    },
    setHighlighted: (destination, highlighted) => {
      nodes.find((node) => node.destination === destination)?.setHighlighted(highlighted);
    },
    update: () => undefined,
    dispose: () => {
      nodes.forEach((node) => node.dispose());
      connections.dispose();
    },
  };
}
