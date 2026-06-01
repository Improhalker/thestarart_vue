<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
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
        <span>LANGUAGE_SELECT.EXE</span>

        <span>BOOT MODE</span>
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
            TheStarArt System
          </p>

          <h1
            class="
              mt-2

              text-3xl
              font-black

              tracking-tight
            "
          >
            Select Language
          </h1>

          <p
            class="
              mt-2

              text-sm
              text-white/60
            "
          >
            Choose your preferred system language
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
            lang="pt"
            label="Português 🇧🇷"
            @select="selectLang"
          />

          <LanguageButton
            lang="en"
            label="English 🇺🇸"
            @select="selectLang"
          />

          <LanguageButton
            lang="es"
            label="Español 🇪🇸"
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
          <div>USER: GUEST</div>
          <div>STATUS: WAITING FOR LANGUAGE SELECTION</div>
        </div>

      </div>
    </div>
  </div>
</template>