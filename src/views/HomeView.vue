<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import Main from "@/components/home/Main.vue";
import { setSeo } from "@/composables/useSeo";

const { locale, t } = useI18n();

watch(
  locale,
  () => {
    setSeo({
      title: t("seo.homeTitle"),
      description: t("seo.homeDescription"),
      canonicalPath: "/",
    });
  },
  { immediate: true },
);
</script>

<template>
  <Main />
</template>
