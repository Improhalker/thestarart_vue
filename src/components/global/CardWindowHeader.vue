<script setup lang="ts">
import type { Component } from "vue";
import { useAchievements } from '@/composables/useAchievements'
interface Props {
  title: string
  icon?: Component
}

const { unlock } = useAchievements()

const handleInutilClick = () => {
  unlock({
    id: 'useless_buttons',
    title: 'FALTA DE CRIATIVIDADE',
    description: 'Esses botões são meramente visuais. Parabéns, achou mais uma inutilidade no projeto!',
    icon: '⚙️'
  })
}

defineProps<Props>()
</script>

<template>
  <div class="font-pixel flex items-center justify-between px-2 py-1 border-b border-black
           bg-gradient-to-r from-[var(--ts-primary-pink)] to-[#2d0240]">

    <!-- LEFT -->
    <div class="flex items-center gap-1.5">
      <div v-if="icon" class="bg-black p-[3px] border border-white/20">
        <component :is="icon" :size="14" class="text-pink-400" />
      </div>

      <span class="text-[13px] font-bold text-white uppercase tracking-[0.1em]">
        {{ title }}
      </span>
    </div>
    <slot name="right" />

    <!-- RIGHT -->
    <div class="flex gap-1">
      <button @click="handleInutilClick" class="retro-btn w-6 h-5 text-[10px]">_</button>
      <button @click="handleInutilClick" class="retro-btn w-6 h-5 text-[10px]">X</button>
    </div>

  </div>
</template>