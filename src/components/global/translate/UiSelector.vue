<template>
  <div>
    <select v-model="selectedLanguage" class="bg-red-700 border border-gray-300 rounded px-2 py-1 text-sm" aria-label="Selecionar idioma">
      <option value="pt-BR">{{ t("language.selectorPt") }}</option>
      <option value="en">{{ t("language.selectorEn") }}</option>
      <option value="es">{{ t("language.selectorEs") }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { setLocale, type SupportedLocale } from "@/i18n";

const { locale, t } = useI18n();

const selectedLanguage = computed({
  get: () => locale.value as SupportedLocale,
  set: (value: SupportedLocale) => setLocale(value),
});
</script>
