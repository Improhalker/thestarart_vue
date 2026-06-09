<script setup lang="ts">
import NavBar from '@/components/global/Navbar/NavBar.vue'
import OldNavBar from '@/components/global/OldNavBar.vue'
import StartupPopup from '@/components/global/StartupPopup.vue'
import ChangelogView from '@/views/ChangelogView.vue'
import LeftSide from '@/components/home/LeftSide.vue'
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import Chat from '@/components/globalchat/Chat.vue'
import AdminPet from '@/components/admin/madoka/AdminPet.vue'
</script>

<template>
  <main class="main-layout font-pixel">
    <section class="relative home-gradiant min-h-screen bg-repeat bg-fixed text-pink-100"
      style="background-image: url('/images/bluebox.gif');">
      <section class="px-0 pb-4 lg:pb-16 pt-0 lg:pt-24">
        <NavBar />

        <div class="container relative z-10 place-self-center h-full py-4
         grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 lg:gap-5
         items-start">

          <div class="lg:sticky top-2 ">
            <LeftSide />
          </div>

          <div class="rounded-xl">
            <RouterView />
          </div>

          <div class="lg:sticky top-24 self-start overflow-x-hidden">
            <YoutubeMusic />
            <Chat />
            <ChangelogView variant="retro-pink" :limit="5" :fullHeight="false" />
          </div>

        </div>
      </section>

      <div class="relative z-20">
        <AdminPet />
      </div>
      <div class="pb-[100px] md:pb-0">
      <footer class="
        container 
        relative
        overflow-hidden
        border-t-[3px]
        border-[var(--ts-primary-pink)]
        bg-black
        px-0
      ">
        <div class="
          absolute inset-0 opacity-40
          bg-[url('/images/banner.webp')]
          bg-repeat-x bg-cover
          bg-[position:center_-100px]
        "></div>

        <div class="
          absolute inset-0
          bg-gradient-to-r
          from-black/80
          via-[#48054a]/40
          to-black/80
        "></div>

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