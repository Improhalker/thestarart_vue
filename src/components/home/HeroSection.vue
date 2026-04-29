<script setup lang="ts">
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import ChangelogView from '@/views/admin/ChangelogView.vue';
import AdminPet from '../admin/madoka/AdminPet.vue';
import LeftSide from './LeftSide.vue';
import Chat from '../globalchat/Chat.vue';
import Main from './Main.vue';

</script>
<template>
  <section class=" relative min-h-screen bg-repeat bg-fixed text-pink-100"
    style="background-image: url('/images/bluebox.gif');">
    <div class="fixed inset-0 bg-[#13011a]/20 pointer-events-none z-0"></div>
    <div class="max-w-[1600px] relative z-10 place-self-center h-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 lg:gap-0 p-6">
      <LeftSide />

      <div class="rounded-xl p-2">
        <Main />
      </div>

      <div class="rounded-xl md:space-y-6 p-2 mdx:max-w-[300px] lgx:max-w-[450px]">
        <YoutubeMusic />
        <Chat />
        <ChangelogView variant="retro-pink" />
      </div>
    </div>
    <div class="relative z-20">
      <AdminPet />
    </div>
  </section>
</template>