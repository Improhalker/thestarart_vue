<template>
  <div class="flex flex-col gap-4 p-2">
    <ExplorerNavBar />
    <Slider />
    <Coupon />
    <VisualSuffer />
    <SystemResource />
  </div>
</template>

<script setup lang="ts">
import ExplorerNavBar from "@/components/global/ExplorerNavBar.vue";
import Coupon from "../global/neomaker/Coupon.vue";
import Slider from "../drawing/Slider.vue";
import VisualSuffer from "../global/VisualSuffer.vue";
import SystemResource from "../global/SystemResource.vue";


</script>