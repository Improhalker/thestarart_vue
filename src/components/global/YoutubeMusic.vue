<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Slider } from "@/components/ui/slider";
import { ListMusic, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-vue-next";
import { useMusicPlaylist } from "@/composables/useMusicPlaylist";

type YouTubePlayer = {
  cueVideoById: (videoId: string) => void;
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YouTubeApi = {
  Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

const loadYouTubeApi = (): Promise<YouTubeApi> => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const existingCallback = window.onYouTubeIframeAPIReady;
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    const fail = (message: string) => {
      window.clearTimeout(timeout);
      youtubeApiPromise = null;
      reject(new Error(message));
    };
    const timeout = window.setTimeout(() => fail("YouTube API timeout"), 12000);

    const finish = () => {
      if (!window.YT?.Player) return;

      window.clearTimeout(timeout);
      window.onYouTubeIframeAPIReady = existingCallback;
      resolve(window.YT);
    };

    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();
      finish();
    };

    if (existingScript) {
      const checkExistingApi = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(checkExistingApi);
          finish();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => fail("YouTube API load error");
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

const {
  playlist,
  currentMusic,
  state,
  errorMessage,
  volume,
  isMuted,
  trackLabel,
  load,
  next,
  previous,
  markCurrentVideoUnavailable,
} = useMusicPlaylist();

const playerHost = ref<HTMLDivElement | null>(null);
const player = ref<YouTubePlayer | null>(null);
const isPlayerReady = ref(false);
const isPlaying = ref(false);
const hasStarted = ref(false);
const playerError = ref<string | null>(null);
const currentTime = ref(0);
const duration = ref(0);
const playWhenReady = ref(false);

const progressPercent = computed(() =>
  duration.value > 0 ? Math.min(100, (currentTime.value / duration.value) * 100) : 0,
);

const playerStateMessage = computed(() => playerError.value ?? errorMessage.value);

let progressInterval: ReturnType<typeof setInterval> | null = null;

const stopProgressTimer = () => {
  if (progressInterval) window.clearInterval(progressInterval);
  progressInterval = null;
};

const updateProgress = () => {
  if (!player.value || !isPlaying.value) return;

  currentTime.value = player.value.getCurrentTime();
  duration.value = player.value.getDuration();
};

const startProgressTimer = () => {
  stopProgressTimer();
  progressInterval = window.setInterval(updateProgress, 500);
};

const applyAudioPreferences = () => {
  if (!player.value || !isPlayerReady.value) return;

  player.value.setVolume(volume.value);
  if (isMuted.value) player.value.mute();
  else player.value.unMute();
};

const handleUnavailableVideo = () => {
  const nextMusic = markCurrentVideoUnavailable();

  if (!nextMusic) {
    isPlaying.value = false;
    stopProgressTimer();
    playerError.value = "Nenhuma faixa disponível para reprodução agora.";
    return;
  }

  playerError.value = "Vídeo indisponível: avançando para a próxima faixa.";
  loadCurrentVideo(true);
};

const createPlayer = async (youtubeApi: Promise<YouTubeApi> = loadYouTubeApi()) => {
  if (player.value || !playerHost.value || !currentMusic.value) return;

  try {
    const youtube = await youtubeApi;

    player.value = new youtube.Player(playerHost.value, {
      videoId: currentMusic.value.youtube_video_id,
      playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: () => {
          isPlayerReady.value = true;
          applyAudioPreferences();
          if (playWhenReady.value) player.value?.playVideo();
        },
        onStateChange: (event: { data: number }) => {
          if (!window.YT) return;

          if (event.data === window.YT.PlayerState.PLAYING) {
            isPlaying.value = true;
            playerError.value = null;
            startProgressTimer();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            isPlaying.value = false;
            stopProgressTimer();
          } else if (event.data === window.YT.PlayerState.ENDED) {
            isPlaying.value = false;
            stopProgressTimer();
            next();
            loadCurrentVideo(true);
          }
        },
        onError: handleUnavailableVideo,
      },
    });
  } catch {
    playerError.value = "Não foi possível iniciar o player do YouTube.";
  }
};

const loadCurrentVideo = async (shouldPlay: boolean) => {
  if (!currentMusic.value) return;

  hasStarted.value = true;
  currentTime.value = 0;
  duration.value = 0;
  playWhenReady.value = shouldPlay;

  if (!player.value || !isPlayerReady.value) {
    await createPlayer();
    return;
  }

  if (shouldPlay) player.value.loadVideoById(currentMusic.value.youtube_video_id);
  else player.value.cueVideoById(currentMusic.value.youtube_video_id);
};

const togglePlay = async () => {
  if (state.value !== "ready" || !currentMusic.value) return;

  hasStarted.value = true;
  playerError.value = null;

  if (!player.value || !isPlayerReady.value) {
    playWhenReady.value = true;
    await createPlayer();
    return;
  }

  if (isPlaying.value) player.value.pauseVideo();
  else player.value.playVideo();
};

const playPrevious = () => {
  if (!currentMusic.value) return;
  previous();
  void loadCurrentVideo(isPlaying.value);
};

const playNext = () => {
  if (!currentMusic.value) return;
  next();
  void loadCurrentVideo(isPlaying.value);
};

const onVolumeChange = (value: number[] | undefined) => {
  if (!value?.length) return;
  volume.value = value[0] ?? volume.value;
  isMuted.value = volume.value === 0;
  applyAudioPreferences();
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  applyAudioPreferences();
};

watch([volume, isMuted], applyAudioPreferences);

onMounted(async () => {
  // Busca a API do YouTube enquanto a playlist é carregada. Antes, esse
  // download só começava depois da resposta de músicas.
  const youtubeApi = loadYouTubeApi();
  await load();
  await createPlayer(youtubeApi);
});

onUnmounted(() => {
  stopProgressTimer();
  player.value?.destroy();
  player.value = null;
});
</script>

<template>
  <aside
    class="fixed bottom-0 left-0 z-50 w-full overflow-hidden border-t-[3px] border-[var(--crimson-accent)] bg-black p-1 font-pixel text-white shadow-[0_-4px_16px_rgba(0,0,0,0.55)] md:static md:max-w-[420px] md:border-4 md:border-double md:border-[var(--crimson-border)] md:shadow-[0_0_20px_rgba(255,0,0,0.2)]"
    aria-label="Player de música"
  >
    <div class="relative z-10 bg-black/75 p-1.5 md:p-3">
      <header class="mb-1 flex items-center justify-between border-b border-[var(--crimson-border)] pb-1 text-[9px] font-bold uppercase tracking-widest md:mb-2 md:text-[10px]">
        <span class="flex items-center gap-2 text-[var(--crimson-accent)]"><span class="h-2 w-2 bg-[var(--crimson-accent)]" :class="isPlaying ? 'animate-pulse' : ''"></span>Radio.exe</span>
        <span class="text-[var(--crimson-text-soft)]">{{ state === "ready" ? "Link_Established.raw" : "Scanning_Archive..." }}</span>
      </header>

      <div v-if="state === 'loading' || state === 'idle'" class="flex min-h-24 items-center justify-center border border-[var(--crimson-border)] text-xs font-bold text-[var(--crimson-text-soft)]">Carregando playlist...</div>
      <div v-else-if="state === 'empty'" class="flex min-h-24 items-center justify-center border border-[var(--crimson-border)] p-3 text-center text-xs font-bold text-[var(--crimson-text-soft)]">Nenhuma faixa ativa foi encontrada.</div>
      <div v-else-if="state === 'error'" class="flex min-h-24 items-center justify-center border border-[var(--crimson-accent)] p-3 text-center text-xs font-bold text-red-200">{{ playerStateMessage }}</div>

      <template v-else-if="currentMusic">
        <div class="mb-1.5 flex min-w-0 items-center gap-2 border border-[var(--crimson-border)] bg-black/80 p-1.5 md:mb-3 md:p-2">
          <img src="https://blob.gifcities.org/gifcities/ZPA6L2QYGWUVN4K3L2RS4KRLTWEL3B6P.gif" alt="" class="hidden h-12 w-12 shrink-0 border border-red-900 object-cover grayscale contrast-150 md:block" />
          <img :src="currentMusic.thumbnail_url" :alt="`Capa de ${currentMusic.title}`" class="h-9 w-11 shrink-0 border border-[var(--crimson-border)] object-cover grayscale md:h-12 md:w-16" />
          <div class="min-w-0 flex-1">
            <p class="hidden text-[9px] font-bold text-[var(--crimson-text-soft)] md:block">{{ trackLabel }}</p>
            <p class="truncate text-xs font-black leading-tight text-white" :title="currentMusic.title">{{ currentMusic.title }}</p>
            <p class="truncate text-[10px] font-bold text-[var(--crimson-accent)]">{{ currentMusic.artist || "TheStarArt radio archive" }}</p>
          </div>
        </div>

        <div class="relative mb-3 hidden aspect-video overflow-hidden border-2 border-[var(--crimson-border)] bg-black md:block">
          <div ref="playerHost" class="h-full w-full"></div>
          <button v-if="!hasStarted" type="button" class="absolute inset-0 flex items-center justify-center bg-black/70" aria-label="Reproduzir faixa" @click="togglePlay">
            <Play class="h-8 w-8 fill-white text-white" />
          </button>
        </div>
        <div v-if="playerStateMessage" role="status" class="mb-2 border-l-2 border-[var(--crimson-accent)] bg-red-950/30 p-2 text-[10px] font-bold text-red-100">{{ playerStateMessage }}</div>

        <div class="mb-1.5 md:mb-3">
          <div class="mb-1 hidden justify-between text-[9px] font-bold uppercase text-[var(--crimson-text-soft)] md:flex"><span>Buffer_Stream</span><span>{{ Math.floor(progressPercent) }}%</span></div>
          <div class="h-1 overflow-hidden border border-[var(--crimson-border)] bg-red-950/30 md:h-2"><div class="h-full bg-[var(--crimson-accent)] transition-all duration-500" :style="{ width: `${progressPercent}%` }"></div></div>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="min-h-11 min-w-11 border border-[var(--crimson-border)] bg-black hover:border-[var(--crimson-accent)] disabled:opacity-40" :disabled="!playlist.length" aria-label="Faixa anterior" @click="playPrevious"><SkipBack class="mx-auto text-[var(--crimson-accent)]" :size="17" /></button>
          <button type="button" class="min-h-11 min-w-11 border border-[var(--crimson-accent)] bg-red-950/40 hover:bg-[var(--crimson-accent)] disabled:opacity-40" :disabled="!playlist.length" :aria-label="isPlaying ? 'Pausar faixa' : 'Reproduzir faixa'" @click="togglePlay"><component :is="isPlaying ? Pause : Play" class="mx-auto text-white" :size="18" :class="isPlaying ? '' : 'fill-white'" /></button>
          <button type="button" class="min-h-11 min-w-11 border border-[var(--crimson-border)] bg-black hover:border-[var(--crimson-accent)] disabled:opacity-40" :disabled="!playlist.length" aria-label="Próxima faixa" @click="playNext"><SkipForward class="mx-auto text-[var(--crimson-accent)]" :size="17" /></button>
          <button type="button" class="min-h-11 min-w-11 border border-[var(--crimson-border)] bg-black hover:border-[var(--crimson-accent)]" :aria-label="isMuted ? 'Ativar som' : 'Silenciar'" @click="toggleMute"><component :is="isMuted ? VolumeX : Volume2" class="mx-auto text-white" :size="16" /></button>
        </div>
          <div class="hidden lg:mt-6 min-w-0 flex-1 md:block bg-cover bg-center" style="background-image: url('https://blob.gifcities.org/gifcities/4DDT3VQ2T543JNFZE6F573PKLMFZ5V5H.gif')"><Slider :max="100" :step="5" :model-value="[volume]" class="cursor-pointer" @update:model-value="onVolumeChange" /></div>

        <p v-if="currentMusic.personal_note" class="mt-3 hidden border-l-2 border-[var(--crimson-accent)] bg-red-950/10 p-2 text-[11px] italic text-white/70 md:block"><strong class="not-italic text-[var(--crimson-accent)]">PERSONAL_NOTE.txt:</strong> {{ currentMusic.personal_note }}</p>

        <details class="mt-3 hidden border border-[var(--crimson-border)] text-[10px] md:block">
          <summary class="flex cursor-pointer items-center gap-2 p-2 font-bold text-[var(--crimson-text-soft)]"><ListMusic :size="13" /> Playlist ({{ playlist.length }})</summary>
          <ol class="max-h-28 overflow-y-auto border-t border-[var(--crimson-border)]">
            <li v-for="music in playlist" :key="music.id" class="flex gap-2 px-2 py-1" :class="music.id === currentMusic.id ? 'bg-red-950/40 text-white' : 'text-white/60'"><span>{{ String(music.position).padStart(2, "0") }}</span><span class="truncate">{{ music.title }}</span></li>
          </ol>
        </details>
      </template>
    </div>
  </aside>
</template>

<style scoped>
@reference "../../assets/main.css";

:deep(.relative.flex.w-full.touch-none.select-none.items-center) {
  height: 0.75rem;
}

:deep(.relative.grow.overflow-hidden.rounded-full) {
  background-image: url("https://blob.gifcities.org/gifcities/WGO4PI5FFCKRLHCTRSITWIGFX745INUD.gif");
  background-size: cover;
}

@media (max-width: 767px) {
  button {
    min-width: 2.25rem;
    min-height: 2.25rem;
  }
}
</style>
