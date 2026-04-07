<script setup lang="ts">
import { useAchievements } from '@/composables/useAchievements'
import { Award } from 'lucide-vue-next'

const { activeAchievements } = useAchievements()
</script>

<template>
  <div class="fixed top-4 left-4 z-[200] flex flex-col gap-3 max-w-xs w-full pointer-events-none">

    <TransitionGroup name="achievement-list">
      <div v-for="achievement in activeAchievements" :key="achievement.id"
        class="flex flex-col gap-2 p-3 bg-[#fce7f3] border-4 border-black w-full pointer-events-auto relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] achievement-card pixelated-border">
        <div class="flex items-center gap-2">
          <div class="mb-1">
            <p class="text-[16px] md:text-[18px] font-black uppercase text-[#e91e63] 
            tracking-tighter leading-none pixel-text 
            drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
              CONQUISTA DESBLOQUEADA
            </p>
            <div class="h-1 w-full bg-[#e91e63] mt-1 opacity-30 shadow-[0_2px_0_0_black]"></div>
          </div>
        </div>

        <div class="flex  gap-3">
          <div
            class="flex-shrink-0 w-12 h-12 bg-[#6b0455] border-4 border-t-[#9d067c] border-l-[#9d067c] border-r-black border-b-black flex items-center justify-center pixelated overflow-hidden">
            <img src="/images/trofeu.png" alt="Pixel Trophy" class="w-10 h-10 object-contain" />
          </div>

          <div class="flex flex-col gap-1">
            <div class="relative group">
              <div class="absolute -left-1 inset-y-0 w-1 bg-[var(--ts-retro-blue)] opacity-50"></div>

              <p class="text-[15px] font-black uppercase text-black leading-tight pixel-text 
            pl-1 group-hover:text-[var(--ts-retro-blue)] transition-colors">
                <span class="bg-[var(--ts-retro-blue)]/10 px-1">
                  {{ achievement.title }}
                </span>
              </p>
            </div>
            <p class="text-[11px] font-bold text-[#4a033b] leading-tight mt-1 opacity-90 pixel-text">
              "{{ achievement.description }}"
            </p>
          </div>
        </div>

        <div class="absolute -top-[4px] -right-[4px] w-4 h-4 bg-black"></div>
        <div class="absolute -top-[4px] -right-[4px] w-3 h-3 bg-[#e91e63]"></div>
        <div class="absolute -bottom-[4px] -left-[4px] w-4 h-4 bg-black"></div>
        <div class="absolute -bottom-[4px] -left-[4px] w-3 h-3 bg-[#e91e63]"></div>
      </div>
    </TransitionGroup>

  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

/* Tenta usar uma fonte pixel art se disponível, fallback para negrito */
.pixel-text {
  font-family: 'Press Start 2P', 'Courier New', Courier, monospace;
}

/* Borda de pixel mais grossa e com efeito de chanfro */
.pixelated-border {
  border-width: 4px;
}

.achievement-card {
  /* Adiciona um efeito de chanfro de pixel na borda principal */
  background-image:
    linear-gradient(to right, black 4px, transparent 4px),
    linear-gradient(to bottom, black 4px, transparent 4px),
    linear-gradient(to left, black 4px, transparent 4px),
    linear-gradient(to top, black 4px, transparent 4px);
  background-size: 100% 4px, 4px 100%, 100% 4px, 4px 100%;
  background-repeat: no-repeat;
  background-position: top center, right center, bottom center, left center;
}

/* Transição para a lista (empilhamento suave) */
.achievement-list-move,
.achievement-list-enter-active,
.achievement-list-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.achievement-list-enter-from {
  transform: translateX(-100%) scale(0.8);
  opacity: 0;
}

.achievement-list-leave-to {
  transform: translateX(-50%) scale(0.9);
  opacity: 0;
}

.achievement-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>