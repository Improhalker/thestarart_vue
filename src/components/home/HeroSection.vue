<script setup lang="ts">
import GallerySection from './GallerySection.vue'
import CsSection from './CsSection.vue';
</script>

<template>
  <section class="bg-red-500 relative flex items-center justify-center text-white">

    <div class="absolute inset-0 bg-black/40"></div>

    <div class="absolute top-0 text-center space-y-6">
      <p class="text-white/70 max-w-xl mx-auto">
        Anime, Desenhos, CS e pensamentos perdidos de alguém tentando evoluir.
      </p>

      <div class="flex gap-4 justify-center">
      </div>
      <GallerySection />
      <CsSection />
    </div>

  </section>
</template>