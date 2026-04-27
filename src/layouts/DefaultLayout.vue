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

  </main>
</template>