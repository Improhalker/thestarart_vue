<template>
  <div
    class="bg-black text-green-400 min-h-screen font-mono p-6 overflow-hidden"
    :class="{ glitch: glitchActive }"
    @mousemove="updateMask"
  >
    <div v-if="chaosActive" class="chaos-layer">
      <span
        v-for="(word, i) in chaosWords"
        :key="'w' + i"
        class="chaos-word"
        :style="word.style"
      >
        {{ word.text }}
      </span>

      <img
        v-for="(gif, i) in chaosGifs"
        :key="'g' + i"
        :src="gif.src"
        class="chaos-gif"
        :style="gif.style"
      />
    </div>

    <div class="mb-4">
      <p>> iniciar_sessao</p>
      <p v-if="started">> acesso concedido</p>
    </div>

    <div v-if="started" class="space-y-2">
      <div v-for="file in files" :key="file.name">
        <div
          v-if="file.unlocked"
          class="cursor-pointer hover:text-white"
          @click="openFile(file)"
        >
          {{ file.displayName || file.name }}
        </div>

        <div v-else class="opacity-30">
          arquivo_bloqueado.dat
        </div>
      </div>
    </div>

    <div v-if="currentText" class="mt-6 max-w-xl leading-relaxed">
      <p>{{ displayedText }}</p>
    </div>

    <div class="fixed bottom-10 right-10 border px-4 py-2 cursor-pointer"
      @mouseenter="moveButton"
      :style="{ transform: `translate(${btnX}px, ${btnY}px)` }">
      sair
    </div>

    <div class="mask-layer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const started = ref(false)

const files = ref([
  { name: 'memoria_01.txt', text: 'Eu me lembro daquele dia...', unlocked: true },
  { name: 'memoria_02.txt', text: 'Eu deveria ter feito algo diferente.', unlocked: false },
  { name: 'memoria_03.txt', text: 'Eu nunca tive certeza de nada.', unlocked: false },
  { name: 'memoria_04.txt', text: 'Eu nao sei o que aconteceu.', unlocked: false },
  { name: 'memoria_05.txt', text: 'Mas eu poderia mesmo ter feito algo diferente?', unlocked: false },
  { name: 'memoria_06.txt', text: 'Me desculpe.', critical: true, unlocked: false }
])

const glitchActive = ref(false)
const chaosActive = ref(false)

const currentText = ref('')
const displayedText = ref('')
let typingIndex = 0

const guiltWords = [
  'eu nao sabia', 'eu devia', 'burro', 'por que?', 'tarde demais',
  'você sabia', 'não deveria', 'de novo', 'irreversível'
]

const chaosWords = ref([])
const chaosGifs = ref([])

const gifList = [
  'https://blob.gifcities.org/gifcities/2H2ZRHC26IERKY6IX26VOBC3ADIZCGAX.gif',
  'https://blob.gifcities.org/gifcities/X63DLVMEYFRDLO3VT7UHEV6RFQ556OYS.gif',
  'https://blob.gifcities.org/gifcities/T2QH7TBCKEG5W3QFNW3RB6OU5RTZSYB3.gif',
  'https://blob.gifcities.org/gifcities/GMFBOGP4AZVMLS2GCICC3H37VFIC5AKE.gif',
  'https://blob.gifcities.org/gifcities/EPRSLXLBDRWLIKQ6TUH3FEFMS3PXYKAD.gif',
  'https://blob.gifcities.org/gifcities/GZ7J2E3NYNAUX4NTBHGJZ7V4RTCPUWCB.gif'
]

const generateChaos = () => {
  chaosWords.value = []
  chaosGifs.value = []

  for (let i = 0; i < 75; i++) {
    chaosWords.value.push({
      text: guiltWords[Math.floor(Math.random() * guiltWords.length)],
      style: {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        fontSize: 12 + Math.random() * 40 + 'px',
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        transform: `rotate(${Math.random() * 100}deg)`
      }
    })
  }

  for (let i = 0; i < 75; i++) {
    chaosGifs.value.push({
      src: gifList[Math.floor(Math.random() * gifList.length)],
      style: {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        width: 50 + Math.random() * 100 + 'px',
        transform: `rotate(${Math.random() * 100}deg)`
      }
    })
  }
}

const openFile = (file) => {
  currentText.value = file.text
  displayedText.value = ''
  typingIndex = 0
  typeEffect()

  if (file.critical) {
    triggerGlitch()
  }

  unlockNext(file)
}

const typeEffect = () => {
  if (typingIndex < currentText.value.length) {
    displayedText.value += currentText.value[typingIndex++]
    setTimeout(typeEffect, 30)
  }
}

const unlockNext = (file) => {
  const index = files.value.findIndex(f => f.name === file.name)
  if (files.value[index + 1]) {
    setTimeout(() => {
      files.value[index + 1].unlocked = true
    }, 800)
  }
}

const glitchSound = new Audio('/sounds/glitch.mp3')

const triggerGlitch = () => {
  if (glitchActive.value) return

  glitchActive.value = true
  chaosActive.value = true
  generateChaos()
  glitchSound.volume = 0.3
  glitchSound.play()
  setTimeout(() => {
    glitchActive.value = false
    chaosActive.value = false
  }, 2800)
}

const btnX = ref(0)
const btnY = ref(0)

const moveButton = () => {
  btnX.value = Math.random() * 200 - 100
  btnY.value = Math.random() * 200 - 100
}

onMounted(() => {
  setTimeout(() => {
    started.value = true
  }, 1000)
})

const updateMask = (e) => {
  document.documentElement.style.setProperty('--x', e.clientX + 'px')
  document.documentElement.style.setProperty('--y', e.clientY + 'px')
}
</script>

<style>
.mask-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: black;
  mask-image: radial-gradient(circle at var(--x) var(--y), transparent 80px, black 160px);
}

.glitch {
  animation: glitchShake 0.2s infinite;
}

@keyframes glitchShake {
  0% { transform: translate(0); }
  25% { transform: translate(-4px, 3px); }
  50% { transform: translate(4px, -3px); }
  75% { transform: translate(-2px, 2px); }
  100% { transform: translate(0); }
}

.chaos-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.chaos-word {
  position: absolute;
  font-weight: bold;
  opacity: 0.8;
  animation: flicker 0.2s infinite;
}

.chaos-gif {
  position: absolute;
  opacity: 0.9;
  animation: flicker 0.3s infinite;
}

@keyframes flicker {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}
</style>