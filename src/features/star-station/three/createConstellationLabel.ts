import * as THREE from "three";

export interface StarStationConstellationLabel {
  sprite: THREE.Sprite;
  dispose: () => void;
}

export function createConstellationLabel(
  text: string,
  color: string,
  scale = 1,
): StarStationConstellationLabel {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 112;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas text labels are unavailable in this browser.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "700 34px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = 7;
  context.strokeStyle = "rgba(3, 1, 14, 0.92)";
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    opacity: 0.96,
  });
  const sprite = new THREE.Sprite(material);
  const textWidth = Math.max(1.25, context.measureText(text).width / 120);
  sprite.scale.set(textWidth * scale, 0.3 * scale, 1);

  return {
    sprite,
    dispose: () => {
      texture.dispose();
      material.dispose();
    },
  };
}
