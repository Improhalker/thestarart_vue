<script setup lang="ts">
import { computed } from 'vue'
import changelogData from '@/data/changelog.json'
import CardWindowHeader from '@/components/global/CardWindowHeader.vue'
import { Terminal, Headphones } from 'lucide-vue-next'

interface Props {
  variant?: 'default' | 'retro-pink'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'retro-pink'
})

const isPink = computed(() => props.variant === 'retro-pink')
</script>

<template>
  <div class="font-pixel space-y-4 max-w-4xl p-4"
    :class="isPink ? 'bg-[#03010e] p-1 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] border-2 border-[var(--ts-primary-pink)] border-r-[#2a0221] border-b-[#2a0221] bg-[var(--ts-primary-black)]' : 'bg-white'">
    <!-- HEADER GLOBAL -->
    <CardWindowHeader title="System_Logs.txt" :icon="Headphones" />

    <!-- LIST -->
    <div class="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
      <div class="space-y-4 relative pb-4">

        <!-- LINE -->
        <div class="absolute left-[9px] top-0 bottom-0 w-[2px] hidden md:block"
          :class="isPink ? 'bg-pink-500/20' : 'bg-black/10'"></div>

        <!-- ITEMS -->
        <div v-for="(log, index) in changelogData.slice(0, 5)" :key="log.version" class="relative md:pl-8 mb-6">
          <!-- DOT -->
          <div class="absolute left-[4px] top-1 w-3 h-3 border-2 hidden md:block z-10 transition-colors" :class="[
            isPink ? 'border-pink-500' : 'border-black',
            index === 0
              ? (isPink ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-ts-pink')
              : (isPink ? 'bg-[#13011a]' : 'bg-gray-400')
          ]"></div>

          <!-- CARD -->
          <div class="overflow-hidden
                   border-2 border-[var(--ts-primary-pink)]
                   border-r-[#2a0221] border-b-[#2a0221]
                   bg-[#13011a]">

            <!-- HEADER PADRÃO (IGUAL YOUTUBE) -->
            <CardWindowHeader :title="`BUILD_${log.version.replace('.', '_')}`" :icon="Terminal">
              <template #right>
                <span class="text-[9px] text-white font-bold opacity-80 mr-2">
                  {{ log.date }}
                </span>
              </template>
            </CardWindowHeader>

            <!-- CONTENT -->
            <div class="p-3 text-[11px]" :class="isPink ? 'bg-[#03010e] text-pink-300' : 'bg-white text-black'">
              <ul class="space-y-1.5">
                <li v-for="item in log.changes" :key="item" class="flex gap-2 leading-tight">
                  <span class="font-black shrink-0" :class="isPink ? 'text-pink-500' : 'text-ts-pink'">
                    >>
                  </span>
                  <span class="font-bold uppercase tracking-tighter">
                    {{ item }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- FOOTER -->
            <div class="p-1 px-3 text-[8px] flex justify-between uppercase" :class="isPink
              ? 'bg-[#13011a] border-t border-pink-900/30 text-pink-500/50'
              : 'bg-gray-50 border-t border-gray-200 text-gray-400'">
              <span>Kernel_v4.2</span>
              <span class="font-bold" :class="isPink ? 'text-pink-400' : 'text-green-600'">
                ● checksum_ok
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="pt-2 flex items-center gap-4 opacity-40 grayscale scale-75 origin-left"
      :class="isPink ? 'brightness-150 saturate-200' : ''">
      <img src="https://cyber.dabamos.de/88x31/webmaster.gif" />
      <p class="text-[9px] font-black uppercase leading-none" :class="isPink ? 'text-pink-500' : 'text-black'">
        SCROLL_FOR_HISTORY.
      </p>
    </div>
  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: v-bind('variant === "retro-pink" ? "#13011a" : "#dfe0e1"');
  border-left: 1px solid v-bind('variant === "retro-pink" ? "#ec489933" : "#808080"');
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: v-bind('variant === "retro-pink" ? "#ec4899" : "#c0c0c0"');
  border: 1px solid black;
}
</style>