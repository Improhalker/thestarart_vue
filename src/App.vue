<script setup lang="ts">
import { RouterView } from 'vue-router'
import YoutubeMusic from './components/global/YoutubeMusic.vue';
import NavBar from './components/global/NavBar.vue';

</script>

<template>
  
    <header>


      <div class="wrapper">
        <NavBar />
      </div>

    </header>
    <YoutubeMusic />
    <RouterView />

</template>

<style>
body {
  background-image: url('images/mainwallpaper2.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>