<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { Slider } from "@/components/ui/slider";
import { Info , Volume2, VolumeX, Headphones } from "lucide-vue-next";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const musics = [
  {
    id: "ko70cExuzZM",
    title: "Taylor Swift - The Fate of Ophelia",
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
const music = computed(() => musics[currentMusicIndex.value]);

const player = ref<any>(null);
const isMuted = ref(false);
const volume = ref(20); 

const setPlayerVolume = (val: number) => {
  if (!player.value) return;

  if (val === 0) {
    player.value.mute();
    isMuted.value = true;
  } else {
    player.value.setVolume(val);
    if (isMuted.value) {
      player.value.unMute();
      isMuted.value = false;
    }
  }
  volume.value = val;
};

const toggleMute = () => {
  if (!player.value) return;

  if (isMuted.value) {
    const newVol = volume.value || 50;
    setPlayerVolume(newVol);
  } else {
    player.value.mute();
    isMuted.value = true;
  }
};

const updateVolume = (val: number[]) => {
  setPlayerVolume(val[0]);
};

watch(music, (newMusic) => {
  if (player.value && newMusic) {
    player.value.loadVideoById(newMusic.id);
    setPlayerVolume(volume.value);
  }
});

onMounted(() => {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  (window as any).onYouTubeIframeAPIReady = () => {
    player.value = new (window as any).YT.Player("yt-player", {
      videoId: music.value?.id,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
      },
      events: {
        onReady: () => {
          setPlayerVolume(volume.value);
        },
      },
    });
  };
});
</script>

<template>
  <div class="absolute right-4 bottom-4">
    <div
      class="w-[230px] h-[360px] bg-[#232226] rounded-xl shadow-lg p-3 text-white flex flex-col justify-between relative"
    >
      <!-- Player -->
      <div class="relative w-full h-[250px] flex justify-center items-center rounded-lg overflow-hidden bg-black">
        <div id="yt-player" class="w-full h-full"></div>

          <!-- Botão de volume -->
        <button
            @click="toggleMute"
            class="absolute bottom-2 right-2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur transition"
            >
            <component :is="volume === 0 || isMuted ? VolumeX : Volume2" class="w-5 h-5 text-white"/>
        </button>

        <HoverCard>
          <HoverCardTrigger>
            <div
              class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all
                     bg-gradient-to-br from-[#000c6a] via-[#d00308] to-[#69029c] hover:scale-110 transition-all animate-pulse-icon"
            >
              <Info class="w-5 h-5 text-white" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent class="w-64 bg-[#232226] relative -top-78 right-4 text-white shadow-lg p-4 rounded-lg">
            Aqui eu recomendo músicas do dia enquanto você navega no site. <br> 
            Toda <bold>Segunda-feira</bold> as descobertas e recomendacoes da semana mudam!
          </HoverCardContent>
        </HoverCard>
      </div>

      <!-- Slider -->
      <div class="mt-2 flex items-center gap-2">
        <component :is="volume === 0 || isMuted ? VolumeX : Volume2" class="w-5 h-5 text-white"/>
        <Slider
          :max="100"
          :step="1"
          class="w-[60%] bg-white rounded-r-2xl rounded-l-2xl"
          :model-value="[volume]"
          @update:model-value="updateVolume"
        />
        <span class="text-xs w-8">{{ volume }}%</span>
      </div>

      <!-- Info Música -->
      <div class="mt-2">
        <p class="flex gap-1 text-gray-300 font-bold text-md items-center"><Headphones size="16" /> Do dia:</p>
        <p class="text-gray-200 font-semibold text-[12px]">{{ music.title }}</p>

        <p class="font-bold text-md mt-1"></p>
        <p class="text-blue-100 text-[10px]">{{ music.reason }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes pulse-icon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  .animate-pulse-icon {
    animation: pulse-icon 1.5s ease-in-out infinite;
  }
</style>
