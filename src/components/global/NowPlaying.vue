<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ExternalLink, Radio } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import { useApi } from "@/composables/api/useApi";

type NowPlayingResponse = {
  data: {
    available: boolean;
    is_playing: boolean;
    track?: {
      title: string;
      artist: string;
      album: string;
      cover_url: string | null;
      spotify_url: string | null;
    };
  };
};

const { client } = useApi();
const state = ref<NowPlayingResponse["data"] | null>(null);
const failed = ref(false);
let refreshTimer: ReturnType<typeof window.setInterval> | null = null;

const refresh = async () => {
  try {
    state.value = (await client<NowPlayingResponse>("/public/spotify/now-playing", { method: "GET" })).data;
    failed.value = false;
  } catch {
    failed.value = true;
  }
};

onMounted(() => {
  void refresh();
  refreshTimer = window.setInterval(() => void refresh(), 30_000);
});

onBeforeUnmount(() => {
  if (refreshTimer) window.clearInterval(refreshTimer);
});
</script>

<template>
  <section class="container-style-dark overflow-hidden border-2" aria-live="polite" aria-label="O que TheStarArt está ouvindo agora">
    <CardWindowHeader title="NOW_PLAYING.EXE" :icon="Radio" />

    <div class="p-3">
      <p v-if="!state && !failed" class="text-[10px] uppercase text-gray-400">procurando sinal do rádio...</p>
      <p v-else-if="failed" class="text-[10px] text-gray-400">O rádio está indisponível no momento.</p>
      <p v-else-if="!state?.available" class="text-[10px] text-gray-400">Integração Spotify indisponível no momento.</p>
      <p v-else-if="!state.is_playing || !state.track" class="text-[10px] text-gray-400">Nenhuma faixa tocando agora. O rádio volta em breve.</p>
      <div v-else class="flex min-w-0 gap-3">
        <img v-if="state.track.cover_url" :src="state.track.cover_url" :alt="`Capa de ${state.track.title}`" class="h-16 w-16 shrink-0 border border-[var(--ts-primary-pink)] object-cover" />
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-1 text-[9px] uppercase text-[var(--ts-primary-pink)]"><span class="h-1.5 w-1.5 animate-pulse bg-[var(--ts-primary-pink)]" /> transmitindo agora</p>
          <p class="mt-1 truncate text-xs font-bold uppercase text-white">{{ state.track.title }}</p>
          <p class="truncate text-[10px] text-gray-300">{{ state.track.artist }}</p>
          <a v-if="state.track.spotify_url" :href="state.track.spotify_url" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 text-[9px] uppercase text-[var(--ts-primary-pink)] hover:text-white"><ExternalLink :size="11" aria-hidden="true" /> Abrir no Spotify</a>
        </div>
      </div>
    </div>
  </section>
</template>
