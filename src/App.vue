<script setup lang="ts">
import { onMounted } from 'vue'
import AchievementBadge from '@/components/global/AchievementBadge.vue'
import { useTranslate } from '@/composables/useTranslate'

const { initGoogleTranslate } = useTranslate()

onMounted(() => {
  initGoogleTranslate()
})
</script>

<template>
  <div id="google_translate_element" style="display: none;"></div>

  <RouterView />
  <AchievementBadge />
</template>