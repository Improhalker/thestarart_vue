<template>
  <div class="
    bg-ts-onyx-secondary
    retro-shadow
    border-2
    border-ts-ui-border
    border-r-ts-ui-border-dark
    border-b-ts-ui-border-dark
  ">
    <CardWindowHeader title="Devlog_Entries.log" />

    <div class="p-4 space-y-4">

      <!-- POST -->
      <div v-for="post in posts" :key="post.id" class="group cursor-pointer
           border-2
           border-[var(--color-ts-ui-border)]
           border-r-[var(--color-ts-ui-border-dark)]
           border-b-[var(--color-ts-ui-border-dark)]
           bg-gradient-to-br
           from-[var(--color-ts-ui-bg)]
           via-[var(--color-ts-ui-bg-secondary)]
           to-[var(--color-ts-ui-bg-tertiary)]
           p-3
           transition-all
           duration-300
           hover:translate-y-[-2px]
           hover:shadow-lg">
        <!-- TOP -->
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] uppercase font-bold
               text-[var(--color-ts-ui-text-soft)]">
            {{ post.date }}
          </span>

          <span class="text-[9px] uppercase px-2 py-[2px]
               border
               border-[var(--color-ts-ui-border-dark)]
               text-[var(--color-ts-ui-text)]">
            {{ post.tag }}
          </span>
        </div>

        <!-- TITLE -->
        <h3 class="text-[13px] font-black uppercase tracking-wide
             text-[var(--color-ts-ui-text)]
             transition-colors
             group-hover:text-[var(--color-ts-ui-accent)]">
          {{ post.title }}
        </h3>

        <!-- DESCRIPTION -->
        <p class="mt-1 text-[11px] leading-snug
             text-[var(--color-ts-ui-text-soft)]">
          {{ post.description }}
        </p>

        <!-- FOOTER -->
        <div class="flex justify-between items-center mt-3
             text-[9px] uppercase">
          <span class="font-bold
               text-[var(--color-ts-ui-accent)]">
            >> read_more
          </span>

          <span class="font-bold
               text-[var(--color-ts-ui-text-soft)]">
            ● published
          </span>
        </div>
      </div>

      <!-- LOAD MORE -->
      <div class="pt-2 text-center">
        <button class="px-4 py-2 text-[10px] uppercase font-bold
             bg-[var(--color-ts-ui-accent)]
             text-white
             border
             border-[var(--color-ts-ui-border-dark)]
             border-r-[var(--ts-retro-shadow)]
             border-b-[var(--ts-retro-shadow)]
             active:translate-x-[1px]
             active:translate-y-[1px]
             active:border-[var(--ts-retro-shadow)]">
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
    title: "Minha AWP Deus Minhoca, minha arma mais amada",
    description: "Simplesmente a awp que me acompanha em todas as partidas.",
    date: "2026-04-03",
    tag: "CS2"
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