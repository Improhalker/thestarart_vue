<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next'
</script>
<template>
  <div
    class="
      hidden md:flex
      items-center gap-4
      px-6 py-2
      text-[10px]
      uppercase
      border-t border-white/10
      bg-black/50
    "
  >
    <div>STATUS: ONLINE</div>
    <div>DRAWING.EXE</div>
    <div>CS2.EXE</div>
    <div>VUE.APP</div>
    <div class="ml-auto flex gap-2 items-center">
      <Gamepad2 :size="12" />
      <span>IMPROHALKER</span>
    </div>
  </div>
</template>