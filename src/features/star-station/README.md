# StarStation

## Purpose

`StarStation` is an independent route (`/star-station`) that presents the drawings in
`public/images/desenhos` inside a Three.js scene. It does not use `DefaultLayout`, so
the public navbar, player, chat, and other public widgets are not started for this route.

## Structure

```text
src/features/star-station/
|- components/
|  |- StarStationFallback.vue   # HTML fallback when WebGL is unavailable
|  `- StarStationIntro.vue      # entry screen
|  `- StarStationAboutPanel.vue # accessible About tabs over the scene
|- composables/useStarStation.ts # Vue state and scene lifecycle
|- styles/star-station.css       # feature-scoped tokens and canvas effects
|- three/
|  |- createArtworkPanels.ts    # textures, original aspect ratio, and frames
|  |- createAboutBeacon.ts      # About point of interest and tab reactions
|  |- createCosmicField.ts      # stars, dust, and orbit lines
|  `- createStarStationScene.ts # renderer, camera, raycasting, and cleanup
|- types/artwork.ts
|- utils/artworks.ts             # single artwork data source
`- views/StarStationView.vue     # route and accessible HTML controls
```

## Runtime flow

1. The router lazy-loads `StarStationView.vue` and the `three` chunk only when
   `/star-station` is visited.
2. The entry screen waits for an explicit user action. Then `useStarStation` creates
   the scene inside the canvas host.
3. `createArtworkPanels` loads the centralized paths and reads the texture dimensions
   to preserve every drawing's original aspect ratio.
4. Raycasting detects cursor or touch selection. The Vue UI shows the title, while the
   HTML station index offers the same selection without using the canvas.
5. Leaving the route calls `dispose()`, which cancels animation frames and listeners,
   disposes geometries, materials, textures, the renderer, and its WebGL context.

## About node

`ABOUT.NODE` is a pre-created Three.js point of interest that is separate from every
artwork panel. Selecting it moves the camera toward the beacon and opens an HTML panel
with accessible `About the Project` and `About Me` tabs.

- `project` activates a technical node network and subtle infrastructure pulses.
- `me` activates organic particles and a small constellation.
- Both visual states are created once with the scene. Tab changes only switch visibility,
  material properties, and animation state; they never recreate the renderer or geometry.
- The fallback contains an accessible text version of both About topics.

## Adding a drawing

1. Add the file to `public/images/desenhos/`; do not rename existing files.
2. Add only its filename to `artworkFiles` in `utils/artworks.ts`.
3. The title, public `src`, and alternative text are derived in that one location.
   Run `npm run type-check`, then open `/star-station` to confirm the texture.

This first version loads the seven available drawings. If the collection grows
substantially, keep a small initial selection and add sector-based texture loading
before adding dozens of images to the same scene.

## Accessibility and performance

- The scene starts from a user action, reports loading state, and has a real-image HTML fallback.
- The archive index is keyboard accessible and does not depend on hover.
- `prefers-reduced-motion` disables ambient movement; animation pauses in hidden tabs.
- Mobile uses fewer particles, a lower `devicePixelRatio`, and no antialiasing.
- The renderer uses `BufferGeometry` and does not create objects in the animation loop.
