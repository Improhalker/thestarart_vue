<script setup lang="ts">
import { useAchievements } from '@/composables/useAchievements'
import { Award } from 'lucide-vue-next'

const { activeAchievements } = useAchievements()
</script>

<template>
  <div class="fixed top-4 left-4 z-[200] flex flex-col gap-3 max-w-xs w-full pointer-events-none">
    
    <TransitionGroup name="achievement-list">
      <div 
        v-for="achievement in activeAchievements" 
        :key="achievement.id"
        class="flex items-center gap-3 p-3 bg-[#fce7f3] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full pointer-events-auto relative"
      >
        <div class="flex-shrink-0 w-12 h-12 bg-[#6b0455] border-2 border-t-[#9d067c] border-l-[#9d067c] border-r-black border-b-black flex items-center justify-center pixelated">
          <span v-if="achievement.icon" class="text-2xl filter drop-shadow-[1px_1px_0px_black]">{{ achievement.icon }}</span>
          <Award v-else class="text-yellow-400" :size="28" />
        </div>

        <div class="flex flex-col gap-0.5">
          <p class="text-[9px] font-black uppercase text-[#6b0455] tracking-tight opacity-80">
            // SYSTEM_UPDATE //
          </p>
          <p class="text-[14px] font-black uppercase text-black leading-tight">
            {{ achievement.title }}
          </p>
          <p class="text-[12px] font-bold text-[#4a033b] leading-tight mt-1 opacity-90">
            {{ achievement.description }}
          </p>
        </div>

        <div class="absolute -top-[2px] -right-[2px] w-2 h-2 bg-black"></div>
      </div>
    </TransitionGroup>

  </div>
</template>

<style scoped>
.pixelated {
    image-rendering: pixelated;
}

/* Transição para a lista (empilhamento suave) */
.achievement-list-move,
.achievement-list-enter-active,
.achievement-list-leave-active {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.achievement-list-enter-from {
    transform: translateX(-100%) scale(0.8); /* Entra pela esquerda já que o badge está na esquerda */
    opacity: 0;
}

.achievement-list-leave-to {
    transform: translateX(-50%) scale(0.9);
    opacity: 0;
}

/* Garante que quem sai não "pule" o layout das outras */
.achievement-list-leave-active {
    position: absolute;
    width: 100%;
}
</style>