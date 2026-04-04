<script setup lang="ts">
import { ref } from 'vue'

const isAngry = ref(false)
const showBubble = ref(false)

const handleClick = () => {
  if (isAngry.value) return 

  isAngry.value = true
  showBubble.value = true
  
  setTimeout(() => {
    isAngry.value = false
    showBubble.value = false
  }, 2000)
}
</script>

<template>
  <div class="admin-pet-container fixed bottom-20 -left-12 z-[100] flex flex-col items-end">
    
    <Transition name="fade">
      <div v-if="showBubble" class="mb-2 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <p class="text-[10px] font-bold uppercase text-ts-red">DONT CLICK ME!!</p>
        <div class="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black"></div>
      </div>
    </Transition>

    <div 
      class="cursor-pointer transition-transform active:scale-95"
      @click="handleClick"
      title="FEED ME"
    >
      <img 
        :src="isAngry ? '/images/admin/madoka-no.gif' : '/images/admin/madoka.gif'" 
        alt="Mascot"
        class="w-32 md:w-80 h-auto pixelated drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
      />
    </div>
  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>