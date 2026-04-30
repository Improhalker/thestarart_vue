<script setup lang="ts">
import NavBar from '@/components/global/NavBar.vue'
import StartupPopup from '@/components/global/StartupPopup.vue'
import ChangelogView from '@/views/ChangelogView.vue'
// Layout fixo
import LeftSide from '@/components/home/LeftSide.vue'
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import Chat from '@/components/globalchat/Chat.vue'
import AdminPet from '@/components/admin/madoka/AdminPet.vue'
</script>

<template>
  <main class="main-layout font-pixel">

    <header>
      <div class="wrapper">
        <NavBar />
      </div>
    </header>

    <section class="relative test min-h-screen bg-repeat bg-fixed text-pink-100 mt-12 md:mt-16 lg:mt-20"
      style="background-image: url('/images/bluebox.gif');">
      <div class="fixed inset-0 bg-[#13011a]/20 pointer-events-none z-0"></div>

      <div class="max-w-[1600px] relative z-10 place-self-center h-full 
         grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 lg:gap-0 p-6
         items-start">

        <div class="sticky top-24 self-start">
          <LeftSide />
        </div>

        <div class="rounded-xl p-2">
          <RouterView />
        </div>

        <div class="sticky top-24 self-start rounded-xl md:space-y-6 p-2 mdx:max-w-[300px] lgx:max-w-[450px]">
          <YoutubeMusic />
          <Chat />
          <ChangelogView variant="retro-pink" :limit="5" :fullHeight="false" />
        </div>

      </div>

      <div class="relative z-20">
        <AdminPet />
      </div>
    </section>

    <StartupPopup />

    <!-- FOOTER -->
    <footer class="bg-gradient-to-r border-t-[3px] border-[var(--crimson-accent)] from-black to-red-950">
      <div class="text-center text-sm text-white py-2">
        &copy; 2026 TheStarArt_. All rights reserved.
      </div>
    </footer>

  </main>
</template>