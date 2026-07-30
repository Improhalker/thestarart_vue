import * as THREE from "three";
import type { StarStationAboutTab } from "../types/artwork";

interface CreateAboutBeaconOptions {
  isMobile: boolean;
}

export interface StarStationAboutBeacon {
  group: THREE.Group;
  position: THREE.Vector3;
  interactiveObjects: readonly THREE.Object3D[];
  setHighlighted: (highlighted: boolean) => void;
  setSelected: (selected: boolean) => void;
  setTab: (tab: StarStationAboutTab) => void;
  update: (deltaSeconds: number, elapsedSeconds: number, reducedMotion: boolean) => void;
  dispose: () => void;
}

const ABOUT_POSITION = new THREE.Vector3(-6.1, 4.35, -7.6);

function createConstellationParticles(count: number): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = 0.34 + (index % 7) * 0.09;
    const offset = index * 3;
    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = Math.sin(angle) * radius * 0.7;
    positions[offset + 2] = ((index % 5) - 2) * 0.08;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xff78c8,
      size: 0.045,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
}

function createTechnicalNetwork(): {
  group: THREE.Group;
  nodeMaterials: THREE.MeshBasicMaterial[];
  lineMaterial: THREE.LineBasicMaterial;
  dispose: () => void;
} {
  const group = new THREE.Group();
  const nodePositions = [
    new THREE.Vector3(-0.82, 0.46, 0),
    new THREE.Vector3(-0.08, 0.72, 0.08),
    new THREE.Vector3(0.76, 0.22, -0.04),
    new THREE.Vector3(0.18, -0.68, 0.03),
  ];
  const nodeGeometry = new THREE.SphereGeometry(0.075, 10, 8);
  const nodeMaterials = [0x68b5ff, 0xff4fc4, 0x8b7bff, 0x68b5ff].map(
    (color) => new THREE.MeshBasicMaterial({ color }),
  );

  nodePositions.forEach((position, index) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterials[index]);
    node.position.copy(position);
    group.add(node);
  });

  const connections = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 0],
  ] as const;
  const positions = new Float32Array(connections.length * 6);
  connections.forEach(([from, to], index) => {
    const fromPosition = nodePositions[from];
    const toPosition = nodePositions[to];
    if (!fromPosition || !toPosition) {
      return;
    }

    positions.set(fromPosition.toArray(), index * 6);
    positions.set(toPosition.toArray(), index * 6 + 3);
  });
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x68b5ff,
    transparent: true,
    opacity: 0.66,
  });
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  return {
    group,
    nodeMaterials,
    lineMaterial,
    dispose: () => {
      nodeGeometry.dispose();
      nodeMaterials.forEach((material) => material.dispose());
      lineGeometry.dispose();
      lineMaterial.dispose();
    },
  };
}

function createArtisticConstellation(isMobile: boolean): {
  group: THREE.Group;
  particles: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  lineMaterial: THREE.LineBasicMaterial;
  dispose: () => void;
} {
  const group = new THREE.Group();
  const particles = createConstellationParticles(isMobile ? 36 : 76);
  const constellationPoints = [
    new THREE.Vector3(-0.82, -0.15, 0),
    new THREE.Vector3(-0.32, 0.52, 0),
    new THREE.Vector3(0.28, 0.22, 0),
    new THREE.Vector3(0.72, 0.63, 0),
    new THREE.Vector3(0.58, -0.48, 0),
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(constellationPoints);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xff78c8,
    transparent: true,
    opacity: 0.54,
  });
  group.add(particles, new THREE.Line(lineGeometry, lineMaterial));

  return {
    group,
    particles,
    lineMaterial,
    dispose: () => {
      particles.geometry.dispose();
      particles.material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    },
  };
}

export function createAboutBeacon({ isMobile }: CreateAboutBeaconOptions): StarStationAboutBeacon {
  const group = new THREE.Group();
  group.name = "star-station-about-beacon";
  group.position.copy(ABOUT_POSITION);
  group.lookAt(0, 0, 10);

  const coreGeometry = new THREE.IcosahedronGeometry(0.34, 1);
  const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x68b5ff, transparent: true, opacity: 0.96 });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);

  const ringGeometry = new THREE.TorusGeometry(0.62, 0.018, 6, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x3d56b6, transparent: true, opacity: 0.8 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.set(0.46, -0.22, 0.12);

  const secondRingGeometry = new THREE.TorusGeometry(0.82, 0.012, 5, 28);
  const secondRingMaterial = new THREE.MeshBasicMaterial({ color: 0xff4fc4, transparent: true, opacity: 0.42 });
  const secondRing = new THREE.Mesh(secondRingGeometry, secondRingMaterial);
  secondRing.rotation.set(-0.38, 0.18, -0.24);

  const hitAreaGeometry = new THREE.SphereGeometry(0.88, 12, 10);
  const hitAreaMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false });
  const hitArea = new THREE.Mesh(hitAreaGeometry, hitAreaMaterial);
  hitArea.name = "star-station-about-interactive";

  const technicalNetwork = createTechnicalNetwork();
  const artisticConstellation = createArtisticConstellation(isMobile);
  technicalNetwork.group.visible = false;
  artisticConstellation.group.visible = false;
  group.add(core, ring, secondRing, hitArea, technicalNetwork.group, artisticConstellation.group);

  let isHighlighted = false;
  let isSelected = false;
  let activeTab: StarStationAboutTab = "project";

  const refreshAppearance = () => {
    const emphasized = isHighlighted || isSelected;
    const projectActive = isSelected && activeTab === "project";
    const meActive = isSelected && activeTab === "me";

    coreMaterial.color.set(meActive ? 0xff78c8 : 0x68b5ff);
    ringMaterial.color.set(projectActive ? 0x68b5ff : 0xff4fc4);
    ringMaterial.opacity = emphasized ? 1 : 0.8;
    secondRingMaterial.opacity = emphasized ? 0.76 : 0.42;
    technicalNetwork.group.visible = projectActive;
    artisticConstellation.group.visible = meActive;
    group.scale.setScalar(isSelected ? 1.14 : isHighlighted ? 1.06 : 1);
  };

  return {
    group,
    position: ABOUT_POSITION.clone(),
    interactiveObjects: [hitArea],
    setHighlighted: (highlighted) => {
      isHighlighted = highlighted;
      refreshAppearance();
    },
    setSelected: (selected) => {
      isSelected = selected;
      refreshAppearance();
    },
    setTab: (tab) => {
      activeTab = tab;
      refreshAppearance();
    },
    update: (deltaSeconds, elapsedSeconds, reducedMotion) => {
      if (reducedMotion) {
        return;
      }

      core.rotation.x += deltaSeconds * 0.2;
      core.rotation.y += deltaSeconds * 0.32;
      ring.rotation.z += deltaSeconds * 0.14;
      secondRing.rotation.z -= deltaSeconds * 0.09;

      if (isSelected && activeTab === "project") {
        const pulse = 0.72 + (Math.sin(elapsedSeconds * 3.1) + 1) * 0.14;
        technicalNetwork.lineMaterial.opacity = pulse;
        technicalNetwork.nodeMaterials.forEach((material, index) => {
          material.opacity = 0.72 + (Math.sin(elapsedSeconds * 2.2 + index) + 1) * 0.14;
          material.transparent = true;
        });
        technicalNetwork.group.rotation.z += deltaSeconds * 0.08;
      }

      if (isSelected && activeTab === "me") {
        artisticConstellation.particles.rotation.z -= deltaSeconds * 0.14;
        artisticConstellation.group.rotation.y += deltaSeconds * 0.1;
        artisticConstellation.lineMaterial.opacity = 0.4 + (Math.sin(elapsedSeconds * 1.8) + 1) * 0.12;
      }
    },
    dispose: () => {
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      secondRingGeometry.dispose();
      secondRingMaterial.dispose();
      hitAreaGeometry.dispose();
      hitAreaMaterial.dispose();
      technicalNetwork.dispose();
      artisticConstellation.dispose();
    },
  };
}
