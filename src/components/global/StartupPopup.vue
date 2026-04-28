<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

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
          disabled
          class="text-pink-500 text-xs opacity-30 cursor-not-allowed"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-3 text-[11px] text-pink-200">
        <p>Este site ainda está em construção.</p>

        <p class="text-pink-400">
          Algumas páginas e funcionalidades podem estar incompletas ou apresentar comportamentos inesperados.
        </p>

        <p>
          Agradeço pela compreensão enquanto continuo postergando o lançamento oficial do site. Sinta-se à vontade para explorar o que já está disponível e voltar em breve para novidades!
        </p>
      </div>

      <!-- GIF -->
      <div class="flex justify-center">
        <img
          src="/public/smallgifs/sorry.gif"
          class="pixelated max-w-full opacity-80"
        />
      </div>

      <!-- Timer / bloqueio -->
      <div class="flex items-center justify-center gap-2 text-[10px] text-pink-400">
        
        <span>
          Aguarde {{ countdown }}s para continuar
        </span>
      </div>

      <!-- Footer -->
      <div class="flex justify-end">
        <button
          @click="close"
          :disabled="countdown > 0"
          class="text-[10px] px-3 py-1 border transition"
          :class="countdown > 0
            ? 'border-pink-900 text-pink-900 cursor-not-allowed opacity-50'
            : 'border-pink-700 text-pink-400 hover:bg-pink-500/10'"
        >
          {{ countdown > 0 ? `Aguarde (${countdown})` : 'Entendi' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const isOpen = ref(false)
const countdown = ref(3)

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const alreadySeen = localStorage.getItem("popup_seen")

  if (!alreadySeen) {
    setTimeout(() => {
      isOpen.value = true
      startCountdown()
    }, 1000)
  }
})

const startCountdown = () => {
  countdown.value = 3

  interval = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0 && interval) {
      clearInterval(interval)
      interval = null
    }
  }, 1000)
}

const close = () => {
  if (countdown.value > 0) return

  isOpen.value = false
  localStorage.setItem("popup_seen", "true")
}
</script>