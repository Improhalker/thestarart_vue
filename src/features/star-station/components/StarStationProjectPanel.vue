<script setup lang="ts">
import { CircuitBoard, RotateCcw } from "lucide-vue-next";

defineEmits<{ return: [] }>();
</script>

<template>
  <aside class="pointer-events-auto absolute inset-x-3 bottom-20 top-24 z-40 mx-auto flex max-w-2xl flex-col border-2 border-[var(--star-station-line)] bg-[color:var(--star-station-background)]/95 shadow-[8px_8px_0_var(--star-station-shadow)] backdrop-blur-md sm:bottom-24 sm:top-20" aria-labelledby="star-station-project-heading">
    <header class="flex items-start justify-between gap-4 border-b border-[var(--star-station-line)] bg-[var(--star-station-surface)] px-4 py-3">
      <div>
        <p class="font-pixel text-[10px] tracking-[0.14em] text-[var(--star-station-muted)]">STARSTATION // PROJECT.NODE</p>
        <h2 id="star-station-project-heading" class="mt-1 font-pixel text-lg text-[var(--star-station-text)]">
          <CircuitBoard class="mr-2 inline size-4 text-[var(--star-station-primary)]" aria-hidden="true" /> Project system file
        </h2>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 border border-[var(--star-station-primary)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] transition hover:bg-[var(--star-station-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
        @click="$emit('return')"
      >
        <RotateCcw class="size-3" aria-hidden="true" /> Return to orbit
      </button>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto p-4 text-sm leading-6 text-[var(--star-station-muted)] sm:p-5">
      <p class="font-pixel text-xs text-[var(--star-station-text)]">TheStarArt_ is a personal digital universe.</p>
      <p class="mt-2">It brings art, development, and interactive experiments into one evolving place.</p>

      <dl class="mt-5 grid grid-cols-1 gap-px border border-[var(--star-station-line)] bg-[var(--star-station-line)] sm:grid-cols-2">
        <div class="bg-[var(--star-station-background)] p-3">
          <dt class="font-pixel text-[10px] text-[var(--star-station-primary)]">FRONTEND</dt>
          <dd class="mt-1 text-[var(--star-station-text)]">Vue 3, Vite, TypeScript, Tailwind CSS 4</dd>
        </div>
        <div class="bg-[var(--star-station-background)] p-3">
          <dt class="font-pixel text-[10px] text-[var(--star-station-primary)]">BACKEND</dt>
          <dd class="mt-1 text-[var(--star-station-text)]">Laravel API with Sanctum authentication</dd>
        </div>
        <div class="bg-[var(--star-station-background)] p-3">
          <dt class="font-pixel text-[10px] text-[var(--star-station-primary)]">DATA + MEDIA</dt>
          <dd class="mt-1 text-[var(--star-station-text)]">PostgreSQL and Supabase Storage</dd>
        </div>
        <div class="bg-[var(--star-station-background)] p-3">
          <dt class="font-pixel text-[10px] text-[var(--star-station-primary)]">INFRASTRUCTURE</dt>
          <dd class="mt-1 text-[var(--star-station-text)]">Frontend on Vercel, API hosted on a VPS</dd>
        </div>
      </dl>

      <p class="mt-5 border-l-2 border-[var(--star-station-secondary)] pl-3 text-[var(--star-station-text)]">
        StarStation uses Three.js as an ambient visual archive, while Vue keeps the information layer readable and accessible.
      </p>
    </div>
  </aside>
</template>
