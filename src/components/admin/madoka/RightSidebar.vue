<script setup lang="ts">
import ChangelogView from '@/views/admin/ChangelogView.vue';
// TODO, add changelogs
</script>

<template>
  <aside
    class="bg-ts-retro-gray border-l-4 border-black flex-col overflow-y-auto hidden lg:flex relative z-20">
    <div
      class="p-2 bg-ts-red text-white text-[10px] font-bold uppercase tracking-widest flex justify-between items-center border-b-2 border-black">
      <span>System_Logs.txt</span>
      <div class="flex gap-1">
        <div class="w-3 h-3 border border-white bg-gray-400"></div>
        <div class="w-3 h-3 border border-white bg-red-600 shadow-[1px_1px_0px_black]"></div>
      </div>
    </div>

    <div class="p-4 space-y-6">
      <section class="space-y-2">
        <ChangelogView />
      </section>

      <section class="border-2 border-black p-2 bg-[#dfdfdf] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <p class="text-[10px] uppercase font-black mb-2 border-b border-black/20">Server Monitor</p>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[10px] font-bold">
            <span>MINE_SRV:</span>
            <span class="text-green-600 animate-pulse">ONLINE</span>
          </div>
          <div class="w-full bg-gray-300 h-2 border border-black p-[1px]">
            <div class="bg-ts-blue h-full" style="width: 65%"></div>
          </div>
          <p class="text-[9px] text-gray-500 italic text-right">RAM: 2.6GB / 4.0GB</p>
        </div>
      </section>

      <div class="pt-4 flex flex-wrap gap-2 justify-center border-t border-black/10">
        <img src="https://cyber.dabamos.de/88x31/linux.gif" class="pixelated opacity-80 hover:opacity-100" />
        <img src="https://cyber.dabamos.de/88x31/notpad.gif" class="pixelated opacity-80 hover:opacity-100" />
      </div>
    </div>

    <div
      class="mt-auto p-2 border-t-2 border-black bg-gray-300 text-[9px] text-center font-bold uppercase tracking-tighter">
      Build: April_2026_v1
    </div>

  </aside>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}
</style>