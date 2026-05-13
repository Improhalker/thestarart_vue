<template>
    <div class="music-container" :class="stateClass">

        <div v-if="chaosActive" class="chaos-layer">
            <img v-for="(gif, i) in chaosGifs" :key="i" :src="gif.src" class="chaos-gif" :style="gif.style" />
        </div>

        <div class="lyrics notranslate">
            <p v-for="(line, i) in visibleLyrics" :key="i" :class="{ active: i === visibleLyrics.length - 1 }">
                {{ line }}
            </p>
        </div>

        <audio ref="audio" @timeupdate="syncLyrics">
            <source src="/sounds/allthethingsshesaid.mp3" type="audio/mpeg" />
        </audio>

        <div v-if="!started" class="start-screen notranslate" @click="start">
            All the things she said, all the things she said, All the things she said, all the things she said, All the things she said, all the things she said, All the things she said, all the things she said,
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

const audio = ref(null)
const started = ref(false)

const currentIndex = ref(0)
const visibleLyrics = ref([])

const chaosActive = ref(false)
const stateClass = ref('')

const lyrics = [
    { time: 22.5, text: "All the things she said..." },
    { time: 23.3, text: "All the things she said..." },
    { time: 24.3, text: "Running through my head..." },
    { time: 25.5, text: "Running through my head..." },
    { time: 26.4, text: "Running through my head..." },
    { time: 27.6, text: "All the things she said..." },
    { time: 29, text: "All the things she said..." },
    { time: 29.8, text: "Running through my head..." },
    { time: 30.8, text: "Running through my head..." },
    { time: 31.5, text: "All the things she said..." },
    { time: 43.5, text: "I'm in serious shit..." }
]

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
  chaosGifs.value = []

  for (let i = 0; i < 15; i++) {
    chaosGifs.value.push({
      src: gifList[Math.floor(Math.random() * gifList.length)],
      style: {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        width: 60 + Math.random() * 120 + 'px',
        transform: `rotate(${Math.random() * 360}deg)`
      }
    })
  }
}

const start = () => {
    started.value = true
    audio.value.currentTime = 22
    audio.value.volume = 0.3
    audio.value.play()
}

const syncLyrics = () => {
    const time = audio.value.currentTime

    const next = lyrics[currentIndex.value]

    if (next && time >= next.time) {
        visibleLyrics.value.push(next.text)
        currentIndex.value++

        if (next.text.includes("All the things")) {
            triggerState('intense')
        }
        if (next.text.includes("serious")) {
            triggerChaos()
        }
    }

    if (time > 50) {
        endSequence()
    }
}

const endSequence = () => {
    audio.value.pause()

    setTimeout(() => {
        visibleLyrics.value = []
    }, 500)

    setTimeout(() => {
        visibleLyrics.value = ["isso não para nunca"]
        stateClass.value = 'void'
    }, 1200)
}

if (chaosGifs.value.length > 35) {
    chaosGifs.value.shift()
}

const triggerChaos = () => {
    chaosActive.value = true

    const interval = setInterval(() => {
        generateChaos()
    }, 200)

    setTimeout(() => {
        clearInterval(interval)
        chaosActive.value = false
    }, 3000)
}

const triggerState = (type) => {
    stateClass.value = type

    setTimeout(() => {
        stateClass.value = ''
    }, 2000)
}

</script>

<style>
.music-container {
    background: black;
    color: white;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-family: monospace;
}

/* START */
.start-screen {
    position: absolute;
    cursor: pointer;
    opacity: 0.7;
}

/* LETRAS */
.lyrics {
    text-align: center;
    z-index: 2;
}

.lyrics p {
    opacity: 0.3;
    transition: all 0.3s;
}

.lyrics p.active {
    opacity: 1;
    font-size: 1.5rem;
}

/* CHAOS */
.chaos-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
}

.chaos-word {
    position: absolute;
    font-weight: bold;
    animation: flicker 0.2s infinite;
}

@keyframes flicker {
    0% {
        opacity: 1
    }

    50% {
        opacity: 0.2
    }

    100% {
        opacity: 1
    }
}

.intense {
    animation: shake 0.2s infinite;
}

.void {
    background: black;
    color: #444;
}

@keyframes shake {
    0% {
        transform: translate(0)
    }

    25% {
        transform: translate(-3px, 2px)
    }

    50% {
        transform: translate(3px, -2px)
    }

    75% {
        transform: translate(-2px, 1px)
    }

    100% {
        transform: translate(0)
    }
}

.chaos-gif {
    position: absolute;
    opacity: 0.9;
    pointer-events: none;
    animation: flicker 0.25s infinite;
}
</style>