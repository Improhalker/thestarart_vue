<script setup lang="ts">
import AchievementBadge from "@/components/global/AchievementBadge.vue";
import ToastNotifications from "@/components/global/ToastNotifications.vue";
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path ?? route.path" />
    </Transition>
  </RouterView>
  <AchievementBadge />
  <ToastNotifications />
</template>
