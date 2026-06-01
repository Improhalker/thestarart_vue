<script setup lang="ts">
import NavbarMobile from './NavbarMobile.vue'
import { navigationLinks } from './navigation'
</script>

<template>
  <div class="h-20 px-6 flex items-center justify-between">
    <div>
      <h1 class="font-black text-3xl tracking-tight text-white">
        TheStarArt_
      </h1>
      <span class="text-xs text-white/60 uppercase">
        Anime Artist • Developer • Gamer
      </span>

    </div>
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex gap-2">
      <RouterLink
        v-for="link in navigationLinks"
        :key="link.path"
        :to="link.path"
        class="
          px-4 py-2
          text-xs
          font-bold
          tracking-widest
          border
          border-white/10
          bg-black/40
          backdrop-blur-sm
          hover:bg-red-600
          hover:border-red-400
          transition
        "
      >
        {{ link.name }}
      </RouterLink>

    </nav>
    <!-- Mobile Navigation -->
    <div class="lg:hidden">
      <NavbarMobile />
    </div>

  </div>
</template>