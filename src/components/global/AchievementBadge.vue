<script setup lang="ts">
import { useAchievements } from '@/composables/useAchievements'
import { Award } from 'lucide-vue-next'

const { currentAchievement, isShowing } = useAchievements()
</script>

<template>
  <Transition name="achievement-slide">
    <div 
      v-if="isShowing && currentAchievement" 
      class="fixed top-4 left-4 z-[200] flex items-center gap-3 p-3
             bg-[#fce7f3] border-2 border-black
             shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
             max-w-xs w-full"
    >
      <div class="flex-shrink-0 w-12 h-12 bg-[#6b0455] border-2 border-t-[#9d067c] border-l-[#9d067c] border-r-black border-b-black flex items-center justify-center pixelated">
        <span v-if="currentAchievement.icon" class="text-2xl filter drop-shadow-[1px_1px_0px_black]">{{ currentAchievement.icon }}</span>
        <Award v-else class="text-yellow-400" :size="28" />
      </div>

      <div class="flex flex-col gap-0.5">
        <p class="text-[9px] font-black uppercase text-[#6b0455] tracking-tight opacity-80">
          // SYSTEM_UPDATE //
        </p>
        <p class="text-[14px] font-black uppercase text-black leading-tight">
          {{ currentAchievement.title }}
        </p>
        <p class="text-[12px] font-bold text-[#4a033b] leading-tight mt-1 opacity-90">
          {{ currentAchievement.description }}
        </p>
      </div>

      <div class="absolute -top-[2px] -right-[2px] w-2 h-2 bg-black"></div>
    </div>
  </Transition>
</template>

<style scoped>
.pixelated {
    image-rendering: pixelated;
}

.achievement-slide-enter-active,
.achievement-slide-leave-active {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.achievement-slide-enter-from {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
}

.achievement-slide-leave-to {
    transform: translateX(50%) scale(0.9);
    opacity: 0;
}
</style>