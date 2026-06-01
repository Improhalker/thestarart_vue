<script setup lang="ts">
import UiSelector from "./translate/UiSelector.vue";
import changelog from '@/data/changelog.json'

import { Menu, Wifi, Cpu, Gamepad2 } from "lucide-vue-next";

const links = [
  { name: "HOME", path: "/" },
  { name: "ARTWORK", path: "/artwork" },
  { name: "PROJECTS", path: "/projects" },
  { name: "ESPORTS", path: "/esports" },
  { name: "CHANGELOG", path: "/changelog" },
];


const currentVersion = changelog[0]?.version ?? '0.0.0'
</script>

<template>
  <header class="bg-black relative overflow-hidden border-b-[3px] border-[var(--ui-border-dark)]">

    <div class="absolute inset-0 opacity-70 banner-scroll">
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70">
    </div>

    <div class="relative z-10">

      <!-- Top Bar -->
      <div class="h-8 px-4 flex items-center justify-between
        bg-black/70 border-b border-white/10">

        <div class="flex items-center gap-2 text-[11px]
          uppercase tracking-wider">

          <Cpu :size="12" />

          <span class="font-bold">
            THESTARART.EXE
          </span>

          <span class="text-white/40">
            v{{ currentVersion }}
          </span>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <Wifi :size="12" />
          <UiSelector />
        </div>

      </div>

      <!-- Main Navbar -->
      <div class="h-20 px-6 flex items-center justify-between">

        <div>

          <h1 class="font-black text-3xl tracking-tight
            text-white">

            TheStarArt_

          </h1>

          <span class="text-xs text-white/60 uppercase">

            Anime Artist • Developer • Gamer

          </span>

        </div>

        <nav class="hidden lg:flex gap-2">

          <RouterLink v-for="link in links" :key="link.path" :to="link.path" class="
              px-4 py-2
              text-xs
              font-bold
              tracking-widest
              border
              border-white/10
              bg-black/40
              backdrop-blur-sm
              hover:bg-red-600
              hover:border-red-400
              transition">

            {{ link.name }}

          </RouterLink>

        </nav>

        <button class="lg:hidden
          p-2 border border-white/10
          bg-black/40">

          <Menu :size="18" />

        </button>

      </div>

      <!-- Status Bar -->
      <div class="hidden md:flex
        items-center gap-4
        px-6 py-2
        text-[10px]
        uppercase
        border-t border-white/10
        bg-black/50">

        <div>STATUS: ONLINE</div>

        <div>DRAWING.EXE</div>

        <div>CS2.EXE</div>

        <div>VUE.APP</div>

        <div class="ml-auto flex gap-2 items-center">
          <Gamepad2 :size="12" />
          IMPROHALKER
        </div>

      </div>

    </div>

  </header>
</template>

