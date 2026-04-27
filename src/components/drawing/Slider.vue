<template>
  <div
    class="bg-[#0a0110]
           border-2 border-[var(--ts-primary-pink)]
           border-r-[#2a0221] border-b-[#2a0221]"
  >
    <CardWindowHeader title="Art_Viewer.dll" />

    <div class="p-2">
      <div class="relative w-full overflow-hidden">
        
        <!-- Slides -->
        <div
          class="flex transition-transform duration-500"
          :style="{ transform: `translateX(-${current * 100}%)` }"
        >
          <div
            v-for="(img, i) in images"
            :key="i"
            class="w-full flex-shrink-0 flex items-center justify-center"
          >
            <img
              :src="img"
              class="w-full h-auto pixelated cursor-pointer hover:opacity-90 transition"
              @click="openFullscreen(img)"
            />
          </div>
        </div>

        <!-- Controls -->
        <button
          @click="prev"
          class="absolute left-1 top-1/2 -translate-y-1/2 text-pink-500 text-xs bg-black/60 px-2 py-1"
        >
          ◀
        </button>

        <button
          @click="next"
          class="absolute right-1 top-1/2 -translate-y-1/2 text-pink-500 text-xs bg-black/60 px-2 py-1"
        >
          ▶
        </button>
      </div>

      <!-- Indicators -->
      <div class="flex justify-center gap-1 mt-2">
        <div
          v-for="(_, i) in images"
          :key="i"
          class="h-1 w-3 cursor-pointer"
          :class="i === current ? 'bg-pink-500' : 'bg-pink-900/40'"
          @click="current = i"
        />
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <div
      v-if="fullscreen"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      @click="fullscreen = null"
    >
      <img
        :src="fullscreen"
        class="max-w-full max-h-full pixelated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CardWindowHeader from "@/components/global/CardWindowHeader.vue"

const images = [
  "/images/desenhos/madoka.webp",
  "/images/desenhos/makima.webp",
  "/images/desenhos/katarinaaaa.png",
]

const current = ref(0)
const fullscreen = ref<string | null>(null)

const next = () => {
  current.value = (current.value + 1) % images.length
}

const prev = () => {
  current.value =
    (current.value - 1 + images.length) % images.length
}

const openFullscreen = (img: string) => {
  fullscreen.value = img
}
</script>