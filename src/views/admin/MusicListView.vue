<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MusicService } from '@/services/MusicService'
import MusicForm from '@/components/admin/musics/MusicForm.vue'
import MusicCard from '@/components/admin/musics/MusicCard.vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Database } from 'lucide-vue-next'

// --- ESTADOS ---
const isOpen = ref(false)
const musics = ref<any[]>([])
const editingMusic = ref<any>(null)
const serverErrors = ref<any>(null)

const isLoadingSave = ref(false)
const isLoadingFetch = ref(true)


const openCreateModal = () => {
  editingMusic.value = null
  serverErrors.value = null
  isOpen.value = true
}

const openEditModal = (music: any) => {
  editingMusic.value = music
  serverErrors.value = null
  isOpen.value = true
}


/**
 * Busca as músicas do servidor
 */
const fetchMusics = async () => {
  isLoadingFetch.value = true
  try {
    const { data } = await MusicService.getAll()
    // Ajuste conforme a estrutura do seu retorno (data.data ou apenas data)
    musics.value = Array.isArray(data) ? data : data.data
  } catch (error) {
    console.error("Falha ao carregar músicas:", error)
  } finally {
    isLoadingFetch.value = false
  }
}

/**
 * Lida com o evento de salvar uma música
 */
const handleSaveMusic = async (payload: any) => {
  isLoadingSave.value = true
  serverErrors.value = null

  try {
    if (editingMusic.value) {
      // --- MODO EDIÇÃO ---
      console.log('Atualizando registro ID:', editingMusic.value.id)
      await MusicService.update(editingMusic.value.id, payload)
      alert('REGISTRO_ATUALIZADO_COM_SUCESSO.SYS')
    } else {
      // --- MODO CRIAÇÃO ---
      console.log('Enviando novo payload para o Laravel:', payload)
      await MusicService.create(payload)
      alert('MUSICA_GRAVADA_COM_SUCESSO.EXE')
    }

    isOpen.value = false
    fetchMusics()
    editingMusic.value = null

  } catch (error: any) {
    // Tratamento de erro 422 (Validação do Laravel)
    if (error.response && error.response.status === 422) {
      serverErrors.value = error.response.data.errors
      console.error('Falha na validação:', serverErrors.value)
      alert('ERRO_DE_VALIDACAO: Verifique os campos destacados.')
    } else {
      // Erros de conexão ou 500
      console.error('Erro crítico no servidor:', error)
      alert('SYSTEM_FAILURE: Ocorreu um erro ao conectar com o servidor.')
    }
  } finally {
    isLoadingSave.value = false
  }
}

onMounted(fetchMusics)
</script>

<template>
  <div class="music-list-view space-y-6">
    <div class="flex justify-between items-center border-b-4 border-black pb-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-black text-white">
          <Database :size="24" />
        </div>
        <div>
          <h1 class="text-3xl font-black italic tracking-tighter uppercase leading-none">Music_Database</h1>
          <p class="text-[10px] font-bold text-ts-blue uppercase tracking-widest mt-1">Status: Conectado ao Localhost
          </p>
        </div>
      </div>

      <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
          <Button @click="openCreateModal"
            class="bg-ts-pink border-2 border-black shadow-[4px_4px_0px_0px_black] rounded-none font-bold uppercase text-xs text-white hover:bg-ts-pink/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <Plus class="mr-2 h-4 w-4" /> Add_New.wav
          </Button>
        </DialogTrigger>

        <DialogContent class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] 
          bg-ts-retro-gray border-4 border-black rounded-none 
          shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] 
          p-0 gap-0 overflow-hidden outline-none
          max-h-[90vh] flex flex-col">

          <DialogHeader class="bg-ts-retro-blue p-2 border-b-2 border-black flex-shrink-0">
            <DialogTitle class="text-white text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
              <div class="w-3 h-3 bg-white border border-black shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"></div>
              Music_Wizard_Setup.msi
            </DialogTitle>
          </DialogHeader>

          <div class="p-6 bg-[#dfdfdf] overflow-y-auto custom-scrollbar flex-1 relative">
            <div v-if="isLoadingSave"
              class="absolute inset-0 bg-white/60 z-50 flex flex-col items-center justify-center font-black italic text-xs">
              <Loader2 class="animate-spin mb-2" />
              GRAVANDO_DADOS...
            </div>

            <MusicForm :initialData="editingMusic" @save="handleSaveMusic" :errors="serverErrors" />
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="isLoadingFetch"
      class="flex flex-col items-center justify-center py-24 gap-4 bg-white/50 border-2 border-dashed border-black/10">
      <Loader2 class="animate-spin text-ts-blue" :size="48" />
      <span class="font-black animate-pulse uppercase text-xs tracking-tighter">Acessando_Disco_Rigido...</span>
    </div>

    <div v-else-if="musics.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MusicCard v-for="music in musics" :key="music.id" :music="music" @edit="openEditModal" />
    </div>

    <div v-else class="border-4 border-dashed border-black/20 p-20 text-center bg-gray-50">
      <p class="text-gray-400 font-black uppercase italic text-sm">
        [!] Nenhum registro encontrado no Database.
      </p>
      <Button variant="link" @click="isOpen = true" class="mt-2 text-ts-blue font-bold uppercase text-xs">
        Clique aqui para iniciar um novo cadastro
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar Retrô Customizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #eeeeee;
  border-left: 1px solid #999;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 1px solid black;
  box-shadow: inset 1px 1px 0 white;
}
</style>