<script setup lang="ts">
import { ref, reactive } from "vue";
import UiSelector from "./translate/UiSelector.vue";
const isHovering = ref(false);
const hoverPosition = reactive({ x: 0, y: 0 });

</script>

<template>

  <header
    class="bg-gradient-to-r border-b-[3px] border-[var(--crimson-accent)]  fixed top-0 z-100 from-black to-red-950 w-full flex justify-between items-center p-4 text-white">
    <div class="text-xl font-bold notranslate ">TheStarArt_</div>
    <div>
      <img src="https://blob.gifcities.org/gifcities/7EOEBJ7JTFK7WPDMXYXP34OTB7ATNLRQ.gif" alt="">
    </div>
    <div class="flex gap-4 items-center">
      <UiSelector />
    </div>

  </header>


</template>
