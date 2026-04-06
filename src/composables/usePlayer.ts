// usePlayer.ts
import { ref } from "vue";

const player = ref<any>(null);
const isReady = ref(false);
const isPlaying = ref(false);

export function usePlayer() {
  return {
    player,
    isReady,
    isPlaying,
  };
}