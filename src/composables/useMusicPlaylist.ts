import { computed, readonly, ref, watch } from "vue";
import { MusicService, type PublicMusic } from "@/services/MusicService";

type PlaylistState = "idle" | "loading" | "ready" | "empty" | "error";

const LAST_TRACK_KEY = "thestarart:music:last-track";
const VOLUME_KEY = "thestarart:music:volume";
const MUTED_KEY = "thestarart:music:muted";

const playlist = ref<PublicMusic[]>([]);
const currentIndex = ref(0);
const state = ref<PlaylistState>("idle");
const errorMessage = ref<string | null>(null);
const unavailableVideoIds = ref<string[]>([]);
let playlistLoadRequest: Promise<void> | null = null;

const storageValue = (key: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageValue = (key: string, value: string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preferências são opcionais e não devem interromper o player.
  }
};

const numberPreference = (key: string, fallback: number) => {
  const value = Number(storageValue(key));

  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : fallback;
};

const booleanPreference = (key: string, fallback: boolean) => {
  const value = storageValue(key);

  return value === null ? fallback : value === "true";
};

const volume = ref(numberPreference(VOLUME_KEY, 20));
const isMuted = ref(booleanPreference(MUTED_KEY, false));

watch(volume, (value) => {
  setStorageValue(VOLUME_KEY, String(value));
});

watch(isMuted, (value) => {
  setStorageValue(MUTED_KEY, String(value));
});

const currentMusic = computed(() => playlist.value[currentIndex.value] ?? null);
const trackLabel = computed(() =>
  currentMusic.value
    ? `TRACK ${String(currentIndex.value + 1).padStart(2, "0")}/${String(playlist.value.length).padStart(2, "0")}`
    : "TRACK --/--",
);

const saveCurrentTrack = () => {
  if (currentMusic.value) setStorageValue(LAST_TRACK_KEY, String(currentMusic.value.id));
};

const setCurrentIndex = (index: number) => {
  if (!playlist.value.length) {
    currentIndex.value = 0;
    return null;
  }

  currentIndex.value = (index + playlist.value.length) % playlist.value.length;
  saveCurrentTrack();

  return currentMusic.value;
};

const firstAvailableIndexFrom = (startIndex: number, direction: 1 | -1) => {
  if (!playlist.value.length) return null;

  for (let step = 1; step <= playlist.value.length; step += 1) {
    const index = (startIndex + direction * step + playlist.value.length) % playlist.value.length;
    const candidate = playlist.value[index];

    if (candidate && !unavailableVideoIds.value.includes(candidate.youtube_video_id)) return index;
  }

  return null;
};

export function useMusicPlaylist() {
  const load = (): Promise<void> => {
    if (playlistLoadRequest) return playlistLoadRequest;

    state.value = "loading";
    errorMessage.value = null;

    playlistLoadRequest = MusicService.getPublicPlaylist()
      .then((response) => {
        playlist.value = [...response.data].sort((first, second) => first.position - second.position);
        unavailableVideoIds.value = [];

        if (!playlist.value.length) {
          state.value = "empty";
          currentIndex.value = 0;
          return;
        }

        const savedId = Number(storageValue(LAST_TRACK_KEY));
        const restoredIndex = playlist.value.findIndex((music) => music.id === savedId);
        currentIndex.value = restoredIndex >= 0 ? restoredIndex : 0;
        saveCurrentTrack();
        state.value = "ready";
      })
      .catch(() => {
        playlist.value = [];
        currentIndex.value = 0;
        state.value = "error";
        errorMessage.value = "Não foi possível carregar a playlist agora.";
      })
      .finally(() => {
        playlistLoadRequest = null;
      });

    return playlistLoadRequest;
  };

  const next = () => setCurrentIndex(currentIndex.value + 1);
  const previous = () => setCurrentIndex(currentIndex.value - 1);

  const markCurrentVideoUnavailable = () => {
    const videoId = currentMusic.value?.youtube_video_id;

    if (!videoId || unavailableVideoIds.value.includes(videoId)) return null;

    unavailableVideoIds.value = [...unavailableVideoIds.value, videoId];
    const nextIndex = firstAvailableIndexFrom(currentIndex.value, 1);

    return nextIndex === null ? null : setCurrentIndex(nextIndex);
  };

  return {
    playlist: readonly(playlist),
    currentMusic,
    currentIndex: readonly(currentIndex),
    state: readonly(state),
    errorMessage: readonly(errorMessage),
    volume,
    isMuted,
    trackLabel,
    load,
    next,
    previous,
    setCurrentIndex,
    markCurrentVideoUnavailable,
  };
}
