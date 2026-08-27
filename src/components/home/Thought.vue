<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import CardWindowHeader from "../global/CardWindowHeader.vue";

const { t } = useI18n();

const terminalSections = computed(() => [
  {
    title: t("home.thoughtWhoamiTitle"),
    content: t("home.thoughtWhoamiContent"),
  },
  {
    title: t("home.thoughtInterestsTitle"),
    items: [
      t("home.thoughtInterestGaming"),
      t("home.thoughtInterestDevelopment"),
      t("home.thoughtInterestDrawing"),
      t("home.thoughtInterestAnime"),
      t("home.thoughtInterestMusic"),
      t("home.thoughtGithub"),
    ],
  },
  {
    title: t("home.thoughtLanguagesTitle"),
    content: t("home.thoughtLanguagesContent"),
  },
  {
    title: t("home.thoughtWellTitle"),
    content: t("home.thoughtWellContent"),
  },
]);
</script>

<template>
  <div
    class="bg-[#03010e] shadow-[10px_10px_0px_rgba(0,0,0,0.5)] border-2 border-[var(--ts-primary-pink)] border-r-[#2a0221] border-b-[#2a0221] max-h-[400px] overflow-y-auto"
  >
    <CardWindowHeader title="Thought_Terminal.exe" />

    <div class="p-4 space-y-4 text-sm">
      <div v-for="section in terminalSections" :key="section.title">
        <p class="text-pink-600">{{ section.title }}</p>

        <template v-if="section.content">
          <div
            class="text-pink-100 pl-3 border-l border-pink-900"
            v-html="section.content"
          />
        </template>

        <template v-else-if="section.items">
          <ul class="text-pink-100 space-y-2">
            <li
              v-for="(item, index) in section.items"
              :key="index"
              class="flex items-center gap-2"
            >
              <img
                width="14"
                height="14"
                src="https://blob.gifcities.org/gifcities/7PUF3WHRKMSLRBHDQ5ZTDCLAAHTYTEBJ.gif"
              />

              <span v-html="item"></span>
            </li>
          </ul>
        </template>
      </div>

      <div class="text-pink-500 animate-pulse text-xs">{{ t("home.thoughtAwaitingInput") }}</div>
    </div>
  </div>
</template>
