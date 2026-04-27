<script setup lang="ts">
import NavBar from '@/components/global/NavBar.vue'
</script>

<template>

  <main class="main-layout font-pixel">
      <header>
        <div class="wrapper">
          <NavBar />
        </div>
      </header>
      <RouterView />
    
  </main>
</template>