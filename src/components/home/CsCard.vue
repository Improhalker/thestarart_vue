<script setup lang="ts">
defineProps<{
  videoId: string
  title: string
  description: string
}>()
</script>

<template>
  <div
    class="group relative rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/40"
  >
    <!-- vídeo -->
    <div class="aspect-video">
      <iframe
        class="w-full h-full"
        :src="`https://www.youtube.com/embed/${videoId}`"
        title="YouTube video"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- conteúdo -->
    <div class="p-4 space-y-3">
      <h3 class="ts-font-main text-lg">
        {{ title }}
      </h3>

      <p class="text-white/70 text-sm line-clamp-3">
        {{ description }}
      </p>

      <button class="text-sm text-[var(--light-blue)] hover:underline">
        Assistir no YouTube →
      </button>
    </div>
  </div>
</template>