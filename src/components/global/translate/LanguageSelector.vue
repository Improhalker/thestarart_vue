<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTranslate } from '@/composables/useTranslate'
import LanguageButton from './LanguageButton.vue'

const router = useRouter()
const route = useRoute()
function selectLang(lang: string) {
  localStorage.setItem('lang', lang)

  const redirect = route.query.redirect as string
  router.push(redirect || '/')
}
</script>

<template>
  <div class="screen">
    
    <!-- GIF / personagem -->
 

    <h1 class="title">
      Choose your main language
    </h1>

    <div class="buttons">
      <LanguageButton lang="pt" label="Português 🇧🇷" @select="selectLang" />
      <LanguageButton lang="en" label="English 🇺🇸" @select="selectLang" />
      <LanguageButton lang="es" label="Español 🇪🇸" @select="selectLang" />
    </div>

  </div>
</template>

<style scoped>
.screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #232226;
  color: white;
  text-align: center;
  gap: 20px;
}

.anime {
  width: 180px;
  image-rendering: pixelated;
}

.title {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.buttons {
  display: flex;
  gap: 12px;
}
</style>