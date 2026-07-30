import * as THREE from "three";
import type { StarStationAboutTab } from "../types/artwork";

interface CosmicFieldOptions {
  isMobile: boolean;
}

export interface StarStationCosmicField {
  group: THREE.Group;
  setFocused: (focused: boolean) => void;
  setAboutMode: (tab: StarStationAboutTab | null) => void;
  update: (deltaSeconds: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

function createDeterministicRandom(seed: number): () => number {
  let currentSeed = seed;

  return () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0;
    return currentSeed / 4294967296;
  };
}

function createPointCloud(
  count: number,
  spread: number,
  color: number,
  size: number,
  opacity: number,
  seed: number,
): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
  const random = createDeterministicRandom(seed);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * spread;
    positions[offset + 1] = (random() - 0.5) * spread * 0.62;
    positions[offset + 2] = -random() * spread - 5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

function createOrbitLine(radius: number, color: number, rotation: THREE.Euler): THREE.LineLoop {
  const points: THREE.Vector3[] = [];

  for (let pointIndex = 0; pointIndex < 72; pointIndex += 1) {
    const angle = (pointIndex / 72) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.48, -6));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.22,
  });
  const line = new THREE.LineLoop(geometry, material);
  line.rotation.copy(rotation);

  return line;
}

export function createCosmicField({ isMobile }: CosmicFieldOptions): StarStationCosmicField {
  const group = new THREE.Group();
  const stars = createPointCloud(isMobile ? 400 : 1050, 58, 0xb3c5ff, isMobile ? 0.055 : 0.07, 0.84, 42);
  const dust = createPointCloud(isMobile ? 90 : 230, 30, 0xff78c8, isMobile ? 0.035 : 0.05, 0.4, 84);
  const orbitGroup = new THREE.Group();
  orbitGroup.add(
    createOrbitLine(8.4, 0x3d56b6, new THREE.Euler(0.14, 0.22, 0.16)),
    createOrbitLine(11.5, 0x6b0455, new THREE.Euler(-0.28, 0.08, -0.12)),
  );
  group.add(stars, dust, orbitGroup);

  let aboutMode: StarStationAboutTab | null = null;

  return {
    group,
    setFocused: (focused) => {
      stars.material.opacity = focused ? 0.34 : 0.84;
      dust.material.opacity = focused ? 0.16 : 0.4;
      orbitGroup.visible = !focused;
    },
    setAboutMode: (tab) => {
      aboutMode = tab;
      stars.material.color.set(tab === "me" ? 0xffafd8 : 0xb3c5ff);
      dust.material.color.set(tab === "project" ? 0x68b5ff : 0xff78c8);
    },
    update: (deltaSeconds, reducedMotion) => {
      if (reducedMotion) {
        return;
      }

      stars.rotation.y += deltaSeconds * (aboutMode === "me" ? 0.011 : 0.006);
      dust.rotation.y -= deltaSeconds * (aboutMode === "project" ? 0.006 : 0.012);
    },
    dispose: () => {
      stars.geometry.dispose();
      stars.material.dispose();
      dust.geometry.dispose();
      dust.material.dispose();
      orbitGroup.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
    },
  };
}
