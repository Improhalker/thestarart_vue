<script setup lang="ts">
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import NavBar from '@/components/global/NavBar.vue'
</script>

<template>
  <YoutubeMusic />

  <main class="main-layout">
    <div class="content-overlay">
      <header>
        <div class="wrapper">
          <NavBar />
        </div>
      </header>

      <RouterView />
    </div>
  </main>
</template>