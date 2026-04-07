<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useAchievements } from '@/composables/useAchievements'

const isAngry = ref(false)
const showBubble = ref(false)

const { unlock } = useAchievements()

const handleClick = () => {
  if (isAngry.value) return 

  isAngry.value = true
  showBubble.value = true

  unlock({
    id: 'dont_touch_mascot', 
    title: 'CLIQUE NÃO SOLICITADO',
    description: 'Parabéns! Você descobriu que eu sou clicável. Agora, por favor, volte a explorar o website.',
    icon: '💢' 
  })
  // ---------------------------------
  
  setTimeout(() => {
    isAngry.value = false
    showBubble.value = false
  }, 2000)
}

onMounted(() => {
  const img = new Image()
  img.src = '/images/admin/madoka-no.gif'
})
</script>

<template>
  <div class="admin-pet-container fixed bottom-20 lg:bottom-0 left-0 md:left-12 z-[100] flex flex-col items-end">

    <div class="cursor-pointer w-32 md:w-64 h-32 md:h-64 relative overflow-visible flex items-end justify-center"
      @click="handleClick">
      <img :src="isAngry ? '/images/admin/madoka-no.gif' : '/images/admin/madoka.gif'" alt="Mascot"
        class="w-full h-auto pixelated transition-all duration-200"
        :class="isAngry ? 'scale-110 drop-shadow-[4px_4px_0px_red] mb-8' : 'scale-80 drop-shadow-[2px_2px_0px_black]'" />
    </div>
  </div>
</template>

<style scoped></style>