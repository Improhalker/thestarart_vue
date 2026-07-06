<script setup lang="ts">
import { ref } from "vue";
import CardWindowHeader from "../global/CardWindowHeader.vue";

const selectedImage = ref<string | null>(null);

const images = [
  "/images/desenhos/processos/elaina.jpeg",
  "/images/desenhos/processos/girl.jpeg",
];
</script>

<template>
  <div class="container-style-dark">
    <CardWindowHeader title="CurrentlyDrawing.exe" />

    <div class="p-6">
      <p class="text-gray-400 text-sm mb-4">
        Ilustrações atuais em progresso. Clique para ampliar.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        <img
          v-for="image in images"
          :key="image"
          :src="image"
          class="rounded-lg border border-zinc-700 cursor-pointer transition hover:scale-[1.02]"
          @click="selectedImage = image"
        />
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="selectedImage"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-8"
        @click="selectedImage = null"
      >
        <img
          :src="selectedImage"
          class="max-w-11/12 lg:max-w-5xl max-h-[90vh] rounded-xl shadow-2xl"
          @click.stop
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
