<script setup lang="ts">
import YoutubeMusic from '@/components/global/YoutubeMusic.vue'
import ChangelogView from '@/views/admin/ChangelogView.vue';
import AdminPet from '../admin/madoka/AdminPet.vue';
</script>

<template>
  <section class="w-full min-h-screen bg-blue-700">
    <div class="h-full grid grid-cols-[1fr_2fr_1fr] gap-6 p-6">
      <div class="rounded-xl bg-blue-800 p-6">
        <!-- left column -->
      </div>
      <div class="rounded-xl bg-blue-900 p-6">
        <!-- center main content -->
      </div>
      <div class="rounded-xl space-y-6 p-6">
        <YoutubeMusic />
        <ChangelogView variant="retro-pink" />
      </div>
    </div>
<div>
      <AdminPet />
</div>
  </section>
</template>