<script setup lang="ts">
import { ImageIcon, RotateCcw } from "lucide-vue-next";
import type { StarStationArtwork } from "../types/artwork";

defineProps<{ artwork: StarStationArtwork }>();

defineEmits<{ return: [] }>();
</script>

<template>
  <aside
    class="pointer-events-auto absolute inset-x-3 bottom-20 top-24 z-40 mx-auto flex max-w-4xl flex-col overflow-hidden border-2 border-[var(--star-station-line)] bg-[color:var(--star-station-background)]/95 shadow-[8px_8px_0_var(--star-station-shadow)] backdrop-blur-md sm:bottom-24 sm:top-20"
    aria-labelledby="star-station-artwork-heading"
  >
    <header class="flex items-start justify-between gap-4 border-b border-[var(--star-station-line)] bg-[var(--star-station-surface)] px-4 py-3">
      <div>
        <p class="font-pixel text-[10px] tracking-[0.14em] text-[var(--star-station-muted)]">GALLERY.ARCHIVE // SELECTED SIGNAL</p>
        <h2 id="star-station-artwork-heading" class="mt-1 font-pixel text-lg text-[var(--star-station-text)]">{{ artwork.title }}</h2>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 border border-[var(--star-station-primary)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] transition hover:bg-[var(--star-station-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
        @click="$emit('return')"
      >
        <RotateCcw class="size-3" aria-hidden="true" /> Return to gallery
      </button>
    </header>

    <div class="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:p-5">
      <figure class="flex min-h-56 min-w-0 items-center justify-center overflow-hidden border border-[var(--star-station-line)] bg-black/30 p-2">
        <img
          :src="artwork.src"
          :alt="artwork.alt"
          class="max-h-[52vh] max-w-full w-full object-contain [image-rendering:auto]"
        />
      </figure>
      <div class="self-start border-l-2 border-[var(--star-station-primary)] pl-4 text-sm leading-6 text-[var(--star-station-muted)]">
        <p class="font-pixel text-[10px] tracking-[0.12em] text-[var(--star-station-primary)]">ARCHIVE ITEM</p>
        <p class="mt-2 text-[var(--star-station-text)]">{{ artwork.alt }}</p>
        <p class="mt-5 font-pixel text-[10px] tracking-[0.12em] text-[var(--star-station-primary)]">SOURCE</p>
        <p class="mt-1 break-all text-xs">{{ artwork.src }}</p>
        <p class="mt-5 flex items-center gap-2 text-xs text-[var(--star-station-text)]">
          <ImageIcon class="size-4 text-[var(--star-station-secondary)]" aria-hidden="true" />
          Original archive artwork
        </p>
      </div>
    </div>
  </aside>
</template>
