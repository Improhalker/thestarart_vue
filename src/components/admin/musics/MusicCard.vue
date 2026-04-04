<script setup lang="ts">
import { Pencil, Trash2, ExternalLink } from 'lucide-vue-next'

const props = defineProps<{
    music: {
        id: number
        title: string
        youtube_id: string
        description?: string
        day_of_week: number
        is_active: boolean
    }
}>()

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

// Thumbnail do YouTube em alta qualidade
const thumbUrl = `https://img.youtube.com/vi/${props.music.youtube_id}/mqdefault.jpg`
</script>

<template>
    <div
        class="group relative bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--ts-retro-shadow)] transition-all overflow-hidden flex flex-col">

        <div class="bg-black text-white p-1 px-2 flex justify-between items-center text-[9px] font-black uppercase">
            <span>ID: #00{{ music.id }}</span>
            <span :class="music.is_active ? 'text-green-400' : ' text-red-500'">
                ● {{ music.is_active ? 'ONLINE' : ' OFFLINE ' }}
            </span>
        </div>

        <div class="relative aspect-video border-b-2 border-black overflow-hidden bg-gray-200">
            <img :src="thumbUrl"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
            <div class="absolute bottom-1 right-1 bg-ts-pink text-white text-[8px] px-1 font-bold">
                {{ days[music.day_of_week] }}
            </div>
        </div>

        <div class="p-3 flex-1 flex flex-col gap-1">
            <h3 class="font-black text-xs uppercase leading-tight truncate" :title="music.title">
                {{ music.title }}
            </h3>
            <p class="text-[10px] text-gray-600 italic line-clamp-1">
                {{ music.description || 'Sem descrição definida.' }}
            </p>
        </div>

        <div class="p-2 border-t-2 border-black bg-ts-retro-gray grid grid-cols-3 gap-2">
            <button @click="$emit('edit', music)"
                class="flex items-center justify-center p-1 border border-black bg-white hover:bg-ts-blue hover:text-white transition-colors shadow-[1px_1px_0px_black]">
                <Pencil :size="12" />
            </button>
            <button
                class="flex items-center justify-center p-1 border border-black bg-white hover:bg-ts-red hover:text-white transition-colors shadow-[1px_1px_0px_black]">
                <Trash2 :size="12" />
            </button>
            <a :href="`https://youtube.com/watch?v=${music.youtube_id}`" target="_blank"
                class="flex items-center justify-center p-1 border border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[1px_1px_0px_black]">
                <ExternalLink :size="12" />
            </a>
        </div>
    </div>
</template>