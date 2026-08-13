<script setup lang="ts">
import { ExternalLink, Heart, Image, Sparkles } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";

const credits = [
  {
    name: "FlamingText",
    description: "Criação da logo TheStarArt_ no estilo Design Popstar.",
    url: "https://www.flamingtext.com/logo/Design-Popstar?text=TheStarArt_",
    icon: Sparkles,
  },
  {
    name: "GifCities",
    description: "Acervo de GIFs retrô usados para dar vida ao universo do site.",
    url: "https://gifcities.org/",
    icon: Image,
  },
  {
    name: "Neocities",
    description: "Referência de internet pessoal, criatividade e exploração visual.",
    url: "https://neocities.org/",
    icon: Heart,
  },
];
</script>

<template>
  <section class="container-style-dark overflow-hidden border-2 shadow-[6px_6px_0_rgb(0_0_0_/_70%)]">
    <CardWindowHeader title="CREDITS.TXT" />

    <div class="space-y-6 p-4 sm:p-6">
      <header class="border-b border-[var(--ui-border)] pb-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--ts-primary-pink)]">arquivo de créditos</p>
        <h1 class="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">Fontes e inspirações</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
          Este universo é construído com muitas referências, ferramentas e acervos da internet. Aqui ficam os créditos das fontes utilizadas no projeto.
        </p>
      </header>

      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="credit in credits" :key="credit.name" class="min-w-0">
          <a
            :href="credit.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex h-full flex-col border-2 border-[var(--ui-border)] bg-black/30 p-4 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ts-primary-pink)]"
          >
            <div class="flex items-start justify-between gap-3">
              <component :is="credit.icon" :size="20" class="shrink-0 text-[var(--ts-primary-pink)]" aria-hidden="true" />
              <ExternalLink :size="15" class="shrink-0 text-gray-400 transition-colors group-hover:text-white" aria-hidden="true" />
            </div>
            <h2 class="mt-5 text-sm font-black uppercase text-white">{{ credit.name }}</h2>
            <p class="mt-2 text-xs leading-5 text-gray-300">{{ credit.description }}</p>
            <span class="mt-4 text-[10px] font-bold uppercase text-[var(--ts-primary-pink)]">Abrir fonte ↗</span>
          </a>
        </li>
      </ul>

      <p class="border-l-2 border-[var(--ts-primary-pink)] bg-black/20 p-3 text-xs italic text-gray-300">
        Mais créditos serão adicionados conforme novos assets e referências entrarem no site.
      </p>
    </div>
  </section>
</template>
