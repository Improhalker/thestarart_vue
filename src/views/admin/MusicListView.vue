<script setup lang="ts">
import { onMounted, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { Database, Loader2, Plus, RotateCcw } from "lucide-vue-next";
import MusicCard from "@/components/admin/musics/MusicCard.vue";
import MusicForm from "@/components/admin/musics/MusicForm.vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ApiError } from "@/composables/api/useApi";
import { MusicService, type AdminMusic, type MusicPayload } from "@/services/MusicService";

type ValidationErrors = Record<string, string[]>;

const isOpen = ref(false);
const musics = ref<AdminMusic[]>([]);
const lastConfirmedMusics = ref<AdminMusic[]>([]);
const editingMusic = ref<AdminMusic | null>(null);
const pendingDeleteId = ref<number | null>(null);
const serverErrors = ref<ValidationErrors | null>(null);
const isLoadingFetch = ref(true);
const isLoadingSave = ref(false);
const isReordering = ref(false);
const deletingMusicId = ref<number | null>(null);
const feedback = ref<string | null>(null);
const loadError = ref<string | null>(null);
let fetchRequest: Promise<void> | null = null;

const fetchMusics = (): Promise<void> => {
  if (fetchRequest) return fetchRequest;

  isLoadingFetch.value = true;
  loadError.value = null;

  fetchRequest = MusicService.getAdminPlaylist()
    .then((response) => {
      musics.value = response.data;
      lastConfirmedMusics.value = [...response.data];
    })
    .catch(() => {
      loadError.value = "Não foi possível acessar a playlist administrativa.";
    })
    .finally(() => {
      isLoadingFetch.value = false;
      fetchRequest = null;
    });

  return fetchRequest;
};

const openCreateModal = () => {
  editingMusic.value = null;
  serverErrors.value = null;
  isOpen.value = true;
};

const openEditModal = (music: AdminMusic) => {
  editingMusic.value = music;
  serverErrors.value = null;
  isOpen.value = true;
};

const handleSaveMusic = async (payload: MusicPayload) => {
  isLoadingSave.value = true;
  serverErrors.value = null;
  feedback.value = null;

  try {
    if (editingMusic.value) {
      await MusicService.update(editingMusic.value.id, payload);
      feedback.value = "FAIXA_ATUALIZADA.SYS";
    } else {
      await MusicService.create(payload);
      feedback.value = "FAIXA_ADICIONADA.EXE";
    }

    isOpen.value = false;
    editingMusic.value = null;
    await fetchMusics();
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const payload = error.payload as { errors?: ValidationErrors } | null;
      serverErrors.value = payload?.errors ?? null;
      return;
    }

    feedback.value = "SYSTEM_FAILURE: não foi possível salvar a faixa.";
  } finally {
    isLoadingSave.value = false;
  }
};

const persistOrder = async () => {
  if (isReordering.value) return;

  isReordering.value = true;
  feedback.value = null;

  try {
    const response = await MusicService.reorder(
      musics.value.map((music, index) => ({ id: music.id, position: index + 1 })),
    );
    musics.value = response.data;
    lastConfirmedMusics.value = [...response.data];
    feedback.value = "ORDEM_DA_PLAYLIST_SALVA.DAT";
  } catch {
    musics.value = [...lastConfirmedMusics.value];
    feedback.value = "Não foi possível salvar a nova ordem. A lista foi restaurada.";
  } finally {
    isReordering.value = false;
  }
};

const requestDelete = (music: AdminMusic) => {
  pendingDeleteId.value = music.id;
};

const deleteMusic = async (music: AdminMusic) => {
  deletingMusicId.value = music.id;
  feedback.value = null;

  try {
    await MusicService.delete(music.id);
    pendingDeleteId.value = null;
    feedback.value = "FAIXA_REMOVIDA.DAT";
    await fetchMusics();
  } catch {
    feedback.value = "Não foi possível remover a faixa.";
  } finally {
    deletingMusicId.value = null;
  }
};

onMounted(fetchMusics);
</script>

<template>
  <div class="music-list-view space-y-6">
    <header class="flex flex-col gap-4 border-b-4 border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-black p-2 text-white"><Database :size="24" /></div>
        <div>
          <h1 class="text-3xl font-black italic tracking-tighter uppercase leading-none">Music_Playlist</h1>
          <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-ts-blue">Ordem oficial do player público</p>
        </div>
      </div>

      <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
          <Button class="rounded-none border-2 border-black bg-ts-pink text-xs font-bold uppercase text-white shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" @click="openCreateModal">
            <Plus class="mr-2 h-4 w-4" /> Add_New.wav
          </Button>
        </DialogTrigger>
        <DialogContent class="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-1rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-none border-4 border-black bg-ts-retro-gray p-0 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] outline-none">
          <DialogHeader class="shrink-0 border-b-2 border-black bg-ts-retro-blue p-2">
            <DialogTitle class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
              <span class="h-3 w-3 border border-black bg-white"></span>
              {{ editingMusic ? "Edit_Track.properties" : "Music_Wizard_Setup.msi" }}
            </DialogTitle>
          </DialogHeader>
          <div class="relative flex-1 overflow-y-auto bg-[#dfdfdf] p-4 sm:p-6">
            <div v-if="isLoadingSave" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 text-xs font-black italic"><Loader2 class="mb-2 animate-spin" />GRAVANDO_DADOS...</div>
            <MusicForm :initial-data="editingMusic" :errors="serverErrors" :is-saving="isLoadingSave" @save="handleSaveMusic" />
          </div>
        </DialogContent>
      </Dialog>
    </header>

    <p v-if="feedback" role="status" class="border-2 border-black bg-ts-retro-gray p-3 text-xs font-black uppercase">{{ feedback }}</p>

    <div v-if="isLoadingFetch" class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-black/20 bg-white/50 py-24"><Loader2 class="animate-spin text-ts-blue" :size="48" /><span class="text-xs font-black uppercase">Acessando_Disco_Rigido...</span></div>

    <div v-else-if="loadError" class="space-y-3 border-4 border-ts-pink bg-pink-50 p-6 text-center">
      <p class="text-sm font-black">{{ loadError }}</p>
      <Button :disabled="isLoadingFetch" class="rounded-none border-2 border-black bg-white text-xs font-black uppercase" @click="fetchMusics"><RotateCcw class="mr-2 h-4 w-4" />Tentar novamente</Button>
    </div>

    <template v-else-if="musics.length">
      <p class="text-xs font-bold text-gray-600">Arraste pelo ícone ☰ para salvar uma nova ordem. A ordem inclui faixas ativas e inativas.</p>
      <VueDraggable v-model="musics" :animation="150" handle=".music-drag-handle" ghost-class="opacity-40" class="space-y-4" @end="persistOrder">
        <MusicCard
          v-for="music in musics"
          :key="music.id"
          :music="music"
          :confirming-delete="pendingDeleteId === music.id"
          :deleting="deletingMusicId === music.id"
          @edit="openEditModal"
          @request-delete="requestDelete"
          @confirm-delete="deleteMusic"
          @cancel-delete="pendingDeleteId = null"
        />
      </VueDraggable>
      <p v-if="isReordering" role="status" class="text-xs font-black uppercase text-ts-blue">Salvando ordem...</p>
    </template>

    <div v-else class="border-4 border-dashed border-black/20 bg-gray-50 p-12 text-center">
      <p class="text-sm font-black uppercase italic text-gray-500">[!] A playlist ainda está vazia.</p>
      <Button variant="link" class="mt-2 text-xs font-bold uppercase text-ts-blue" @click="openCreateModal">Adicionar a primeira faixa</Button>
    </div>
  </div>
</template>
