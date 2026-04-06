<script setup lang="ts">
import { computed } from 'vue'
import changelogData from '@/data/changelog.json'
import { Terminal, History } from 'lucide-vue-next'

// Definindo as variantes
interface Props {
  variant?: 'default' | 'retro-pink'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

// Mapeamento de classes por variante para facilitar a manutenção
const styles = computed(() => {
  if (props.variant === 'retro-pink') {
    return {
      wrapper: 'space-y-4 max-w-4xl bg-[#03010e] p-4 retro-window-border',
      headerBorder: 'border-b-2 border-pink-500/30 pb-2',
      title: 'text-xl font-black italic tracking-tighter uppercase text-pink-400',
      line: 'bg-pink-500/20',
      dot: 'border-pink-500',
      dotActive: 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]',
      dotInactive: 'bg-[#13011a]',
      cardBorder: 'border-2 border-pink-900/50 bg-[#13011a] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]',
      cardHeader: 'bg-gradient-to-r from-pink-600 to-[#2d0240] text-white border-b-2 border-pink-900/50',
      cardContent: 'bg-[#03010e] text-pink-300 font-mono',
      cardFooter: 'bg-[#13011a] border-t border-pink-900/30 text-pink-500/50',
      bullet: 'text-pink-500'
    }
  }

  // Estilo "Admin" Default (Cinza/Branco)
  return {
    wrapper: 'changelog-view space-y-4 max-w-4xl',
    headerBorder: 'border-b-2 border-black pb-2',
    title: 'text-xl font-black italic tracking-tighter uppercase text-black',
    line: 'bg-black/10',
    dot: 'border-black',
    dotActive: 'bg-ts-pink',
    dotInactive: 'bg-gray-400',
    cardBorder: 'border-2 border-black bg-white shadow-[3px_3px_0px_0px_black]',
    cardHeader: 'bg-ts-retro-blue text-white border-b-2 border-black',
    cardContent: 'bg-white text-ts-black font-mono',
    cardFooter: 'bg-gray-50 border-t border-gray-200 text-gray-400',
    bullet: 'text-ts-pink'
  }
})
</script>

<template>
  <div :class="styles.wrapper">
    <div class="flex items-center justify-between" :class="styles.headerBorder">
      <div class="flex items-center gap-2">
        <History :class="variant === 'retro-pink' ? 'text-pink-500' : 'text-ts-pink'" :size="18" />
        <h1 :class="styles.title">System_Logs.txt</h1>
      </div>
      <img src="https://blob.gifcities.org/gifcities/L6X5H7KZOI5T5N5T5T5T5T5T5T5T5T5T.gif" 
           class="h-6 pixelated opacity-80" 
           :class="variant === 'retro-pink' ? 'invert sepia saturate-[5] hue-rotate-[300deg]' : ''" />
    </div>

    <div class="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
      <div class="space-y-4 relative pb-4">
        <div class="absolute left-[9px] top-0 bottom-0 w-[2px] hidden md:block" :class="styles.line"></div>

        <div v-for="(log, index) in changelogData" :key="log.version" class="relative md:pl-8 mb-6">
          
          <div class="absolute left-[4px] top-1 w-3 h-3 border-2 hidden md:block z-10 transition-colors" 
               :class="[styles.dot, index === 0 ? styles.dotActive : styles.dotInactive]"></div>

          <div :class="styles.cardBorder" class="overflow-hidden">
            <div class="p-1 px-3 flex justify-between items-center" :class="styles.cardHeader">
              <span class="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Terminal :size="11" /> BUILD_{{ log.version.replace('.', '_') }}
              </span>
              <span class="text-[9px] font-bold opacity-80">{{ log.date }}</span>
            </div>

            <div class="p-3 text-[11px]" :class="styles.cardContent">
              <ul class="space-y-1.5">
                <li v-for="item in log.changes" :key="item" class="flex gap-2 leading-tight">
                  <span :class="styles.bullet" class="font-black shrink-0">>></span>
                  <span class="font-bold uppercase tracking-tighter">{{ item }}</span>
                </li>
              </ul>
            </div>
            
            <div class="p-1 px-3 text-[8px] flex justify-between uppercase" :class="styles.cardFooter">
              <span>Kernel_v4.2</span>
              <span :class="variant === 'retro-pink' ? 'text-pink-400' : 'text-green-600'" class="font-bold">
                ● checksum_ok
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 flex items-center gap-4 opacity-40 grayscale scale-75 origin-left"
         :class="variant === 'retro-pink' ? 'brightness-150 saturate-200' : ''">
        <img src="https://cyber.dabamos.de/88x31/webmaster.gif" />
        <p class="text-[9px] font-black uppercase leading-none" :class="variant === 'retro-pink' ? 'text-pink-500' : 'text-black'">
            SCROLL_FOR_HISTORY.
        </p>
    </div>
  </div>
</template>

<style scoped>
.pixelated { image-rendering: pixelated; }

/* Estilização da borda retro para a variante pink */
.retro-window-border {
  border: 2px solid #ec4899;
  border-right-color: #2a0221;
  border-bottom-color: #2a0221;
  box-shadow: 4px 4px 0px 0px #000000;
}

.custom-scrollbar::-webkit-scrollbar { width: 12px; }
.custom-scrollbar::-webkit-scrollbar-track {
  background: v-bind('variant === "retro-pink" ? "#13011a" : "#dfe0e1"');
  border-left: 1px solid v-bind('variant === "retro-pink" ? "#ec489933" : "#808080"');
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: v-bind('variant === "retro-pink" ? "#ec4899" : "#c0c0c0"');
  border: 1px solid black;
}
</style>