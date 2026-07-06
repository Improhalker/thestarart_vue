<script setup lang="ts">
import { ref } from "vue";
import Autoplay from "embla-carousel-autoplay";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fullscreen = ref<string | null>(null);

const autoplay = Autoplay({
  delay: 2000,
  stopOnInteraction: false,
});

const images = [
  "/images/desenhos/eye_blue.webp",
  "/images/desenhos/jujutsu.webp",
  "/images/desenhos/kyoukai.jpg",
  "/images/desenhos/madoka.webp",
  "/images/desenhos/makima.webp",
  "/images/desenhos/katarinaaaa.png",
];

const openFullscreen = (img: string) => {
  fullscreen.value = img;
};
</script>

<template>
  <div class="container-style-dark">
    <CardWindowHeader title="Gallery" />
    <div class="p-2">
      <Carousel
        :plugins="[autoplay]"
        :opts="{
          loop: true,
        }"
        class="w-full"
      >
        <CarouselContent>
          <CarouselItem v-for="(img, index) in images" :key="index">
            <img
              :src="img"
              class="w-full h-full max-h-[325px] object-cover cursor-pointer pixelated hover:opacity-90 transition"
              @click="openFullscreen(img)"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="fullscreen"
          class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          @click="fullscreen = null"
        >
          <img
            :src="fullscreen"
            class="max-w-5xl w-full max-h-[85vh] object-contain shadow-2xl"
            @click.stop
          />

          <button
            class="absolute top-6 right-6 text-3xl text-white"
            @click="fullscreen = null"
          >
            ✕
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
