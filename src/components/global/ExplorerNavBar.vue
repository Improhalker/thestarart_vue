<template>
  <div
    class="relative
    bg-gradient-to-br from-[var(--ui-bg)] via-[var(--ui-bg-secondary)] to-[var(--ui-bg-tertiary)]
    shadow-[10px_10px_0px_rgba(0,0,0,0.4)]
    border-2 border-[var(--ui-border)]
    border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)]
    overflow-hidden">

    <!-- sparkles -->
    <img
      src="https://blob.gifcities.org/gifcities/RAB63QVEAB73QGUZU6DNIMIIIRIYTYLQ.gif"
      class="absolute top-1 right-1 w-8 opacity-40 pointer-events-none" />

    <!-- HEADER -->
    <CardWindowHeader title="Explorer.exe" :icon="FolderOpen" />

    <!-- CONTENT -->
    <div class="p-2 flex flex-col gap-1 relative z-10">

      <a
        v-for="link in links"
        :key="link"
        href="#"
        class="flex items-center gap-2 p-2 text-[11px]
        text-[var(--ui-text)]
        hover:bg-white/40
        hover:translate-x-1
        transition-all group
        border border-transparent hover:border-[var(--ui-border)]">

        <ChevronRight
          :size="10"
          class="group-hover:translate-x-1 transition
          text-[var(--ui-accent)]" />

        <span class="font-bold uppercase tracking-tighter">
          {{ link }}.sys
        </span>
      </a>

    </div>
  </div>
</template>

<script setup lang="ts">
import CardWindowHeader from "@/components/global/CardWindowHeader.vue"
import { FolderOpen, ChevronRight } from "lucide-vue-next";

const links = ["Home", "Projetos", "E-Sports", "Setup"];
</script>