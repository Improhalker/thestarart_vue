<script setup lang="ts">
defineProps<{
  image: string
  title: string
  description: string
}>()
</script>

<template>
  <div
    class="group relative rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/40"
  >
    <!-- imagem -->
    <div class="h-40 overflow-hidden">
      <img
        :src="image"
        class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />
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
        Saber mais →
      </button>
    </div>
  </div>
</template>