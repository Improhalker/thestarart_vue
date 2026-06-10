<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { Slider } from "@/components/ui/slider";
import { Headphones, Music, Play, Pause, Volume2, VolumeX } from "lucide-vue-next";
import CardWindowHeader from "./CardWindowHeader.vue";

const isMd = useMediaQuery("(min-width: 768px)");

const musics = [
  {
    id: "2sBRnnnZyFw",
    title: "Twenty One Pilots - Choker (Official Video)",
    reason:
      "Musica mto gostosa de se ouvir, sincermanete, minha namorada que me recomendou",
  },
  { id: "IKgp6n21XpM", title: "Lofi relax", reason: "Boa pra desenhar à noite" },
  {
    id: "im7Kw9Ak6kQ",
    title: "Pop hits",
    reason: "Energia pra desenhar personagens dinâmicos",
  },
];

const currentMusicIndex = ref(0);
const isPlaying = ref(false);
const music = computed(() => musics[currentMusicIndex.value]!);
const player = ref<any>(null);
const isMuted = ref(false);
const volume = ref(20);
const isStarted = ref(false);
const isReady = ref(false);
const isToggling = ref(false);

const currentTime = ref(0);
const duration = ref(0);
const progressPercent = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
);

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

const onVolumeChange = (val: number[] | undefined) => {
  if (!val || !val.length) return;
  setVolume(val[0]!);
};
const setVolume = (val: number) => {
  volume.value = val;

  if (!player.value || !isReady.value) return;

  player.value.setVolume(val);

  if (val === 0) {
    player.value.mute();
    isMuted.value = true;
  } else {
    player.value.unMute();
    isMuted.value = false;
  }
};

const toggleMute = () => {
  if (!player.value) return;
  isMuted.value ? player.value.unMute() : player.value.mute();
  isMuted.value = !isMuted.value;
};

const start = () => {
  if (!player.value || !isReady.value) return;

  isStarted.value = true;

  if (isPlaying.value) {
    player.value.pauseVideo();
  } else {
    player.value.playVideo();
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
          player.value.setVolume(volume.value);
        },
        onStateChange: (event: any) => {
          const state = event.data;
          const YTState = (window as any).YT.PlayerState;

          if (state === YTState.PLAYING) {
            isPlaying.value = true;
            startProgressTimer();
          }

          if (state === YTState.PAUSED) {
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
  <div
    v-show="isMd"
    class="max-w-[420px] font-pixel p-1 relative overflow-hidden bg-black border-4 border-double border-[var(--crimson-border)] shadow-[0_0_20px_rgba(255,0,0,0.2)]"
  >
    <img
      src="https://blob.gifcities.org/gifcities/4TJDYREDRT376NS4QNFVRZEWJVCLC7IX.gif"
      class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
    />

    <div class="p-3 relative z-10 bg-black/40 backdrop-blur-[1px]">
      <div
        class="flex justify-between items-center border-b border-[var(--crimson-border)] mb-4 pb-1"
      >
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-[var(--crimson-accent)] animate-pulse"></div>
          <span
            class="text-[var(--crimson-accent)] text-[10px] font-bold tracking-widest uppercase"
            >Radio v2.2</span
          >
        </div>
        <img
          src="https://blob.gifcities.org/gifcities/AVTTI34ND3VRS4ODVSAA6DZVFZTHA7AL.gif"
          class="h-4 grayscale invert"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <div
          class="flex border border-[var(--crimson-border)] relative overflow-hidden justify-center py-4"
        >
          <img
            src="https://blob.gifcities.org/gifcities/ZPA6L2QYGWUVN4K3L2RS4KRLTWEL3B6P.gif"
            class="h-24 object-cover grayscale contrast-150 opacity-80"
          />

          <div class="absolute inset-0 bg-red-900/20"></div>
        </div>
        <div
          class="flex-1 bg-black/80 p-2 border border-[var(--crimson-border)] relative flex flex-col justify-center"
        >
          <p class="text-[9px] text-[var(--crimson-text-soft)] mb-1 font-bold">
            >> NOW_PLAYING
          </p>
          <p class="text-[11px] text-white leading-tight uppercase font-black">
            {{ music.title }}
          </p>
          <div class="mt-2 flex gap-1">
            <div
              v-for="i in 4"
              :key="i"
              class="w-1 h-1 bg-[var(--crimson-accent)]"
              :class="isPlaying ? 'animate-bounce' : ''"
              :style="{ animationDelay: `${i * 0.1}s` }"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="relative aspect-video border-2 border-[var(--crimson-border)] mb-4 bg-black group overflow-hidden"
      >
        <div id="yt-player" class="w-full h-full"></div>

        <div
          v-if="!isStarted"
          class="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black"
          @click="start"
        >
          <img
            :src="`https://img.youtube.com/vi/${music.id}/hqdefault.jpg`"
            class="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
          />
          <div
            class="relative z-30 p-4 border-2 border-[var(--crimson-accent)] bg-black/80 group-hover:bg-[var(--crimson-accent)] group-hover:scale-110 transition-all"
          >
            <Play class="w-6 h-6 fill-white" />
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div
          class="flex justify-between text-[9px] uppercase text-[var(--crimson-text-soft)] mb-1 font-bold"
        >
          <span>Buffer_Stream</span>
          <span>{{ Math.floor(progressPercent) }}%</span>
        </div>
        <div
          class="h-2 bg-red-950/30 border border-[var(--crimson-border)] overflow-hidden"
        >
          <div
            class="h-full bg-[var(--crimson-accent)] shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-500"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="start"
          class="p-3 bg-black border border-[var(--crimson-border)] hover:border-[var(--crimson-accent)] transition-colors"
        >
          <component
            :is="isPlaying ? Pause : Play"
            :size="16"
            class="text-[var(--crimson-accent)]"
          />
        </button>

        <div class="flex-1 space-y-1">
          <div
            class="flex justify-between text-[12px] font-bold text-[var(--crimson-text-soft)] uppercase"
          >
            <span class="flex items-center gap-1">
              <Volume2 :size="10" /> Output_Gain
            </span>
            <span>{{ volume }}%</span>
          </div>
          <Slider
            :max="100"
            :step="5"
            class="w-full cursor-pointer"
            :model-value="[volume]"
            @update:model-value="onVolumeChange"
          />
        </div>

        <button
          @click="toggleMute"
          class="p-3 bg-black border border-[var(--crimson-border)] hover:border-[var(--crimson-accent)]"
        >
          <component :is="isMuted ? VolumeX : Volume2" :size="14" class="text-white" />
        </button>
      </div>

      <div
        class="mt-4 p-2 bg-red-950/10 border-l-2 border-[var(--crimson-accent)] text-[13px] text-white/60 italic"
      >
        <span class="text-[var(--crimson-accent)] not-italic font-bold">DATA_LOG:</span>
        {{ music.reason }}
      </div>
    </div>
  </div>
  <div
    v-show="!isMd"
    class="fixed z-50 bottom-0 left-0 w-full p-1 text-white bg-black border-t-[3px] border-[var(--crimson-accent)] overflow-hidden"
  >
    <img
      src="https://blob.gifcities.org/gifcities/4TJDYREDRT376NS4QNFVRZEWJVCLC7IX.gif"
      class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
    />

    <div class="relative z-10">
      <div
        class="mb-1 px-3 py-1 flex items-center justify-between bg-gradient-to-r from-[var(--crimson-border)] to-black border-b border-red-900/50"
      >
        <div class="flex items-center gap-2">
          <Music
            :size="10"
            :class="{ 'animate-pulse text-[var(--crimson-accent)]': isPlaying }"
          />
          <span class="text-[10px] font-bold uppercase tracking-widest text-red-500">
            Link_Established.raw
          </span>
        </div>
        <span class="text-[9px] text-red-800">{{ Math.floor(progressPercent) }}%</span>
      </div>

      <div class="flex items-center gap-3 px-3 py-2">
        <div
          class="w-12 h-12 overflow-hidden border border-[var(--crimson-border)] bg-red-950/20"
          @click="start"
        >
          <img
            :src="`https://img.youtube.com/vi/${music.id}/default.jpg`"
            class="w-full h-full object-cover grayscale contrast-125"
          />
        </div>

        <div class="flex-1 min-w-0">
          <p
            class="text-[11px] font-black truncate text-[var(--crimson-accent)] uppercase"
          >
            {{ music.title }}
          </p>

          <div class="h-1 w-full bg-red-950 mt-1 overflow-hidden">
            <div
              class="h-full bg-[var(--crimson-accent)]"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>

        <button
          @click="start"
          class="p-3 bg-red-600 border border-white active:bg-red-800"
        >
          <component :is="isPlaying ? Pause : Play" :size="18" fill="white" />
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference "../../assets/main.css";

:deep(.relative.flex.w-full.touch-none.select-none.items-center) {
  height: 1rem;
}

:deep(.relative.grow.overflow-hidden.rounded-full) {
  background-image: url("https://blob.gifcities.org/gifcities/WGO4PI5FFCKRLHCTRSITWIGFX745INUD.gif");
  height: 1rem;
  background-size: cover;
}
</style>
