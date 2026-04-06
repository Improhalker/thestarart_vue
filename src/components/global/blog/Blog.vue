<template>
  <div
    class="bg-[#03010e]
           border-2 border-[var(--ts-primary-pink)]
           border-r-[#2a0221] border-b-[#2a0221]"
  >
    <!-- HEADER PADRÃO -->
    <CardWindowHeader title="Devlog_Entries.log" />

    <div class="p-4 space-y-4">

      <!-- POST -->
      <div
        v-for="post in posts"
        :key="post.id"
        class="group cursor-pointer
               border-2 border-[#1a0215]
               border-r-[var(--ts-primary-pink)]
               border-b-[var(--ts-primary-pink)]
               bg-[#13011a]
               p-3 transition hover:bg-[#1b0224]"
      >
        <!-- TOP -->
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] text-pink-500 uppercase font-bold">
            {{ post.date }}
          </span>

          <span
            class="text-[9px] uppercase px-2 py-[2px]
                   border border-pink-500/40 text-pink-400"
          >
            {{ post.tag }}
          </span>
        </div>

        <!-- TITLE -->
        <h3
          class="text-[13px] font-black uppercase text-pink-300
                 tracking-wide group-hover:text-pink-400 transition"
        >
          {{ post.title }}
        </h3>

        <!-- DESCRIPTION -->
        <p class="text-[11px] text-pink-100 mt-1 leading-snug opacity-80">
          {{ post.description }}
        </p>

        <!-- FOOTER -->
        <div class="flex justify-between items-center mt-3 text-[9px] uppercase">
          <span class="text-pink-500/70">
            >> read_more
          </span>

          <span class="text-green-500 font-bold">
            ● published
          </span>
        </div>
      </div>

      <!-- LOAD MORE -->
      <div class="pt-2 text-center">
        <button
          class="px-4 py-2 text-[10px] uppercase font-bold
                 bg-[var(--ts-primary-pink)] text-white
                 border border-white
                 border-r-black border-b-black
                 active:translate-x-[1px] active:translate-y-[1px]
                 active:border-black active:border-r-white active:border-b-white"
        >
          load_more.exe
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import CardWindowHeader from '../CardWindowHeader.vue';
const posts = [
  {
    id: 1,
    title: "Passei na peneira de CS2… e foi insano",
    description: "2 dias intensos jogando com times aleatórios e sendo avaliado...",
    date: "2026-04-05",
    tag: "CS2"
  },
  {
    id: 2,
    title: "Criando um player retrô com Vue + YouTube API",
    description: "Como manter estado entre mobile e desktop sem reiniciar música.",
    date: "2026-04-03",
    tag: "DEV"
  },
  {
    id: 3,
    title: "Minha evolução desenhando anime (2018 → 2026)",
    description: "Do lápis comum até um estilo mais consistente e autoral.",
    date: "2026-03-28",
    tag: "ART"
  }
]
</script>