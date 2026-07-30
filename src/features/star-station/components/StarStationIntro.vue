<script setup lang="ts">
defineEmits<{ enter: [] }>();
</script>

<template>
  <section
    class="star-station__intro absolute inset-0 z-20 flex items-center justify-center p-5 text-center"
    aria-labelledby="star-station-title"
  >
    <div class="max-w-xl border-2 border-[var(--star-station-line)] bg-[color:var(--star-station-surface)] px-6 py-8 shadow-[8px_8px_0_var(--star-station-shadow)] sm:px-10">
      <p class="mb-4 font-pixel text-xs tracking-[0.2em] text-[var(--star-station-muted)]">
        THESTARART_ // ARCHIVE NODE 07
      </p>
      <h1 id="star-station-title" class="font-pixel text-3xl tracking-tight text-[var(--star-station-text)] sm:text-5xl">
        StarStation
      </h1>
      <p class="mx-auto mt-5 max-w-md text-sm leading-6 text-[var(--star-station-muted)] sm:text-base">
        An experimental visual archive drifting between memory files and distant signals.
      </p>
      <button
        type="button"
        class="mt-8 border-2 border-[var(--star-station-primary)] bg-[var(--star-station-primary)] px-6 py-3 font-pixel text-xs tracking-[0.14em] text-[var(--star-station-background)] transition hover:bg-[var(--star-station-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--star-station-text)]"
        @click="$emit('enter')"
      >
        [ ENTER STATION ]
      </button>
    </div>
  </section>
</template>
