<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/global/NewNavbar/Navbar.vue";
import StartupPopup from "@/components/global/StartupPopup.vue";
import ChangelogView from "@/views/ChangelogView.vue";
import LeftSide from "@/components/home/LeftSide.vue";
import YoutubeMusic from "@/components/global/YoutubeMusic.vue";
import Chat from "@/components/globalchat/Chat.vue";
import AdminPet from "@/components/admin/madoka/AdminPet.vue";

const route = useRoute();
const isPostReader = computed(() => route.name === "post.show");
</script>

<template>
  <main class="main-layout font-pixel">
    <section
      class="relative home-gradiant min-h-screen bg-repeat bg-fixed text-pink-100"
      style="background-image: url('/images/bluebox.gif')"
    >
      <section class="px-0 pb-4 lg:pb-16 pt-0 lg:pt-24">
        <div
          class="container flex py-4 mx-auto lg:mb-8 justify-center items-center gap-4 lg:py-1 px-2 text-[11px] bg-purple-200/30 text-white"
        >
          <a
            href="https://www.instagram.com/thestarart_/"
            target="_blank"
            class="flex items-center gap-1 hover:text-white transition"
          >
            <img src="/images/social/instagram.png" class="w-4 h-4 pixelated" />
            <p class="hidden md:flex">Instagram</p>
          </a>

          <a
            href="https://youtube.com/@improhalkeryg254"
            target="_blank"
            class="flex items-center gap-1 hover:text-white transition"
          >
            <img src="/images/social/youtube.png" class="w-5 h-4 pixelated" />
            <p class="hidden md:flex">Arte e Filosofia</p>
          </a>

          <a
            href="https://www.youtube.com/@estrela_cs_yg"
            target="_blank"
            class="flex items-center gap-1 hover:text-white transition"
          >
            <img src="/images/social/youtube.png" class="w-5 h-4 pixelated" />
            <p class="hidden md:flex">Jogos</p>
          </a>

          <a
            href="https://www.tiktok.com/@improhalker"
            target="_blank"
            class="flex items-center gap-1 hover:text-white transition"
          >
            <img src="/images/social/tiktok.png" class="w-4 h-4 pixelated" />
            <p class="hidden md:flex">TikTok</p>
          </a>

          <a
            href="https://github.com/Improhalker"
            target="_blank"
            class="flex items-center gap-1 hover:text-white transition"
          >
            <img src="/images/social/github.png" class="w-4 h-4 pixelated" />
            <p class="hidden md:flex">GitHub</p>
          </a>

          <a
            href="mailto:contato@contact.thestarart@gmail.com"
            class="flex items-center gap-1 text-black hover:text-white transition"
          >
            <img src="/images/social/mail.png" class="w-5 h-4 pixelated" />

            <p class="hidden md:flex text-white">Email</p>
          </a>
        </div>
        <Navbar />

        <div
          class="container relative z-10 place-self-center h-full py-4 grid grid-cols-1 gap-2 lg:gap-5 items-start"
          :class="isPostReader ? 'max-w-6xl' : 'md:grid-cols-[1fr_2fr_1fr]'"
        >
          <div v-if="!isPostReader" class="lg:sticky top-2 order-2 md:order-1">
            <LeftSide />
          </div>

          <div :class="isPostReader ? 'order-1 min-w-0' : 'rounded-xl order-1 md:order-2'">
            <RouterView v-slot="{ Component, route }">
              <Transition name="page" mode="out-in">
                <component :is="Component" :key="route.fullPath" />
              </Transition>
            </RouterView>
          </div>

          <div
            v-if="!isPostReader"
            class="lg:sticky top-2 space-y-4 self-start overflow-x-hidden order-3 md:order-3"
          >
            <YoutubeMusic />
            <Chat class="pb-4" />
            <ChangelogView variant="retro-pink" :limit="5" :fullHeight="false" />
          </div>
        </div>
      </section>

      <div class="relative z-20">
        <AdminPet />
      </div>
      <div class="pb-[180px] md:pb-0">
        <footer
          class="w-full relative overflow-hidden border-t-[3px] border-[var(--ts-primary-pink)] bg-black px-0"
        >
          <div
            class="absolute inset-0 opacity-40 bg-[url('/images/banner.webp')] bg-repeat-x bg-cover bg-[position:center_-100px]"
          ></div>

          <div
            class="absolute inset-0 bg-gradient-to-r from-black/80 via-[#48054a]/40 to-black/80"
          ></div>

          <div class="py-3">
            <p class="text-center text-sm text-gray-300">
              © 2026 TheStarArt_. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </section>

    <StartupPopup />
  </main>
</template>
