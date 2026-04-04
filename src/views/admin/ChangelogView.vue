<script setup lang="ts">
import changelogData from '@/data/changelog.json'
import { Terminal, History } from 'lucide-vue-next'
</script>

<template>
  <div class="changelog-view space-y-4 max-w-4xl">
    <div class="flex items-center justify-between border-b-2 border-black pb-2">
      <div class="flex items-center gap-2">
        <History class="text-ts-pink" :size="18" />
        <h1 class="text-xl font-black italic tracking-tighter uppercase leading-none">System_Logs.txt</h1>
      </div>
      <img src="https://blob.gifcities.org/gifcities/L6X5H7KZOI5T5N5T5T5T5T5T5T5T5T5T.gif" class="h-6 pixelated opacity-80" />
    </div>

    <div class="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
      <div class="space-y-4 relative pb-4">
        <div class="absolute left-[9px] top-0 bottom-0 w-[2px] bg-black/10 hidden md:block"></div>

        <div v-for="(log, index) in changelogData" :key="log.version" class="relative md:pl-8 mb-4">
          
          <div class="absolute left-[4px] top-1 w-3 h-3 bg-white border-2 border-black hidden md:block z-10" 
               :class="index === 0 ? 'bg-ts-pink' : 'bg-gray-400'"></div>

          <div class="border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] overflow-hidden">
            <div class="bg-ts-retro-blue text-white p-0.5 px-2 flex justify-between items-center border-b-2 border-black">
              <span class="text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                <Terminal :size="10" /> BUILD_{{ log.version.replace('.', '_') }}
              </span>
              <span class="text-[8px] font-bold opacity-70">{{ log.date }}</span>
            </div>

            <div class="p-2 bg-white font-mono text-[10px]">
              <ul class="space-y-1">
                <li v-for="item in log.changes" :key="item" class="flex gap-2 leading-tight">
                  <span class="text-ts-pink font-black shrink-0">>></span>
                  <span class="text-ts-black font-bold uppercase tracking-tighter">{{ item }}</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gray-50 p-0.5 px-2 border-t border-gray-200 text-[7px] text-gray-400 flex justify-between uppercase">
              <span>Kernel_v4.2</span>
              <span class="text-green-600 font-bold">● checksum_ok</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 flex items-center gap-4 opacity-40 grayscale scale-75 origin-left">
        <img src="https://cyber.dabamos.de/88x31/webmaster.gif" />
        <p class="text-[8px] font-black uppercase leading-none">
            SCROLL_FOR_HISTORY.
        </p>
    </div>
  </div>
</template>

<style scoped>
.pixelated { image-rendering: pixelated; }

/* Scrollbar Retrô Estilo Windows 98 */
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #dfe0e1;
  border-left: 1px solid #808080;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 1px solid black;
  box-shadow: inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080;
}
.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: #808080;
  box-shadow: inset -1px -1px 0 #ffffff, inset 1px 1px 0 #000000;
}
</style>