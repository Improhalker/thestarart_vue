<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Music, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { RouterView, useRouter } from 'vue-router'
import AdminPet from '@/components/admin/madoka/AdminPet.vue'
import RightSidebar from '@/components/admin/madoka/RightSidebar.vue'

const isCollapsed = ref(false)
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-admin-tile flex font-mono text-ts-black overflow-hidden">
    <div class="scanline-overlay"></div>

    <aside :class="[
      'relative z-[60] bg-ts-retro-gray border-r-4 border-black transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    ]">
      <div class="p-4 border-b-4 border-black bg-ts-retro-blue text-white flex items-center justify-between">
        <span v-if="!isCollapsed" class="font-bold uppercase tracking-tighter italic">Admin_v1.0</span>
        <Button variant="ghost" size="icon" @click="isCollapsed = !isCollapsed" class="hover:bg-white/20 text-white">
          <ChevronLeft v-if="!isCollapsed" />
          <ChevronRight v-else />
        </Button>
      </div>

      <nav class="flex-1 p-2 space-y-2 mt-4">
        <Button variant="ghost" @click="router.push('/admin')"
          class="w-full justify-start gap-3 border-2 border-transparent hover:border-black hover:bg-gray-100 shadow-none hover:shadow-[4px_4px_0px_0px_var(--ts-retro-shadow)] transition-all">
          <LayoutDashboard :size="20" />
          <span v-if="!isCollapsed">Dashboard</span>
        </Button>

        <Button variant="ghost" @click="router.push('/admin/musics')"
          class="w-full justify-start gap-3 border-2 border-transparent hover:border-black hover:bg-gray-100 shadow-none hover:shadow-[4px_4px_0px_0px_var(--ts-retro-shadow)] transition-all">
          <Music :size="20" />
          <span v-if="!isCollapsed">Músicas</span>
        </Button>
      </nav>

      <div v-if="!isCollapsed" class="p-4 grid grid-cols-2 gap-2 border-t-4 border-black bg-gray-300">
        <img src="https://blob.gifcities.org/gifcities/2ZL6GSLIX76ROTHWO5FJPLXGA6VYHAIO.gif" alt="badges"
          class="pixelated" />
        <img src="https://cyber.dabamos.de/88x31/button.gif" alt="badge" class="pixelated" />
      </div>
    </aside>

    <main class="flex-1 relative z-10 p-6 overflow-y-auto custom-scrollbar">
      <div class="bg-white/95 border-4 border-black p-6 shadow-[8px_8px_0px_0px_var(--ts-retro-shadow)] min-h-full">
        <RouterView />
      </div>
    </main>

    <RightSidebar />

    <AdminPet />
  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 14px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #dfdfdf;
  border-left: 2px solid black;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid black;
  box-shadow: inset 1px 1px 0 white, inset -1px -1px 0 #808080;
}
</style>