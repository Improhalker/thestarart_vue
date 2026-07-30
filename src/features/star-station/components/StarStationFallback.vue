<script setup lang="ts">
import { AlertTriangle, RotateCcw } from "lucide-vue-next";
import type { StarStationArtwork } from "../types/artwork";

defineProps<{ artworks: readonly StarStationArtwork[] }>();

defineEmits<{ retry: [] }>();
</script>

<template>
  <section class="absolute inset-0 z-20 overflow-y-auto bg-[var(--star-station-background)] p-5 text-[var(--star-station-text)]" role="alert">
    <div class="mx-auto flex min-h-full max-w-4xl flex-col justify-center py-10">
      <div class="border-2 border-[var(--star-station-primary)] bg-[var(--star-station-surface)] p-5 shadow-[6px_6px_0_var(--star-station-shadow)] sm:p-7">
        <div class="flex items-start gap-3">
          <AlertTriangle class="mt-0.5 size-5 shrink-0 text-[var(--star-station-primary)]" aria-hidden="true" />
          <div>
            <p class="font-pixel text-xs tracking-[0.12em] text-[var(--star-station-muted)]">STARSTATION // SAFE MODE</p>
            <h2 class="mt-2 font-pixel text-xl">Visual link unavailable</h2>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--star-station-muted)]">
              Your browser could not start the 3D archive. The drawings remain available below in a lighter format.
            </p>
          </div>
        </div>
        <button
          type="button"
          class="mt-5 inline-flex items-center gap-2 border-2 border-[var(--star-station-line)] px-4 py-2 font-pixel text-xs text-[var(--star-station-text)] transition hover:border-[var(--star-station-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--star-station-text)]"
          @click="$emit('retry')"
        >
          <RotateCcw class="size-4" aria-hidden="true" /> Retry visual link
        </button>
      </div>

      <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="StarStation visual archive">
        <li v-for="artwork in artworks" :key="artwork.id" class="border border-[var(--star-station-line)] bg-[var(--star-station-surface)] p-2">
          <img :src="artwork.src" :alt="artwork.alt" class="aspect-[4/3] w-full object-contain" loading="lazy" />
          <p class="px-1 pb-1 pt-2 font-pixel text-xs text-[var(--star-station-muted)]">{{ artwork.title }}</p>
        </li>
      </ul>

      <section class="mt-6 border-2 border-[var(--star-station-line)] bg-[var(--star-station-surface)] p-5" aria-labelledby="star-station-fallback-about">
        <p class="font-pixel text-[10px] tracking-[0.12em] text-[var(--star-station-muted)]">ABOUT.NODE // ACCESSIBLE COPY</p>
        <h3 id="star-station-fallback-about" class="mt-2 font-pixel text-lg">TheStarArt_ system file</h3>
        <p class="mt-3 text-sm leading-6 text-[var(--star-station-muted)]">
          TheStarArt_ joins art, development, and interactive experiments. Its frontend uses Vue 3, Vite, TypeScript, and Tailwind CSS 4; Laravel and Sanctum support the API and authentication; PostgreSQL and Supabase Storage handle data and media. The frontend runs on Vercel and the API is hosted on a VPS.
        </p>
        <p class="mt-3 text-sm leading-6 text-[var(--star-station-muted)]">
          It is also the meeting point for a full stack developer and artist working with Vue, Nuxt, TypeScript, Laravel, Node.js, WordPress, UI, UX, automation, security-minded integrations, drawing, music, and visual experimentation.
        </p>
      </section>
    </div>
  </section>
</template>
