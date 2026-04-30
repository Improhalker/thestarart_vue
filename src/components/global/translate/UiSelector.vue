<template>
  <div>
    <select
      :key="selectedLanguage"
      v-model="selectedLanguage"
      @change="handleChange"
      class="bg-red-700 border border-gray-300 rounded px-2 py-1 text-sm"
    >
      <option value="pt">🇧🇷 PT</option>
      <option value="en">🇺🇸 EN</option>
      <option value="es">🇪🇸 ES</option>
    </select>

    <div id="google_translate_element" class="hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useTranslate } from "@/composables/useTranslate"

const { applyLang, initGoogleTranslate } = useTranslate()

const selectedLanguage = ref("pt")
const lastLang = ref("pt")

onMounted(() => {
  initGoogleTranslate()

  const savedLang = localStorage.getItem("lang") || "pt"

  selectedLanguage.value = savedLang
  lastLang.value = savedLang

  if (savedLang !== "pt") {
    setTimeout(() => {
      applyLang(savedLang)
    }, 1000)
  }
})

const handleChange = () => {
  const lang = selectedLanguage.value

  // evita chamada duplicada
  if (lang === lastLang.value) return

  lastLang.value = lang

  localStorage.setItem("lang", lang)
  applyLang(lang)
}
</script>