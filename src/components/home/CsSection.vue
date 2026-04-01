<script setup lang="ts">
import { computed } from 'vue'
import CsCard from './CsCard.vue'
import TsButton from '@/components/ui/TsButton.vue'

const videos = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Clutch insano de AWP',
    description: 'Quase não acreditei nesse clutch, uma das melhores plays que já fiz.'
  },
  {
    videoId: 'ysz5S6PUM-U',
    title: 'Highlights da peneira',
    description: 'Momentos mais importantes da minha peneira para a At0n.'
  },
  {
    videoId: 'ScMzIvxBSi4',
    title: 'Overpass difícil',
    description: 'Uma partida intensa onde nada parecia dar certo… até dar.'
  },
  {
    videoId: 'aqz-KE-bpKQ',
    title: 'Treino diário',
    description: 'Rotina de treino focada em evolução constante.'
  }
]

// controle igual à gallery
const latestVideos = computed(() => videos.slice(0, 3))
</script>

<template>
  <section class="relative text-white w-full">

    <div class="container space-y-3">
      <div class="flex justify-between">

      <!-- título -->
      <h2 class="text-2xl text-start ts-font-main">
        Minha jornada no CS
      </h2>

              <TsButton variant="ghost">Assistir Highlights</TsButton>

      </div>

      <!-- grid -->
      <div class="grid md:grid-cols-3 gap-6">

        <CsCard
          v-for="(video, index) in latestVideos"
          :key="index"
          :videoId="video.videoId"
          :title="video.title"
          :description="video.description"
        />

      </div>

    </div>

  </section>
</template>