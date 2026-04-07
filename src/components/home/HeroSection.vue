<script setup lang="ts">
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import ChangelogView from '@/views/admin/ChangelogView.vue';
import AdminPet from '../admin/madoka/AdminPet.vue';
import LeftSide from './LeftSide.vue';
import Main from './Main.vue';

</script>

<template>
  <section class=" min-h-screen bg-[#13011a] text-pink-100">
    <div class="place-self-center h-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 lg:gap-0  p-6">
      <LeftSide />
      <div class="rounded-xl 00 p-2 ">
        <Main />
      </div>
      <div class="rounded-xl md:space-y-6 p-2 lg:max-w-[450px]">
        <YoutubeMusic />
        <ChangelogView variant="retro-pink" />
      </div>
    </div>
    <div>
      <AdminPet />
    </div>
  </section>
</template>