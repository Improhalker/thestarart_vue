<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import YoutubeMusic from './components/global/YoutubeMusic.vue';
import NavBar from './components/global/NavBar.vue';

</script>

<template>
  <header>
    

    <div class="wrapper">
     <NavBar/>
    </div>
    
  </header>
  <YoutubeMusic />
  <RouterView />
</template>
