<template>
  <div class="flex flex-col gap-4">

    <div
      class="bg-black
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]"
    >
      <CardWindowHeader title="Explorer.exe" :icon="FolderOpen" />

      <div class="p-2 flex flex-col gap-1">
        <a
          v-for="link in links"
          :key="link"
          href="#"
          class="flex items-center gap-2 p-2 text-[11px] text-pink-400
                 hover:bg-pink-500/10 transition group"
        >
          <ChevronRight
            :size="10"
            class="group-hover:translate-x-1 transition"
          />
          <span class="font-bold uppercase tracking-tighter">
            {{ link }}.sys
          </span>
        </a>
      </div>
    </div>

    <div
      class="bg-[#13011a]
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]"
    >
      <CardWindowHeader title="Visual_Buffer.sys" />

      <div class="p-3 space-y-3">

        <img
          src="https://blob.gifcities.org/gifcities/KPLVCIAWFP622ITISPJUGSC3TBKYOWOW.gif"
          class="w-full h-auto pixelated opacity-80"
        />

        <div class="grid grid-cols-4 gap-2">
          <img
            v-for="gif in gifs"
            :key="gif"
            :src="gif"
            class="pixelated w-full opacity-70 hover:opacity-100 transition"
          />
        </div>

      </div>
    </div>

    <div
      class="bg-[#03010e]
             border-2 border-[#1a0215]
             border-r-[var(--ts-primary-pink)]
             border-b-[var(--ts-primary-pink)]
             p-4 space-y-4"
    >
      <h3 class="text-pink-600 text-[10px] font-black uppercase underline">
        /System_Resources:
      </h3>

      <div
        v-for="stat in stats"
        :key="stat.label"
        class="space-y-1"
      >
        <div class="flex justify-between text-[8px] font-bold text-pink-100/60 uppercase">
          <span>{{ stat.label }}</span>
          <span>{{ stat.val }}</span>
        </div>

        <div class="h-1.5 bg-black border border-pink-900/30 overflow-hidden">
          <div
            class="h-full transition-all duration-1000"
            :class="stat.color"
            :style="{ width: stat.val }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 🌐 FOOTER BADGE -->
    <div class="flex justify-center opacity-50 grayscale hover:grayscale-0 transition">
      <img
        src="https://cyber.dabamos.de/88x31/netscape4.gif"
        class="pixelated"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { FolderOpen, ChevronRight } from "lucide-vue-next";

const links = ["Home", "Projetos", "E-Sports", "Setup"];

const gifs = [
  "https://blob.gifcities.org/gifcities/PMFQYNMSGG2B7BZDN7VFMTD7NLD4M4ZK.gif",
  "https://cyber.dabamos.de/88x31/vim.gif",
  "https://cyber.dabamos.de/88x31/css.gif",
  "https://cyber.dabamos.de/88x31/html.gif",
  "https://cyber.dabamos.de/88x31/javascript.gif",
  "https://blob.gifcities.org/gifcities/X55TM3Q2IIIIM3XKSQHIDF3IEUJGIJPY.gif",
  "https://blob.gifcities.org/gifcities/WRYLFERW2IDWJXUIBQQEFX75C2UH7NS4.gif",
  "https://cyber.dabamos.de/88x31/netscape.gif"
];

const stats = [
  { label: "Energy", val: "80%", color: "bg-green-500" },
  { label: "Coffee", val: "100%", color: "bg-pink-500" },
  { label: "Focus", val: "45%", color: "bg-blue-500" }
];
</script>