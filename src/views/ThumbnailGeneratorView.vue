<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from "vue";
import { toPng } from "html-to-image";
import { ArrowLeft, ImageDown, Sparkles } from "lucide-vue-next";
import ThumbnailCanvas from "@/components/thumbnail/ThumbnailCanvas.vue";
import ThumbnailControls from "@/components/thumbnail/ThumbnailControls.vue";
import type { ThumbnailState } from "@/components/thumbnail/types";

const thumbnailNode = ref<HTMLElement | null>(null);
const exporting = ref(false);
const pixelifyCssUrl = "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap";
let pixelifyFontEmbedCss: Promise<string> | null = null;

const state = reactive<ThumbnailState>({
  title: "",
  template: "drawing",
  image: null,
  beforeImage: null,
  afterImage: null,
  imageScale: 1,
  imageX: 0,
  imageY: 0,
});

const objectUrls = new Map<"image" | "beforeImage" | "afterImage", string>();

const setLocalImage = (target: "image" | "beforeImage" | "afterImage", file: File | null) => {
  const previousUrl = objectUrls.get(target);
  if (previousUrl) URL.revokeObjectURL(previousUrl);

  if (!file) {
    objectUrls.delete(target);
    state[target] = null;
    return;
  }

  const url = URL.createObjectURL(file);
  objectUrls.set(target, url);
  state[target] = url;
};

const resetPosition = () => {
  state.imageScale = 1;
  state.imageX = 0;
  state.imageY = 0;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
};

const getPixelifyFontEmbedCss = () => {
  if (pixelifyFontEmbedCss) return pixelifyFontEmbedCss;

  pixelifyFontEmbedCss = (async () => {
    const cssResponse = await fetch(pixelifyCssUrl);
    if (!cssResponse.ok) throw new Error("Não foi possível carregar Pixelify Sans para exportação.");

    let css = await cssResponse.text();
    const fontUrls = [...css.matchAll(/url\(([^)]+)\)/g)]
      .map((match) => match[1]?.replace(/["']/g, ""))
      .filter((fontUrl): fontUrl is string => Boolean(fontUrl));

    await Promise.all(fontUrls.map(async (fontUrl) => {
      const fontResponse = await fetch(fontUrl);
      if (!fontResponse.ok) throw new Error("Não foi possível incorporar Pixelify Sans.");

      const mimeType = fontResponse.headers.get("content-type") || "font/woff2";
      const dataUrl = `data:${mimeType};base64,${arrayBufferToBase64(await fontResponse.arrayBuffer())}`;
      css = css.replace(fontUrl, dataUrl);
    }));

    return css;
  })().catch((error) => {
    pixelifyFontEmbedCss = null;
    throw error;
  });

  return pixelifyFontEmbedCss;
};

const exportThumbnail = async () => {
  if (!thumbnailNode.value || exporting.value) return;

  exporting.value = true;
  let exportNode: HTMLElement | null = null;

  try {
    const fontEmbedCSS = await getPixelifyFontEmbedCss();
    // html-to-image amplia o canvas, mas não recalcula o layout dos filhos do
    // preview. A cópia abaixo é renderizada de fato em 1280×720 antes da
    // captura, evitando a área vazia ao redor da thumbnail.
    exportNode = thumbnailNode.value.cloneNode(true) as HTMLElement;
    exportNode.style.cssText = [
      "position: fixed",
      "top: 0",
      "left: -10000px",
      "width: 1280px",
      "height: 720px",
      "overflow: hidden",
      "pointer-events: none",
    ].join(";");
    document.body.appendChild(exportNode);

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const dataUrl = await toPng(exportNode, {
      width: 1280,
      height: 720,
      canvasWidth: 1280,
      canvasHeight: 720,
      pixelRatio: 1,
      // Incorpora exclusivamente a Pixelify Sans. Isso evita que a biblioteca
      // tente ler estilos externos do Google Translate durante a captura.
      fontEmbedCSS,
      // URLs blob de uploads locais não aceitam query strings; cacheBust as
      // corromperia antes da leitura pelo html-to-image.
      cacheBust: false,
    });

    const link = document.createElement("a");
    link.download = "thestarart-thumbnail.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    // A imagem continua somente no navegador; um erro de exportação não deve apagar o trabalho.
    console.error("Não foi possível exportar a thumbnail.", error);
  } finally {
    exportNode?.remove();
    exporting.value = false;
  }
};

onBeforeUnmount(() => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
  <main class="thumbnail-generator-page">
    <header class="thumbnail-generator-header">
      <RouterLink to="/" class="thumbnail-back-link"><ArrowLeft :size="15" aria-hidden="true" /> BACK TO DESKTOP</RouterLink>
      <div class="thumbnail-generator-heading">
        <p><Sparkles :size="13" aria-hidden="true" /> LOCAL CREATIVE TOOL</p>
        <h1>Thumbnail_Generator.exe</h1>
      </div>
      <p class="thumbnail-resolution"><ImageDown :size="15" aria-hidden="true" /> OUTPUT: 1280 × 720 PNG</p>
    </header>

    <section class="thumbnail-generator-workspace">
      <aside class="thumbnail-generator-controls">
        <ThumbnailControls
          :state="state"
          :exporting="exporting"
          @update:title="state.title = $event"
          @update:template="state.template = $event"
          @update:image="setLocalImage('image', $event)"
          @update:before-image="setLocalImage('beforeImage', $event)"
          @update:after-image="setLocalImage('afterImage', $event)"
          @update:scale="state.imageScale = $event"
          @update:x="state.imageX = $event"
          @update:y="state.imageY = $event"
          @reset="resetPosition"
          @export="exportThumbnail"
        />
      </aside>

      <section class="thumbnail-generator-preview" aria-label="Preview da thumbnail">
        <div class="thumbnail-generator-preview__label">PREVIEW_WINDOW // 16:9</div>
        <div ref="thumbnailNode" class="thumbnail-generator-export-target">
          <ThumbnailCanvas :state="state" />
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.thumbnail-generator-page { min-height: 100vh; padding: clamp(1rem, 3vw, 2.5rem); background-color: #080219; background-image: linear-gradient(rgb(255 255 255 / .035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .035) 1px, transparent 1px), radial-gradient(circle at 75% 10%, rgb(107 4 85 / .6), transparent 31%); background-size: 20px 20px, 20px 20px, auto; color: white; }
.thumbnail-generator-header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; max-width: 1500px; margin: 0 auto 1.5rem; border: 2px solid var(--ui-border); border-right-color: var(--ui-border-dark); border-bottom-color: var(--ui-border-dark); background: rgb(1 3 37 / .9); padding: .7rem 1rem; box-shadow: 5px 5px 0 rgb(0 0 0 / .55); }
.thumbnail-back-link, .thumbnail-resolution { display: inline-flex; align-items: center; gap: .4rem; color: var(--ui-accent-soft); font-size: .65rem; font-weight: 800; letter-spacing: .05em; }.thumbnail-back-link:hover { color: white; }.thumbnail-resolution { justify-self: end; color: #fff; }
.thumbnail-generator-heading { text-align: center; }.thumbnail-generator-heading p { display: flex; align-items: center; justify-content: center; gap: .3rem; margin: 0 0 .25rem; color: var(--ui-accent-soft); font-size: .58rem; font-weight: 800; letter-spacing: .1em; }.thumbnail-generator-heading h1 { margin: 0; color: white; font-size: clamp(1rem, 2.3vw, 1.6rem); font-weight: 900; letter-spacing: .06em; }
.thumbnail-generator-workspace { display: grid; grid-template-columns: minmax(270px, 360px) minmax(0, 1fr); align-items: start; gap: clamp(1rem, 2.5vw, 2.5rem); max-width: 1500px; margin: 0 auto; }.thumbnail-generator-preview { min-width: 0; }.thumbnail-generator-preview__label { display: inline-block; border: 2px solid var(--ui-border); border-bottom: 0; background: var(--ts-primary-pink); padding: .4rem .6rem; color: white; font-size: .6rem; font-weight: 900; letter-spacing: .08em; }.thumbnail-generator-export-target { width: 100%; }
@media (max-width: 860px) { .thumbnail-generator-header { grid-template-columns: 1fr auto; }.thumbnail-generator-heading { grid-column: 1 / -1; grid-row: 1; }.thumbnail-back-link { grid-row: 2; }.thumbnail-resolution { grid-column: 2; grid-row: 2; }.thumbnail-generator-workspace { grid-template-columns: 1fr; }.thumbnail-generator-preview { order: -1; }.thumbnail-generator-controls { max-width: 520px; margin: 0 auto; width: 100%; } }
@media (max-width: 470px) { .thumbnail-generator-page { padding: .7rem; }.thumbnail-generator-header { gap: .6rem; padding: .65rem; }.thumbnail-back-link, .thumbnail-resolution { font-size: .52rem; }.thumbnail-resolution { text-align: right; } }
</style>
