<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import RetroInput from "@/views/admin/global/RetroInput.vue";
import type { AdminMusic, MusicPayload } from "@/services/MusicService";

type ValidationErrors = Record<string, string[]>;

const props = withDefaults(
  defineProps<{
    initialData?: AdminMusic | null;
    errors?: ValidationErrors | null;
    isSaving?: boolean;
  }>(),
  {
    initialData: null,
    errors: null,
    isSaving: false,
  },
);

const emit = defineEmits<{
  save: [payload: MusicPayload];
}>();

const form = reactive({
  youtube_url: "",
  title: "",
  artist: "",
  personal_note: "",
  is_active: true,
});

const localError = ref<string | null>(null);

const fieldError = (field: keyof ValidationErrors) => props.errors?.[field]?.[0] ?? null;

const previewVideoId = computed(() => {
  try {
    const url = new URL(form.youtube_url.trim());
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ?? "";
    if (["youtube.com", "m.youtube.com", "music.youtube.com"].includes(host)) {
      if (url.pathname === "/watch") return url.searchParams.get("v") ?? "";

      const [kind, id] = url.pathname.split("/").filter(Boolean);
      return ["embed", "shorts", "v"].includes(kind ?? "") ? id ?? "" : "";
    }
  } catch {
    return "";
  }

  return "";
});

watch(
  () => props.initialData,
  (music) => {
    form.youtube_url = music?.youtube_url ?? "";
    form.title = music?.title ?? "";
    form.artist = music?.artist ?? "";
    form.personal_note = music?.personal_note ?? "";
    form.is_active = music?.is_active ?? true;
    localError.value = null;
  },
  { immediate: true },
);

const submitForm = () => {
  const youtubeUrl = form.youtube_url.trim();
  const title = form.title.trim();

  if (!youtubeUrl || !title) {
    localError.value = "Informe o link do YouTube e o título da faixa.";
    return;
  }

  localError.value = null;
  emit("save", {
    youtube_url: youtubeUrl,
    title,
    artist: form.artist.trim() || null,
    personal_note: form.personal_note.trim() || null,
    is_active: form.is_active,
  });
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <p v-if="localError" role="alert" class="border-2 border-ts-pink bg-pink-50 p-2 text-xs font-bold text-ts-pink">
      {{ localError }}
    </p>

    <div class="space-y-1">
      <RetroInput
        v-model="form.youtube_url"
        label="Link do YouTube"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
      />
      <p v-if="fieldError('youtube_url')" role="alert" class="text-xs font-bold text-ts-pink">
        {{ fieldError('youtube_url') }}
      </p>
    </div>

    <div v-if="previewVideoId" class="flex items-center gap-3 border-2 border-black bg-white p-2">
      <img
        :src="`https://i.ytimg.com/vi/${previewVideoId}/default.jpg`"
        alt="Prévia da thumbnail do vídeo"
        class="h-12 w-20 border border-black object-cover"
      />
      <p class="text-[10px] font-bold uppercase text-ts-blue">Thumbnail gerada a partir do vídeo</p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-1">
        <RetroInput v-model="form.title" label="Título" placeholder="Nome da faixa" />
        <p v-if="fieldError('title')" role="alert" class="text-xs font-bold text-ts-pink">
          {{ fieldError('title') }}
        </p>
      </div>
      <div class="space-y-1">
        <RetroInput v-model="form.artist" label="Artista ou contexto" placeholder="Artista, obra ou contexto" />
        <p v-if="fieldError('artist')" role="alert" class="text-xs font-bold text-ts-pink">
          {{ fieldError('artist') }}
        </p>
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-[10px] font-black uppercase tracking-widest text-ts-black">Personal_Note.txt</label>
      <textarea
        v-model="form.personal_note"
        rows="4"
        maxlength="2000"
        class="w-full resize-y border-2 border-black bg-white p-2 text-xs font-bold outline-none transition-shadow focus:bg-ts-blue/5 focus:shadow-[4px_4px_0px_0px_var(--ts-retro-shadow)]"
        placeholder="Uma observação pessoal opcional sobre esta faixa..."
      />
      <p v-if="fieldError('personal_note')" role="alert" class="text-xs font-bold text-ts-pink">
        {{ fieldError('personal_note') }}
      </p>
    </div>

    <label class="flex min-h-10 items-center gap-3 border-2 border-black bg-gray-200 p-2 text-[10px] font-black uppercase">
      <input
        v-model="form.is_active"
        type="checkbox"
        class="h-5 w-5 cursor-pointer appearance-none border-2 border-black checked:bg-ts-blue checked:after:absolute checked:after:ml-[3px] checked:after:mt-[-2px] checked:after:content-['X'] checked:after:text-base checked:after:text-white"
      />
      Status: {{ form.is_active ? "Ativa — disponível no player" : "Inativa — oculta no player" }}
    </label>
    <p v-if="fieldError('is_active')" role="alert" class="text-xs font-bold text-ts-pink">
      {{ fieldError('is_active') }}
    </p>

    <div class="flex justify-end border-t-2 border-black pt-4">
      <Button
        type="submit"
        :disabled="isSaving"
        class="rounded-none border-2 border-black bg-ts-blue text-xs font-black uppercase text-white shadow-[4px_4px_0px_0px_black] transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ isSaving ? "GRAVANDO..." : `[ ${initialData ? "ATUALIZAR_FAIXA.SYS" : "ADICIONAR_A_PLAYLIST.EXE"} ]` }}
      </Button>
    </div>
  </form>
</template>
