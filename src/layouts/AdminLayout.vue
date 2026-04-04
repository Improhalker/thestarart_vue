<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Music, LayoutDashboard, ChevronLeft, ChevronRight, History, Settings } from 'lucide-vue-next'
import { RouterView, useRouter, useRoute } from 'vue-router'
import AdminPet from '@/components/admin/madoka/AdminPet.vue'
import RightSidebar from '@/components/admin/madoka/RightSidebar.vue'

const isCollapsed = ref(false)
const router = useRouter()
const route = useRoute()

// Configuração dos Menus
const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Músicas', path: '/admin/musics', icon: Music },
  { name: 'Logs_Sistema', path: '/admin/changelog', icon: History },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="min-h-screen flex font-mono text-ts-black overflow-hidden">
    <div class="scanline-overlay"></div>

    <aside :class="[
      'relative z-[60]   border-r-4 border-black transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    ]">
      <div class="p-4 border-b-4 border-black text-black flex items-center justify-between overflow-hidden"
        >
        <div v-if="!isCollapsed" class="flex items-center gap-2">
          <img src="https://blob.gifcities.org/gifcities/JFFM5775ELYWARHSCWKVECD4PZ6IFSBB.gif" class="h-4 pixelated" />
          <span class="font-bold uppercase tracking-tighter italic text-xs">TheStar_Admin</span>
        </div>
        <Button variant="ghost" size="icon" @click="isCollapsed = !isCollapsed"
          class="hover:bg-white/20 text-white shrink-0">
          <ChevronLeft v-if="!isCollapsed" />
          <ChevronRight v-else />
        </Button>
      </div>

      <img src="https://blob.gifcities.org/gifcities/2D3MVJ5SCCI2ZFMKTZ3MOETJ5NE7T52S.gif"
        class="w-full h-1 object-cover border-b-2 border-black pixelated" />

      <nav class="flex-1 p-2 space-y-2 mt-4 overflow-y-auto custom-scrollbar">

        <div v-for="item in menuItems" :key="item.path" :class="[
          'relative group transition-all duration-200',
          isActive(item.path) && !isCollapsed ? 'pl-8' : 'pl-0'
        ]">
          <img v-if="isActive(item.path) && !isCollapsed"
            src="https://blob.gifcities.org/gifcities/5IXUOKTOKTSGJ6RCEJKOKHOOBXC7GUOY.gif"
            class="absolute left-1 top-1/2 -translate-y-1/2 h-4 z-10 pixelated" />

          <Button variant="ghost" @click="router.push(item.path)" :class="[
            'w-full justify-start gap-3 border-2 border-black rounded-none transition-all shadow-none',
            isActive(item.path) ? 'bg-white shadow-[4px_4px_0px_0px_black] translate-x-[-2px] translate-y-[-2px]' : 'hover:bg-gray-100 border-transparent hover:border-black'
          ]">
            <component :is="item.icon" :size="20" :class="isActive(item.path) ? 'text-ts-pink' : ''" />
            <span v-if="!isCollapsed" class="font-black uppercase text-xs">{{ item.name }}</span>
          </Button>
        </div>

      </nav>

      <img src="https://blob.gifcities.org/gifcities/2D3MVJ5SCCI2ZFMKTZ3MOETJ5NE7T52S.gif"
        class="w-full h-1 object-cover border-t-2 border-black pixelated" />

      <div v-if="!isCollapsed" class="p-4 space-y-4 border-t-4 border-black bg-gray-300">
        <div class="flex justify-center gap-2 overflow-hidden">
          <img src="https://blob.gifcities.org/gifcities/2ZL6GSLIX76ROTHWO5FJPLXGA6VYHAIO.gif" alt="badges"
            class="pixelated h-8" />
          <img src="https://cyber.dabamos.de/88x31/button.gif" alt="badge" class="pixelated h-8" />
        </div>

        <div class="flex items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all">
          <img src="https://blob.gifcities.org/gifcities/JFFM5775ELYWARHSCWKVECD4PZ6IFSBB.gif" class="h-3 pixelated" />
          <span class="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Estrela_OS v4.2.0</span>
        </div>
      </div>
    </aside>

    <main class="flex-1 relative z-10 p-6 overflow-y-auto custom-scrollbar "
    style="background-image: url('https://blob.gifcities.org/gifcities/2D3MVJ5SCCI2ZFMKTZ3MOETJ5NE7T52S.gif'); background-repeat: repeat; background-size: auto;"
    >
      <div
        class="bg-white/95 border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] min-h-full relative overflow-hidden">
        <div
          class="absolute top-0 right-0 w-12 h-12 border-l-2 border-b-2 border-black/10 flex items-center justify-center">
          <Settings :size="16" class="text-black/20 animate-spin-slow" />
        </div>

        <RouterView v-slot="{ Component }">
          <transition name="pixel-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </main>

    <RightSidebar />
    <AdminPet />
  </div>
</template>

<style scoped>
/* Transição de Mudança de Página */
.pixel-fade-enter-active,
.pixel-fade-leave-active {
  transition: opacity 0.15s steps(4);
}

.pixel-fade-enter-from,
.pixel-fade-leave-to {
  opacity: 0;
}

.pixelated {
  image-rendering: pixelated;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: #808080;
}
</style>