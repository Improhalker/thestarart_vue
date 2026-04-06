<script setup lang="ts">
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { Slider } from "@/components/ui/slider";
import { Headphones, Music, Play, Pause, Volume2, VolumeX } from "lucide-vue-next";

const isMd = useMediaQuery("(min-width: 768px)");

const musics = [
  { id: "B08XeAUgrjU", title: "Elon Musk NÃO é rico", reason: "Combina com a vibe dos desenhos do momento" },
  { id: "IKgp6n21XpM", title: "Lofi relax", reason: "Boa pra desenhar à noite" },
  { id: "im7Kw9Ak6kQ", title: "Pop hits", reason: "Energia pra desenhar personagens dinâmicos" },
];

const currentMusicIndex = ref(0);
const isPlaying = ref(false);
const music = computed(() => musics[currentMusicIndex.value]!);
const player = ref<any>(null);
const isMuted = ref(false);
const volume = ref(20);
const isStarted = ref(false);
const isReady = ref(false);

const currentTime = ref(0);
const duration = ref(0);
const progressPercent = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0));
let progressInterval: any = null;

const updateProgress = () => {
  if (player.value && isPlaying.value) {
    currentTime.value = player.value.getCurrentTime();
    duration.value = player.value.getDuration();
  }
};

const startProgressTimer = () => {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(updateProgress, 500);
};

const stopProgressTimer = () => {
  clearInterval(progressInterval);
};

const setVolume = (val: number) => {
  if (!player.value || !isReady.value) return;
  player.value.setVolume(val);
  val === 0 ? player.value.mute() : player.value.unMute();
  isMuted.value = val === 0;
  volume.value = val;
};

const toggleMute = () => {
  if (!player.value) return;
  isMuted.value ? player.value.unMute() : player.value.mute();
  isMuted.value = !isMuted.value;
};

const start = () => {
  if (!player.value || !isReady.value) return;
  if (isPlaying.value) {
    player.value.pauseVideo();
    isPlaying.value = false;
    stopProgressTimer();
  } else {
    isStarted.value = true;
    player.value.playVideo();
    isPlaying.value = true;
    startProgressTimer();
  }
};

onMounted(() => {
  if (!(window as any).YT) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  (window as any).onYouTubeIframeAPIReady = () => {
    player.value = new (window as any).YT.Player("yt-player", {
      videoId: music.value.id,
      playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: () => {
          isReady.value = true;
          setVolume(volume.value);
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            isPlaying.value = true;
            startProgressTimer();
          } else {
            isPlaying.value = false;
            stopProgressTimer();
          }
        },
      },
    });
  };
});

onUnmounted(() => stopProgressTimer());
</script>

<template>
  <div v-show="isMd" class=" retro-window-border p-1 shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
    <div class="retro-title-bar mb-1 flex justify-between items-center px-2 py-1">
      <div class="flex items-center gap-2">
        <div class="bg-black p-[3px] border border-white/20"><Headphones :size="14" class="text-pink-400" /></div>
        <span class="text-[13px] font-bold text-white uppercase tracking-[0.1em]">Minhas recomendações</span>
      </div>
      <div class="flex gap-1">
        <button class="retro-btn w-6 h-5 text-[10px]">_</button>
        <button class="retro-btn w-6 h-5 text-[10px]">X</button>
      </div>
    </div>

    <div class="p-2 space-y-3">
      <div class="retro-inset-border relative aspect-video overflow-hidden border-pink-900/50">
        <div id="yt-player" class="w-full h-full"></div>
        <div v-if="!isStarted" class="absolute inset-0 z-10 cursor-pointer bg-black/40 flex items-center justify-center" @click="start">
          <img :src="`https://img.youtube.com/vi/${music.id}/hqdefault.jpg`" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity" />
          <div class="retro-window-border p-4 bg-[#6b0455] z-20"><Play class="w-8 h-8 fill-white" /></div>
        </div>
      </div>

      <div class="retro-window-border p-4 bg-[#13011a] border-pink-900/30">
        <div class="flex justify-between items-center mb-3 border-b border-pink-500/30 pb-2">
          <p class="text-[14px] font-black text-pink-400 uppercase tracking-widest truncate">TRACK: {{ music.title }}</p>
        </div>

        <div class="mb-4 space-y-1">
           <div class="flex justify-between text-[9px] font-mono text-pink-500/80 uppercase">
             <span>Progresso</span>
             <span>{{ Math.floor(progressPercent) }}%</span>
           </div>
           <div class="h-2 bg-black border border-pink-900/50 relative overflow-hidden">
             <div class="h-full bg-pink-500 transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
           </div>
        </div>

        <div class="flex items-center gap-4">
          <button @click="start" class="retro-btn p-3">
            <component :is="isPlaying ? Pause : Play" :size="16" fill="white" />
          </button>
          <button @click="toggleMute" class="retro-btn p-3">
            <component :is="isMuted ? VolumeX : Volume2" :size="16" />
          </button>
          <div class="flex-1 space-y-2">
            <div class="flex justify-between text-[10px] uppercase font-bold text-pink-300/60">
              <span class="flex items-center gap-1"><Volume2 :size="10" /> Vol</span>
              <span>{{ volume }}%</span>
            </div>
            <Slider :max="100" :step="5" class="cursor-pointer bg-pink-900/40 border border-pink-500/20 h-2" :model-value="[volume]" @update:model-value="(val) => setVolume(val?.[0] ?? 20)" />
          </div>
        </div>
      </div>

      <div class="retro-inset-border p-3 bg-[#03010e] text-pink-400 font-mono text-[12px] min-h-[60px] leading-relaxed">
        <span class="text-pink-600 font-bold opacity-80 block mb-1 underline text-[10px]">/REASON_DATA:</span>
        {{ music.reason }}
      </div>
    </div>
  </div>

  <div v-show="!isMd" class="fixed z-50 bottom-0 left-0 w-full retro-window-border-mobile p-1 text-white bg-[#13011a]">
    <div class="retro-title-bar mb-1 py-1 px-3">
      <span class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
        <Music :size="10" :class="{ 'animate-pulse': isPlaying }" /> Live_Stream.mp3
      </span>
    </div>
    <div class="flex items-center gap-4 px-3 py-2">
      <div class="w-12 h-12 retro-inset-border overflow-hidden flex-shrink-0" @click="start">
        <img :src="`https://img.youtube.com/vi/${music.id}/default.jpg`" class="w-full h-full object-cover grayscale-[0.3]" />
      </div>
      <div class="flex-1 min-w-0">
        <marquee scrollamount="3" class="text-[12px] font-bold text-pink-400 uppercase tracking-tighter">{{ music.title }}</marquee>
        <div class="w-full h-1.5 bg-pink-900/30 mt-2 border border-black overflow-hidden">
          <div class="h-full bg-pink-500 transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
      <button @click="start" class="retro-btn p-3">
        <component :is="isPlaying ? Pause : Play" :size="18" fill="white" />
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep([role="slider"]) {
  background-color: #ffffff !important;
  border: 1px solid #000 !important;
  border-radius: 0px !important;
  width: 14px !important; height: 14px !important;
  box-shadow: 1px 1px 0px 0px #000 !important;
}
.retro-window-border {
  border: 2px solid var(--ts-primary-pink);
  border-right-color: #2a0221; border-bottom-color: #2a0221;
  box-shadow: 2px 2px 0px 0px #000; background: var(--ts-primary-black);
}
.retro-window-border-mobile { border-top: 3px solid var(--ts-primary-pink); }
.retro-inset-border {
  border: 2px solid #1a0215; border-right-color: var(--ts-primary-pink); border-bottom-color: var(--ts-primary-pink);
}
.retro-title-bar { background: linear-gradient(90deg, var(--ts-primary-pink), #2d0240); border-bottom: 1px solid #000; }
.retro-btn {
  background: var(--ts-primary-pink); border: 1px solid #fff; border-right-color: #000; border-bottom-color: #000;
  color: white; display: flex; align-items: center; justify-content: center;
}
.retro-btn:active { transform: translate(1px, 1px); border: 1px solid #000; border-right-color: #fff; border-bottom-color: #fff; }
</style>