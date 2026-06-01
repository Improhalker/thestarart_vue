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
      <div class="fixed inset-0 bg-[#13011a]/20 pointer-events-none z-0"></div>
      <section class="container pt-24">
        <NavBar />

        <div class="relative z-10 place-self-center h-full py-4
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