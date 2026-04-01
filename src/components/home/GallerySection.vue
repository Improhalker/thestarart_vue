<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from './GlassCard.vue'
import TsButton from '@/components/ui/TsButton.vue'

const artworks = [
  {
    image: '/art1.jpg',
    title: 'Olhar perdido',
    description: 'Um estudo de expressão focado em olhos e iluminação suave, explorando sentimentos de solidão.'
  },
  {
    image: '/art2.jpg',
    title: 'Noite silenciosa',
    description: 'Uma cena noturna com tons frios, trazendo uma sensação de calma e introspecção.'
  },
  {
    image: '/art3.jpg',
    title: 'Fragmentos',
    description: 'Desenho experimental tentando capturar emoções quebradas através de traços soltos.'
  },
  {
    image: '/art4.jpg',
    title: 'Reflexo',
    description: 'Estudo de luz e sombra com foco em contraste e composição.'
  },
  {
    image: '/art5.jpg',
    title: 'Vazio',
    description: 'Uma representação visual de silêncio e ausência, com composição minimalista.'
  }
]

const latestArtworks = computed(() => artworks.slice(0, 3))
</script>
<template>
  <section class="relative text-white w-full">

    <div class="container space-y-3">

      <div class="flex justify-between">
      <h2 class="text-2xl text-start ts-font-main">
        Últimos desenhos
      </h2>
              <TsButton variant="primary">Ver Galeria</TsButton>


      </div>

      <div class="grid md:grid-cols-3 gap-6">

        <GlassCard
          v-for="(art, index) in latestArtworks"
          :key="index"
          :image="art.image"
          :title="art.title"
          :description="art.description"
        />

      </div>

    </div>

  </section>
</template>