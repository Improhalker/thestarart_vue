<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
</script>

<template>
    <main class="">
      <HeroSection />
    </main>
</template>

<style scoped>
body {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/main-wallpaper.jpg');
  background-color: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>