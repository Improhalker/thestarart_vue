<script setup lang="ts">
import { computed } from "vue";
import { AlertTriangle, ArrowRight, Maximize2, Minus, Sparkles, Square, X } from "lucide-vue-next";
import type { ThumbnailState } from "./types";

const props = defineProps<{ state: ThumbnailState }>();

const title = computed(() => props.state.title.trim() || "LEARNING HOW TO DRAW SKIRTS");
const imageTransform = computed(() => `translate(${props.state.imageX}%, ${props.state.imageY}%) scale(${props.state.imageScale})`);
const activeImageStyle = computed(() => ({ transform: imageTransform.value }));
const templateTitle = computed(() => ({
  drawing: "Drawing.exe",
  gallery: "Gallery_Viewer.exe",
  error: "Drawing.exe - System Message",
  tutorial: "Tutorial.exe",
  "before-after": "Art_Comparison.exe",
})[props.state.template]);
</script>

<template>
  <div class="thumbnail-stage" aria-label="Prévia da thumbnail em 16 por 9">
    <div class="thumbnail-canvas" data-thumbnail-canvas>
      <div class="desktop-stars" aria-hidden="true"></div>

      <template v-if="state.template === 'error'">
        <div class="error-window">
          <div class="window-titlebar"><p class="window-titlebar__label"><AlertTriangle :size="18" aria-hidden="true" /> {{ templateTitle }}</p><X class="window-close" :size="16" aria-hidden="true" /></div>
          <div class="error-window__content">
            <div class="error-window__icon"><AlertTriangle aria-hidden="true" /></div>
            <div>
              <p class="error-window__message">YOUR DRAWING SKILLS HAVE BEEN SUCCESSFULLY UPDATED.</p>
              <p class="error-window__headline">{{ title }}</p>
            </div>
          </div>
          <div class="error-window__actions"><p>[ OK ]</p></div>
        </div>
      </template>

      <template v-else-if="state.template === 'before-after'">
        <div class="comparison-window">
          <div class="window-titlebar"><p class="window-titlebar__label">{{ templateTitle }}</p><div class="window-controls" aria-hidden="true"><Minus :size="15" /><Square :size="13" /><X :size="15" /></div></div>
          <div class="comparison-window__body">
            <div class="comparison-image"><img v-if="state.beforeImage" :src="state.beforeImage" alt="" /><p v-else>BEFORE IMAGE</p><p class="comparison-image__label">BEFORE</p></div>
            <div class="comparison-arrow"><ArrowRight aria-hidden="true" /></div>
            <div class="comparison-image"><img v-if="state.afterImage" :src="state.afterImage" alt="" /><p v-else>AFTER IMAGE</p><p class="comparison-image__label">AFTER</p></div>
          </div>
          <p class="comparison-window__title">{{ title }}</p>
        </div>
      </template>

      <template v-else>
        <div class="classic-window" :class="`classic-window--${state.template}`">
          <div class="window-titlebar" >
            <p class="window-titlebar__label"><Sparkles class="window-app-icon" :size="17" aria-hidden="true" /> {{ templateTitle }}</p>
            <div class="window-controls my-2" aria-hidden="true"><Minus :size="23" /><Maximize2 :size="23" /><X :size="23" /></div>
          </div>
          <div v-if="state.template === 'gallery'" class="gallery-menu"><p>File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Image&nbsp;&nbsp; Help</p><p>100%</p></div>
          <div class="classic-window__art-area">
            <img v-if="state.image" :src="state.image" alt="" :style="activeImageStyle">
            <div v-else class="art-placeholder"><p>SELECT YOUR ARTWORK</p><p>LOCAL IMAGE PREVIEW</p></div>
          </div>
          <p v-if="state.template === 'tutorial'" class="tutorial-chip">STEP 01 // CREATE</p>
          <p class="classic-window__headline">{{ title }}</p>
          <p v-if="state.template === 'gallery'" class="gallery-status">1 image(s) &nbsp; • &nbsp; image preview active</p>
        </div>
      </template>

      <div class="taskbar" aria-hidden="true"><div class="start-button"><img class="w-4 h-3" src="/images/ui/windows98.png" alt="windows icon"  /> <p class="mt-1">START</p> </div><p class="taskbar-app"><Sparkles :size="12" /> TheStarArt_</p><p class="clock">11:42 PM</p></div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail-stage { width: 100%; overflow: hidden; border: 2px solid var(--ui-border); background: #080219; box-shadow: 5px 5px 0 rgb(0 0 0 / 55%); aspect-ratio: 16 / 9; }
.thumbnail-canvas { position: relative; width: 100%; height: 100%; overflow: hidden; background: #0b0430; color: white; }
.desktop-stars { position: absolute; inset: 0; opacity: .75; background-image: url('/images/ui/p_thumbnailexport1.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; }
.classic-window, .comparison-window, .error-window { position: absolute; border: clamp(2px, .23vw, 4px) solid #f7d7ed; border-right-color: #370327; border-bottom-color: #370327; box-shadow: clamp(4px, .7vw, 10px) clamp(4px, .7vw, 10px) 0 rgb(0 0 0 / 65%); background: #d9b5ce; color: #250018; }
.classic-window { inset: 8.5% 8% 13%; display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto auto; }.classic-window--drawing { grid-template-rows: auto minmax(0, 1fr) auto; }.classic-window--tutorial { inset: 7% 10% 14%; }
.window-titlebar { display: flex; min-height: 8.5%; align-items: center; justify-content: space-between; gap: 1rem; overflow: hidden; background: linear-gradient(90deg, #6b0455, #19002d); padding: 0 1.2%; color: white; font-size: clamp(8px, 1.35vw, 22px); font-weight: 900; letter-spacing: .06em; white-space: nowrap; }.window-titlebar__label, .gallery-menu p, .error-window__actions p, .comparison-image p, .taskbar p { margin: 0; }.window-titlebar__label, .window-controls { display: inline-flex; align-items: center; gap: .35em; }.window-controls { gap: .42em; display: flex; }.window-controls :deep(svg) { background: #6b0455; padding: .2em .3em; }.window-close { box-sizing: content-box; width: 1.15em; height: 1.15em; padding: .05em; border: 1px solid white; }.window-app-icon { color: #f9a8d4; }
.gallery-menu, .gallery-status { display: flex; min-height: 6%; align-items: center; justify-content: space-between; border-bottom: 1px solid #6a3156; background: #f6d7e9; padding: 0 1.2%; font-size: clamp(6px, .9vw, 14px); font-weight: 700; }.gallery-status { min-height: 5%; border-top: 1px solid #6a3156; border-bottom: 0; }
.classic-window__art-area { position: relative; min-height: 0; overflow: hidden; background: #160016; display: grid; place-items: center; }.classic-window__art-area::before { position: absolute; inset: 0; z-index: 1; content: ""; pointer-events: none; background: linear-gradient(rgb(255 255 255 / .04) 50%, transparent 50%); background-size: 100% 4px; }
.classic-window__art-area img { width: 100%; height: 100%; object-fit: cover; transition: transform 100ms linear; }.art-placeholder { display: grid; z-index: 2; width: 100%; height: 100%; place-content: center; border: 2px dashed #f9a8d4; color: #f9a8d4; text-align: center; font-size: clamp(9px, 1.45vw, 24px); font-weight: 900; letter-spacing: .08em; }.art-placeholder p { margin: 0; }.art-placeholder p + p { color: white; font-size: .55em; }
.classic-window__headline { display: grid; min-height: 16%; place-items: center; padding: 1% 3%; background: #ffc1e6; color: #4b0932; text-align: center; font-size: clamp(13px, 2.35vw, 39px); font-weight: 950; line-height: 1.1; letter-spacing: .045em; text-transform: uppercase; }.tutorial-chip { position: absolute; top: 11%; left: 2%; z-index: 3; border: 2px solid #fff; background: #6c021f; padding: .55% 1%; color: white; font-size: clamp(7px, 1vw, 16px); font-weight: 900; letter-spacing: .06em; }
.error-window { inset: 23% 18% 28%; display: grid; grid-template-rows: auto 1fr auto; }.error-window__content { display: grid; grid-template-columns: 16% 1fr; align-items: center; gap: 3%; padding: 5%; }.error-window__icon { display: grid; width: 100%; aspect-ratio: 1; place-items: center; border-radius: 50%; background: #6c021f; color: white; }.error-window__icon :deep(svg) { width: 55%; height: 55%; }.error-window__message { margin: 0 0 3%; font-size: clamp(7px, 1.1vw, 18px); font-weight: 800; letter-spacing: .03em; }.error-window__headline { margin: 0; font-size: clamp(13px, 2.35vw, 38px); font-weight: 950; line-height: 1.05; }.error-window__actions { display: flex; justify-content: center; padding: 2.5%; }.error-window__actions p { border: 2px outset white; background: #e4d2df; padding: 1% 10%; font-size: clamp(8px, 1.1vw, 18px); font-weight: 900; }
.comparison-window { inset: 9% 7% 14%; display: grid; grid-template-rows: auto 1fr auto; }.comparison-window__body { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.3%; padding: 2.5%; background: #19002d; }.comparison-image { position: relative; display: grid; min-width: 0; overflow: hidden; place-items: center; border: 2px inset white; background: #4b0932; color: #f9a8d4; font-size: clamp(8px, 1.1vw, 18px); font-weight: 900; }.comparison-image img { width: 100%; height: 100%; object-fit: cover; }.comparison-image__label { position: absolute; bottom: 0; left: 0; padding: 2% 4%; background: #6b0455; color: white; font-size: clamp(9px, 1.3vw, 21px); letter-spacing: .06em; }.comparison-arrow { display: grid; place-items: center; color: #ff4fc4; }.comparison-arrow :deep(svg) { width: clamp(22px, 5vw, 75px); height: auto; stroke-width: 3; }.comparison-window__title { display: grid; min-height: 14%; place-items: center; margin: 0; padding: 1%; background: #ffc1e6; color: #4b0932; text-align: center; font-size: clamp(12px, 2vw, 32px); font-weight: 950; letter-spacing: .04em; }
.taskbar { position: absolute; right: 0; bottom: 0; left: 0; z-index: 5; display: flex; height: 8%; align-items: center; gap: 1%; border-top: 2px solid #f7d7ed; background: #b990ae; padding: 0 1%; color: #250018; font-size: clamp(7px, .95vw, 15px); font-weight: 900; }.start-button, .taskbar-app { display: inline-flex; align-items: center; gap: .25em; }.start-button { border: 2px outset #fff; padding: .45% 1.3%; background: #e7d0df; }.taskbar-app { border: 1px solid #6a3156; padding: .3% 1%; }.clock { margin-left: auto; border-left: 1px solid #6a3156; padding-left: 1%; }
</style>
