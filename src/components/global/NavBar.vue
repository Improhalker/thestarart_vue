<script setup lang="ts">
import { ref, reactive } from "vue";
import UiSelector from "./translate/UiSelector.vue";
const isHovering = ref(false);
const hoverPosition = reactive({ x: 0, y: 0 });

</script>

<template>

  <header class="bg-purple-950 w-full flex justify-between items-center p-4 text-white relative">
    <div class="text-xl font-bold notranslate ">TheStarArt_</div>
<div>
  <img src="https://blob.gifcities.org/gifcities/7EOEBJ7JTFK7WPDMXYXP34OTB7ATNLRQ.gif" alt="">
</div>
   <div class="flex gap-4 items-center">
      <UiSelector />
    </div>

  </header>
 

</template>
