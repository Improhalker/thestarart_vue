<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LanguageButton from './LanguageButton.vue'
import { useI18n } from "vue-i18n"
import { setLocale, type SupportedLocale } from "@/i18n"

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

function selectLang(lang: SupportedLocale) {
  setLocale(lang)

  const redirect = route.query.redirect as string
  void router.push(redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/')
}
</script>

<template>
  <div
    class="
      min-h-screen

      flex flex-col
      items-center
      justify-center

      bg-gradient-to-b
      from-ts-black
      to-ts-black-secondary

      text-white

      px-6
    "
  >
    <div
      class="
        w-full
        max-w-lg

        border-2
        border-ts-pink

        bg-black/60
        backdrop-blur-sm

        shadow-[8px_8px_0px_rgba(0,0,0,0.5)]
      "
    >
      <!-- Header -->
      <div
        class="
          flex items-center justify-between

          px-4 py-2

          bg-ts-pink

          text-white
          text-xs
          font-bold
          tracking-widest
        "
      >
        <span>{{ t("language.selectTitle") }}</span>

        <span>{{ t("language.bootMode") }}</span>
      </div>

      <!-- Content -->
      <div
        class="
          flex flex-col
          items-center

          gap-6

          p-8
        "
      >
        <div class="text-center">

          <p
            class="
              text-ts-pink
              text-xs
              tracking-[0.3em]
              uppercase
            "
          >
            {{ t("language.systemName") }}
          </p>

          <h1
            class="
              mt-2

              text-3xl
              font-black

              tracking-tight
            "
          >
            {{ t("language.heading") }}
          </h1>

          <p
            class="
              mt-2

              text-sm
              text-white/60
            "
          >
            {{ t("language.description") }}
          </p>

        </div>

        <div
          class="
            w-full

            flex flex-col

            gap-3
          "
        >
          <LanguageButton
            lang="pt-BR"
            :label="t('language.pt')"
            @select="selectLang"
          />

          <LanguageButton
            lang="en"
            :label="t('language.en')"
            @select="selectLang"
          />

          <LanguageButton
            lang="es"
            :label="t('language.es')"
            @select="selectLang"
          />
        </div>

        <div
          class="
            w-full

            border-t
            border-white/10

            pt-4

            text-[10px]
            uppercase

            text-white/50
          "
        >
          <div>{{ t("language.user") }}</div>
          <div>{{ t("language.status") }}</div>
        </div>

      </div>
    </div>
  </div>
</template>
