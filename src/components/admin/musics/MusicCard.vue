<script setup lang="ts">
import { ExternalLink, GripVertical, Pencil, Trash2 } from "lucide-vue-next";
import type { AdminMusic } from "@/services/MusicService";

defineProps<{
  music: AdminMusic;
  confirmingDelete?: boolean;
  deleting?: boolean;
}>();

defineEmits<{
  edit: [music: AdminMusic];
  requestDelete: [music: AdminMusic];
  confirmDelete: [music: AdminMusic];
  cancelDelete: [];
}>();
</script>

<template>
  <article class="flex min-w-0 flex-col border-2 border-black bg-white shadow-[4px_4px_0px_0px_black] sm:flex-row">
    <button
      type="button"
      class="music-drag-handle flex min-h-12 shrink-0 cursor-grab items-center justify-center border-b-2 border-black bg-ts-retro-gray p-3 active:cursor-grabbing sm:min-h-full sm:border-b-0 sm:border-r-2"
      aria-label="Arraste para reordenar a faixa"
      title="Arraste para reordenar"
    >
      <GripVertical :size="20" />
    </button>

    <div class="relative h-24 shrink-0 border-b-2 border-black bg-black sm:h-auto sm:w-40 sm:border-b-0 sm:border-r-2">
      <img :src="music.thumbnail_url" :alt="`Thumbnail de ${music.title}`" class="h-full w-full object-cover grayscale" />
      <span class="absolute left-1 top-1 border border-black bg-black px-1 text-[10px] font-black text-white">
        {{ String(music.position).padStart(2, "0") }}
      </span>
    </div>

    <div class="min-w-0 flex-1 p-3">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class="truncate text-sm font-black leading-tight" :title="music.title">{{ music.title }}</h2>
          <p class="truncate text-xs font-bold text-ts-blue">{{ music.artist || "Sem artista/contexto informado" }}</p>
        </div>
        <span
          class="border border-black px-2 py-1 text-[9px] font-black uppercase"
          :class="music.is_active ? 'bg-green-200 text-green-900' : 'bg-red-100 text-red-800'"
        >
          {{ music.is_active ? "Ativa" : "Inativa" }}
        </span>
      </div>
      <p class="mt-2 line-clamp-2 text-xs italic text-gray-600">
        {{ music.personal_note || "Sem nota pessoal." }}
      </p>
    </div>

    <div class="flex shrink-0 border-t-2 border-black bg-ts-retro-gray sm:w-36 sm:flex-col sm:border-l-2 sm:border-t-0">
      <template v-if="confirmingDelete">
        <button
          type="button"
          :disabled="deleting"
          class="min-h-11 flex-1 border-r border-black bg-ts-pink px-2 text-[10px] font-black uppercase text-white sm:border-b sm:border-r-0"
          @click="$emit('confirmDelete', music)"
        >
          {{ deleting ? "Removendo" : "Confirmar" }}
        </button>
        <button type="button" class="min-h-11 flex-1 px-2 text-[10px] font-black uppercase" @click="$emit('cancelDelete')">
          Cancelar
        </button>
      </template>
      <template v-else>
        <button type="button" class="min-h-11 flex-1 border-r border-black hover:bg-ts-blue hover:text-white sm:border-b sm:border-r-0" aria-label="Editar faixa" @click="$emit('edit', music)">
          <Pencil class="mx-auto" :size="16" />
        </button>
        <button type="button" class="min-h-11 flex-1 border-r border-black hover:bg-ts-pink hover:text-white sm:border-b sm:border-r-0" aria-label="Remover faixa" @click="$emit('requestDelete', music)">
          <Trash2 class="mx-auto" :size="16" />
        </button>
        <a :href="music.youtube_url" target="_blank" rel="noopener noreferrer" class="flex min-h-11 flex-1 items-center justify-center hover:bg-black hover:text-white" aria-label="Abrir vídeo no YouTube">
          <ExternalLink :size="16" />
        </a>
      </template>
    </div>
  </article>
</template>
