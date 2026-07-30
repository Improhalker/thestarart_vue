<script setup lang="ts">
import { ArrowLeft, CircuitBoard, House, ImageIcon, RotateCcw, Satellite, UserRound } from "lucide-vue-next";
import { nextTick, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import StarStationFallback from "../components/StarStationFallback.vue";
import StarStationIntro from "../components/StarStationIntro.vue";
import StarStationMePanel from "../components/StarStationMePanel.vue";
import StarStationProjectPanel from "../components/StarStationProjectPanel.vue";
import { useStarStation } from "../composables/useStarStation";
import "../styles/star-station.css";
import { starStationArtworks } from "../utils/artworks";
import { starStationNavigationPoints } from "../utils/navigation";

const router = useRouter();
const canvasHost = ref<HTMLElement | null>(null);
const hasEntered = ref(false);

const goHome = () => {
  void router.push("/");
};

const {
  phase,
  universeView,
  selectedArtwork,
  hoveredNavigation,
  currentArtwork,
  start,
  navigateTo,
  selectArtwork,
  returnToGallery,
  resetSelection,
  dispose,
} = useStarStation(starStationArtworks, { onHomeRequest: goHome });

const enterStation = async () => {
  hasEntered.value = true;
  await nextTick();

  if (canvasHost.value) {
    await start(canvasHost.value);
  }
};

const retryStation = async () => {
  await nextTick();

  if (canvasHost.value) {
    await start(canvasHost.value);
  }
};

const returnToConstellation = () => {
  if (universeView.value === "artwork") {
    returnToGallery();
    return;
  }

  resetSelection();
};

onBeforeUnmount(dispose);
</script>

<template>
  <main class="star-station relative min-h-screen overflow-hidden font-sans text-[var(--star-station-text)]" aria-label="StarStation, navegaÃ§Ã£o por constelaÃ§Ãµes de TheStarArt_">
    <div class="star-station__scanlines absolute inset-0 z-10 opacity-30" aria-hidden="true"></div>

    <StarStationIntro v-if="!hasEntered" @enter="enterStation" />

    <section v-else class="relative min-h-screen" aria-labelledby="star-station-heading">
      <div ref="canvasHost" class="star-station__canvas absolute inset-0" aria-hidden="true"></div>

      <header class="pointer-events-none relative z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div class="border-l-2 border-[var(--star-station-primary)] bg-[color:var(--star-station-background)]/75 px-3 py-2 backdrop-blur-sm">
          <p class="font-pixel text-[10px] tracking-[0.16em] text-[var(--star-station-muted)]">THESTARART_ // CONSTELLATION NAVIGATION</p>
          <h1 id="star-station-heading" class="font-pixel text-xl text-[var(--star-station-text)] sm:text-2xl">StarStation</h1>
        </div>
        <RouterLink
          to="/"
          class="pointer-events-auto inline-flex items-center gap-2 border-2 border-[var(--star-station-line)] bg-[color:var(--star-station-background)]/85 px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] backdrop-blur-sm transition hover:border-[var(--star-station-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--star-station-text)]"
        >
          <ArrowLeft class="size-3" aria-hidden="true" /> Return to main
        </RouterLink>
      </header>

      <div class="pointer-events-none absolute left-4 top-28 z-10 hidden max-w-xs border-l-2 border-[var(--star-station-secondary)] bg-[color:var(--star-station-background)]/65 px-3 py-2 text-xs leading-5 text-[var(--star-station-muted)] backdrop-blur-sm sm:block sm:left-6">
        <p class="font-pixel text-[10px] text-[var(--star-station-text)]">{{ universeView === 'main' ? 'PRIMARY CONSTELLATION' : universeView === 'gallery' ? 'GALLERY CONSTELLATION' : 'SIGNAL INSPECTION' }}</p>
        <p class="mt-1">
          {{ universeView === 'main' ? 'Choose a signal to travel between the project, its creator, and the visual archive.' : universeView === 'gallery' ? 'Hover a drawing star to identify it, then select it to inspect the original signal.' : universeView === 'artwork' ? 'On tablet or mobile, swipe or scroll vertically to inspect the full archive file.' : 'Use the return control to continue through the constellation map.' }}
        </p>
      </div>

      <div class="pointer-events-none absolute bottom-28 left-4 z-10 sm:bottom-8 sm:left-6">
        <div v-if="currentArtwork" class="star-station__telemetry border-l-2 border-[var(--star-station-primary)] bg-[color:var(--star-station-background)]/80 px-3 py-2 backdrop-blur-sm">
          <p class="font-pixel text-[10px] tracking-[0.1em] text-[var(--star-station-muted)]">{{ selectedArtwork ? 'SELECTED ARCHIVE' : 'SIGNAL DETECTED' }}</p>
          <p class="mt-1 font-pixel text-sm text-[var(--star-station-text)]">{{ currentArtwork.title }}</p>
        </div>
        <div v-else-if="hoveredNavigation" class="star-station__telemetry border-l-2 border-[var(--star-station-secondary)] bg-[color:var(--star-station-background)]/80 px-3 py-2 backdrop-blur-sm">
          <p class="font-pixel text-[10px] tracking-[0.1em] text-[var(--star-station-muted)]">SIGNAL DETECTED</p>
          <p class="mt-1 font-pixel text-sm text-[var(--star-station-text)]">{{ starStationNavigationPoints.find((point) => point.id === hoveredNavigation)?.label }}</p>
        </div>
      </div>

      <button
        v-if="universeView !== 'main'"
        type="button"
        class="star-station__return-action pointer-events-auto absolute bottom-20 right-4 z-30 inline-flex items-center gap-2 border-2 border-[var(--star-station-primary)] bg-[var(--star-station-background)]/90 px-4 py-3 font-pixel text-[11px] text-[var(--star-station-text)] backdrop-blur-sm transition hover:bg-[var(--star-station-surface)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--star-station-text)] sm:bottom-20 sm:right-6"
        @click.stop="returnToConstellation"
      >
        <RotateCcw class="size-3" aria-hidden="true" /> {{ universeView === 'artwork' ? 'Return to gallery' : 'Return to constellations' }}
      </button>

      <section class="absolute bottom-0 z-20 w-full border-t border-[var(--star-station-line)] bg-[color:var(--star-station-background)]/90 p-3 backdrop-blur-md" aria-label="NavegaÃ§Ã£o alternativa da StarStation">
        <div v-if="universeView === 'main'" class="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto">
          <span class="hidden shrink-0 font-pixel text-[10px] tracking-[0.1em] text-[var(--star-station-muted)] sm:inline">CONSTELLATION INDEX</span>
          <button
            v-for="point in starStationNavigationPoints"
            :key="point.id"
            type="button"
            class="shrink-0 border border-[var(--star-station-line)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-muted)] transition hover:border-[var(--star-station-primary)] hover:text-[var(--star-station-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
            :aria-label="point.description"
            @click="navigateTo(point.id)"
          >
            <House v-if="point.id === 'home'" class="mr-1 inline size-3" aria-hidden="true" />
            <CircuitBoard v-else-if="point.id === 'about-project'" class="mr-1 inline size-3" aria-hidden="true" />
            <UserRound v-else-if="point.id === 'about-me'" class="mr-1 inline size-3" aria-hidden="true" />
            <ImageIcon v-else class="mr-1 inline size-3" aria-hidden="true" />
            {{ point.label }}
          </button>
        </div>

        <div v-else-if="universeView === 'gallery'" class="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto">
          <button
            type="button"
            class="shrink-0 border border-[var(--star-station-primary)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] transition hover:bg-[var(--star-station-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
            @click="resetSelection"
          >
            <RotateCcw class="mr-1 inline size-3" aria-hidden="true" /> MAIN CONSTELLATION
          </button>
          <button
            v-for="artwork in starStationArtworks"
            :key="artwork.id"
            type="button"
            class="shrink-0 border border-[var(--star-station-line)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-muted)] transition hover:border-[var(--star-station-primary)] hover:text-[var(--star-station-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
            @click="selectArtwork(artwork.id)"
          >
            {{ artwork.title }}
          </button>
        </div>

        <div v-else class="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto">
          <button
            type="button"
            class="shrink-0 border border-[var(--star-station-primary)] px-3 py-2 font-pixel text-[10px] text-[var(--star-station-text)] transition hover:bg-[var(--star-station-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--star-station-text)]"
            @click="returnToConstellation"
          >
            <RotateCcw class="mr-1 inline size-3" aria-hidden="true" /> {{ universeView === 'artwork' ? 'RETURN TO GALLERY' : 'MAIN CONSTELLATION' }}
          </button>
        </div>
      </section>

      <div v-if="phase === 'loading'" class="absolute inset-0 z-20 flex items-center justify-center bg-[var(--star-station-background)]/80 p-5 backdrop-blur-sm" role="status" aria-live="polite">
        <div class="max-w-sm border-2 border-[var(--star-station-line)] bg-[var(--star-station-surface)] p-5 text-center shadow-[6px_6px_0_var(--star-station-shadow)]">
          <Satellite class="mx-auto size-6 animate-pulse text-[var(--star-station-primary)] motion-reduce:animate-none" aria-hidden="true" />
          <p class="mt-4 font-pixel text-xs tracking-[0.12em]">INITIALIZING STARSTATION...</p>
          <p class="mt-2 text-xs text-[var(--star-station-muted)]">Mapping primary and gallery constellations.</p>
        </div>
      </div>

      <StarStationFallback v-if="phase === 'error'" :artworks="starStationArtworks" @retry="retryStation" />
      <StarStationProjectPanel
        v-if="universeView === 'about-project'"
        @return="resetSelection"
      />
      <StarStationMePanel
        v-if="universeView === 'about-me'"
        @return="resetSelection"
      />
      <p class="sr-only">
        StarStation is an interactive constellation navigator. The alternate controls expose the same destinations and drawings without using the canvas.
      </p>
      <div class="sr-only" aria-live="polite">
        {{ currentArtwork ? `Current artwork: ${currentArtwork.title}` : hoveredNavigation ? `Current destination: ${hoveredNavigation}` : 'Primary constellation ready' }}
      </div>
      <article v-if="selectedArtwork" class="sr-only" aria-label="Selected artwork details">
        <h2>{{ selectedArtwork.title }}</h2>
        <p>{{ selectedArtwork.alt }}</p>
        <p>Source: {{ selectedArtwork.src }}</p>
        <p>Original archive artwork.</p>
      </article>
    </section>
  </main>
</template>
