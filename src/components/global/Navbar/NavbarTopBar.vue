<script setup lang="ts">
import changelog from '@/data/changelog.json'
import UiSelector from '../translate/UiSelector.vue'

import { Cpu, Wifi } from 'lucide-vue-next'

const currentVersion =
  changelog[0]?.version ?? '0.0.0'
</script>

<template>
  <div
    class="
      h-8
      px-4
      flex
      items-center
      justify-between
      bg-black/70
      border-b
      border-white/10
    "
  >
    <div
      class="
        flex
        items-center
        gap-2
        text-[11px]
        uppercase
        tracking-wider
      "
    >
      <Cpu :size="12" />

      <span class="font-bold">
        THESTARART.EXE
      </span>

      <span class="text-white/40">
        v{{ currentVersion }}
      </span>
    </div>
    
    <div
      class="
        flex
        items-center
        gap-4
        text-xs
      "
    >
      <Wifi :size="12" />
      <UiSelector />
    </div>
  </div>
</template>