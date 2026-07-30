<script setup lang="ts">
import { RotateCcw, UserRound } from "lucide-vue-next";

defineEmits<{ return: [] }>();
</script>

<template>
  <aside class="pointer-events-auto absolute inset-x-3 bottom-20 top-24 z-40 mx-auto flex max-w-2xl flex-col border-2 border-[var(--star-station-line)] bg-[color:var(--star-station-background)]/95 shadow-[8px_8px_0_var(--star-station-shadow)] backdrop-blur-md sm:bottom-24 sm:top-20" aria-labelledby="star-station-me-heading">
    <header class="flex items-start justify-between gap-4 border-b border-[var(--star-station-line)] bg-[var(--star-station-surface)] px-4 py-3">
      <div>
        <p class="font-pixel text-[10px] tracking-[0.14em] text-[var(--star-station-muted)]">STARSTATION // CREATOR.NODE</p>
        <h2 id="star-station-me-heading" class="mt-1 font-pixel text-lg text-[var(--star-station-text)]">
          <UserRound class="mr-2 inline size-4 text-[var(--star-station-secondary)]" aria-hidden="true" /> Creator signal file
        </h2>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 border border-[var(--star-station-secondary)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] transition hover:bg-[var(--star-station-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
        @click="$emit('return')"
      >
        <RotateCcw class="size-3" aria-hidden="true" /> Return to orbit
      </button>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto p-4 text-sm leading-6 text-[var(--star-station-muted)] sm:p-5">
      <p class="font-pixel text-xs text-[var(--star-station-text)]">Developer, artist, and builder of connected experiences.</p>
      <p class="mt-2">I work across full stack development and visual practice, treating interfaces as places where systems and expression can meet.</p>

      <ul class="mt-5 space-y-2 border-l-2 border-[var(--star-station-primary)] pl-4">
        <li><span class="font-pixel text-[10px] text-[var(--star-station-primary)]">STACK //</span> Vue, Nuxt, TypeScript, Laravel, Node.js, and WordPress.</li>
        <li><span class="font-pixel text-[10px] text-[var(--star-station-primary)]">CRAFT //</span> UI, UX, digital art, creative interfaces, and automation between systems.</li>
        <li><span class="font-pixel text-[10px] text-[var(--star-station-primary)]">RESEARCH //</span> security-minded development and practical integrations.</li>
      </ul>

      <p class="mt-5 border-l-2 border-[var(--star-station-secondary)] pl-3 text-[var(--star-station-text)]">
        TheStarArt_ is where programming, drawing, music, and visual experimentation become part of the same ongoing archive.
      </p>
    </div>
  </aside>
</template>
