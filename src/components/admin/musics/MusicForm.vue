<script setup lang="ts">
import { reactive, watch } from 'vue' // Adicionado watch
import RetroInput from '@/views/admin/global/RetroInput.vue'
import { Button } from '@/components/ui/button'

// Definindo as Props
const props = defineProps<{
  initialData?: any // Dados da música para edição
  errors?: any      // Erros do Laravel
}>()

const emit = defineEmits(['save'])

const form = reactive({
  title: '',
  youtube_input: '',
  description: '',
  day_of_week: 0,
  is_active: true 
})

// MÁGICA DA EDIÇÃO: Quando o componente recebe initialData, ele preenche o form
watch(() => props.initialData, (newVal) => {
  console.log('--- DEBUG_LOG_START ---')
  console.log('Dados brutos recebidos:', newVal)
  
  if (newVal) {
    form.title = newVal.title
    form.youtube_input = newVal.youtube_id
    form.description = newVal.description || ''
    form.day_of_week = newVal.day_of_week
    
    // Forçando a conversão e logando o resultado
    const activeStatus = newVal.is_active === 1 || newVal.is_active === true || newVal.is_active === '1'
    form.is_active = activeStatus
    
    console.log('Resultado da conversão is_active:', activeStatus)
  } else {
    console.log('Modo criação detectado (reset)')
    form.title = ''
    form.youtube_input = ''
    form.description = ''
    form.day_of_week = 0
    form.is_active = true 
  }
  console.log('--- DEBUG_LOG_END ---')
}, { immediate: true, deep: true }) // Adicionei deep: true por segurança

const extractYoutubeId = (input: string) => {
  if (!input) return ''
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = input.match(regExp)
  return (match && match[7] && match[7].length === 11) ? match[7] : input
}

const days = [
  { val: 0, label: 'Domingo' },
  { val: 1, label: 'Segunda-feira' },
  { val: 2, label: 'Terça-feira' },
  { val: 3, label: 'Quarta-feira' },
  { val: 4, label: 'Quinta-feira' },
  { val: 5, label: 'Sexta-feira' },
  { val: 6, label: 'Sábado' },
]

const submitForm = () => {
  if (!form.title || !form.youtube_input) return alert('Campos obrigatórios!')

  const payload = {
    title: form.title,
    youtube_id: extractYoutubeId(form.youtube_input),
    description: form.description,
    day_of_week: Number(form.day_of_week),
    is_active: form.is_active ? 1 : 0
  }
console.log('Payload a ser enviado:', payload) // Log para depuração
  emit('save', payload)
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RetroInput label="Título" v-model="form.title" placeholder="Nome da faixa" />
      <RetroInput label="YouTube (URL ou ID)" v-model="form.youtube_input" placeholder="Ex: azrZoMh_iMQ" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-black uppercase tracking-widest text-ts-black">Dia da Semana</label>
        <select v-model="form.day_of_week"
          class="bg-white border-2 border-black p-2 text-xs font-bold outline-none appearance-none">
          <option v-for="day in days" :key="day.val" :value="day.val">{{ day.label }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3 p-2 border-2 border-black bg-gray-200 h-[38px]">
        <input type="checkbox" id="is_active" v-model="form.is_active"
          class="w-5 h-5 border-2 border-black rounded-none appearance-none cursor-pointer relative checked:bg-ts-blue checked:after:content-['X'] checked:after:text-white checked:after:absolute checked:after:left-[3px] checked:after:top-[-2px] checked:after:font-black" />
        <label for="is_active" class="text-[10px] font-black uppercase cursor-pointer">Status: {{ form.is_active ?
          'Ativo' : 'Inativo' }}</label>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-[10px] font-black uppercase tracking-widest text-ts-black">Descrição</label>
      <textarea v-model="form.description" rows="3"
        class="bg-white border-2 border-black p-2 text-xs font-bold outline-none resize-none"
        placeholder="Informações adicionais..."></textarea>
    </div>

    <div class="pt-4 border-t-2 border-black flex justify-end">
      <Button type="submit"
        class="bg-ts-blue text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xs">
        [ {{ props.initialData ? 'ATUALIZAR_BANCO.SYS' : 'EXECUTAR_UPLOAD.SYS' }} ]
      </Button>
    </div>
  </form>
</template>