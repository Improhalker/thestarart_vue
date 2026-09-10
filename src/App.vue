<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AchievementBadge from "@/components/global/AchievementBadge.vue";
import ToastNotifications from "@/components/global/ToastNotifications.vue";
import { applyRouteSeo } from "@/composables/useSeo";

const route = useRoute();
const { locale } = useI18n();

watch(locale, () => {
  // A página de post usa o idioma editorial do próprio conteúdo para SEO.
  if (route.name !== "post.show") applyRouteSeo(route);
});
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
