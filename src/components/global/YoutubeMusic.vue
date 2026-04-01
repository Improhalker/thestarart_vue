<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { Slider } from "@/components/ui/slider";
import { Info, Volume2, VolumeX, Headphones, Music, Play, Pause } from "lucide-vue-next";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const isMd = useMediaQuery("(min-width: 768px)");

const musics = [
  {
    id: "lNMTtvVes8Y",
    title: "The Neighbourhood - Holy Ghost",
    reason: "Combina com a vibe dos desenhos do momento",
  },
  {
    id: "IKgp6n21XpM",
    title: "Lofi relax",
    reason: "Boa pra desenhar à noite",
  },
  {
    id: "im7Kw9Ak6kQ",
    title: "Pop hits",
    reason: "Energia pra desenhar personagens dinâmicos",
  },
];

const currentMusicIndex = ref(0);
const isLoading = ref(false);
const isPlaying = ref(false);
const music = computed(() => musics[currentMusicIndex.value]!);
const player = ref<any>(null);
const isMuted = ref(false);
const volume = ref(20);
const isStarted = ref(false);
const isReady = ref(false);

const setVolume = (val: number) => {
  if (!player.value) return;
  player.value.setVolume(val);
  val === 0 ? player.value.mute() : player.value.unMute();
  isMuted.value = val === 0;
  volume.value = val;
};

const toggleMute = () => {
  if (!player.value) return;
  isMuted.value ? setVolume(volume.value || 20) : player.value.mute();
  isMuted.value = !isMuted.value;
};

const updateVolume = (val: number[] | undefined) => {
  setVolume(val?.[0] ?? 20);
};

const start = () => {
  if (!player.value || !isReady.value) return;

  isStarted.value = true;
  isLoading.value = true;

  player.value.playVideo();

  setTimeout(() => {
    isLoading.value = false;
    isPlaying.value = true;
  }, 750);
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
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          isReady.value = true;
          setVolume(volume.value);
        },
      },
    });
  };

  if ((window as any).YT?.Player) {
    (window as any).onYouTubeIframeAPIReady();
  }
});

watch(isReady, (ready) => {
  if (ready && isStarted.value) {
    player.value.playVideo();
  }
});
</script>

<template>
  <div v-if="!isMd"
    class="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[300px] h-[80px] bg-[#1a191d]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 text-white flex items-center gap-3 px-3">

    <div class="bg-[#6c021f]/20 p-2 rounded-xl">
      <Music class="w-4 h-4 text-white animate-pulse" />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-[11px] font-medium line-clamp-2">{{ music.title }}</p>
      <p class="text-[9px] text-gray-400 line-clamp-2">{{ music.reason }}</p>
    </div>

    <button @click="start" class="p-2">
      <!-- loading -->
      <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

      <!-- tocando -->
      <Pause v-else-if="isPlaying" class="flex gap-[2px]" />

      <!-- play padrão -->
      <Play v-else class="w-5 h-5 fill-white" />
    </button>

    <button @click="toggleMute">
      <component :is="isMuted ? VolumeX : Volume2" class="w-5 h-5" />
    </button>
  </div>

  <div class="hidden md:block fixed z-50 transition-all duration-500 ease-in-out bottom-8 right-8 w-[230px] h-[380px]">

    <div
      class="w-full h-full bg-[#1a191d]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 text-white flex flex-col relative overflow-hidden p-3">

      <div class="flex justify-between items-center mb-3 px-1">
        <div class="flex items-center gap-2">
          <Headphones :size="14" class="text-[#6b0455]" />
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Som do Dia
          </span>
        </div>
      </div>

      <div
        class="relative w-full aspect-square md:h-[220px] flex justify-center items-center rounded-xl overflow-hidden bg-black border border-white/5">

        <div id="yt-player" class="w-full h-full opacity-60"></div>

        <div v-if="!isStarted" class="absolute inset-0 z-10 cursor-pointer group" @click="start">
          <img :src="`https://img.youtube.com/vi/${music.id}/hqdefault.jpg`"
            class="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition" />

          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 group-hover:scale-110 transition">
              <Play class="w-6 h-6 fill-white" />
            </div>
          </div>
        </div>

        <div class="absolute top-2 right-2 z-20">
          <HoverCard>
            <HoverCardTrigger>
              <div
                class="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-[#000c6a] via-[#d00308] to-[#69029c] animate-pulse-icon">
                <Info class="w-4 h-4 text-white" />
              </div>
            </HoverCardTrigger>

            <HoverCardContent class="w-64 bg-[#232226] border-white/10 text-white p-4 text-xs">
              Minhas musicas favoritas da semana. Troco toda semana, então sempre tem coisa nova pra ouvir. A maioria
              é indie/alternativa, mas as vezes rola umas coisas mais animadas também.
            </HoverCardContent>
          </HoverCard>
        </div>

        <button @click.stop="toggleMute"
          class="absolute bottom-3 right-3 z-20 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10">
          <component :is="volume === 0 || isMuted ? VolumeX : Volume2" class="w-4 h-4 text-white" />
        </button>
      </div>

      <div class="mt-4 flex items-center gap-3 px-1">
        <component :is="volume === 0 || isMuted ? VolumeX : Volume2" class="w-5 h-5 text-white" />

        <Slider :max="100" :step="1" class="flex-1 bg-white/20 rounded-full" :model-value="[volume]"
          @update:model-value="updateVolume" />

        <span class="text-[10px] font-mono text-gray-500 w-6 text-right">
          {{ volume }}%
        </span>
      </div>

      <div class="mt-4 bg-white/[0.03] py-2 p-3 rounded-xl border border-white/5">
        <p class="text-[12px] font-semibold text-white leading-tight mb-1 line-clamp-2">
          {{ music.title }}
        </p>

        <p class="text-[10px] text-blue-300/60 italic line-clamp-2">
          {{ music.reason }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-icon {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.animate-pulse-icon {
  animation: pulse-icon 2s ease-in-out infinite;
}
</style>