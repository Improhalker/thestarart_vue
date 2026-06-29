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

    <div
      v-if="fullscreen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      @click="fullscreen = null"
    >
      <img :src="fullscreen" class="max-w-full max-h-full pixelated" />
    </div>
  </div>
</template>
