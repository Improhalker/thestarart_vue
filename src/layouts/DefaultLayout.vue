<script setup lang="ts">
import NavBar from '@/components/global/NavBar.vue'
import StartupPopup from '@/components/global/StartupPopup.vue';
</script>

<template>

  <main class="main-layout font-pixel">
      <header>
        <div class="wrapper">
          <NavBar />
        </div>
      </header>
      <RouterView />
        <StartupPopup />
        <footer class="bg-gradient-to-r border-t-[3px] border-[var(--crimson-accent)] from-black to-red-950 ">
          <div class=" text-center text-sm text-white py-2">
            &copy; 2026 TheStarArt_. All rights reserved.
          </div>
        </footer>

  </main>
</template>