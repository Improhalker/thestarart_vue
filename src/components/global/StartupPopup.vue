<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

    <!-- Modal -->
    <div
      class="relative w-full max-w-md mx-2
             bg-[#0a0110]
             border-2 border-[var(--ts-primary-pink)]
             border-r-[#2a0221] border-b-[#2a0221]
             p-4 space-y-4"
    >
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-pink-500 text-xs font-black uppercase">
          Aviso_do_Sistema.exe
        </h2>

        <button
          @click="close"
          class="text-pink-500 hover:text-pink-300 text-xs"
        >
          ✕
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="space-y-3 text-[11px] text-pink-200">
        <p>
          Este site ainda está em construção.
        </p>
        <p class="text-pink-400">
          Algumas paginas e funcionalidades podem estar incompletas ou apresentar comportamentos inesperados.
        </p>
        <p>
          Agradeço pela compreensão enquanto continuo desenvolvendo a experiência.
        </p>
      </div>

      <!-- GIF -->
      <div class="flex justify-center">
        <img
          src="https://blob.gifcities.org/gifcities/2G5PMWWQRBXXQVVYEM6CPVUOXHPFLWRK.gif"
          class="pixelated max-w-full opacity-80"
        />
      </div>

      <!-- Footer -->
      <div class="flex justify-end">
        <button
          @click="close"
          class="text-[10px] px-3 py-1
                 border border-pink-700
                 text-pink-400
                 hover:bg-pink-500/10 transition"
        >
          Entendi
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const isOpen = ref(false)

onMounted(() => {
  const alreadySeen = localStorage.getItem("popup_seen")

  if (!alreadySeen) {
    setTimeout(() => {
      isOpen.value = true
    }, 1000) // delayzinho estilo sistema iniciando
  }
})

const close = () => {
  isOpen.value = false
  localStorage.setItem("popup_seen", "true")
}
</script>