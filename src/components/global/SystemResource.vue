<template>
  <div
    class="relative
    bg-gradient-to-br from-[var(--ui-bg)] via-[var(--ui-bg-secondary)] to-[var(--ui-bg-tertiary)]
    shadow-[10px_10px_0px_rgba(0,0,0,0.4)]
    border-2 border-[var(--ui-border)]
    border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)]
    p-4 space-y-4 overflow-hidden">

    <!-- sparkles -->
    <img
      src="https://blob.gifcities.org/gifcities/RAB63QVEAB73QGUZU6DNIMIIIRIYTYLQ.gif"
      class="absolute bottom-1 left-1 w-8 opacity-40 pointer-events-none" />

    <!-- HEADER -->
    <h3
      class="text-[12px] font-black uppercase underline tracking-widest
      text-[var(--ui-text-soft)]">
      /System_Resources:
    </h3>

    <!-- STATS -->
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="space-y-1">

      <!-- LABEL -->
      <div
        class="flex justify-between text-[12px] font-bold uppercase
        text-[var(--ui-text)]">

        <span>{{ stat.label }}</span>
        <span>{{ stat.val }}</span>
      </div>

      <!-- BAR BG -->
      <div
        class="h-1.5 bg-white/60 border border-[var(--ui-border)] overflow-hidden">

        <!-- BAR -->
        <div
          class="h-full transition-all duration-1000 relative"
          :class="stat.color"
          :style="{ width: stat.val }">

          <!-- glow -->
          <div
            class="absolute inset-0 bg-white/20 animate-pulse pointer-events-none">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { label: "Energy", val: "80%", color: "bg-green-400" },
  { label: "Coffee", val: "100%", color: "bg-[var(--ui-accent)]" },
  { label: "Focus", val: "45%", color: "bg-blue-400" }
];
</script>