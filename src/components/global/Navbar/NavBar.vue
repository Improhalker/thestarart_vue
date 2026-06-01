<script setup lang="ts">
import NavbarTopBar from './NavbarTopBar.vue'
import NavbarMain from './NavbarMain.vue'
import NavbarStatusBar from './NavbarStatusBar.vue'
import './Navbar.css'
</script>

<template>
    <header class="bg-black relative overflow-hidden border-b-[3px] border-[var(--ui-border-dark)]">
        <div class="
    absolute
    inset-0
    opacity-70
    bg-[url('/images/banner.webp')]
    bg-repeat-x
    bg-cover
    bg-[position:center_-100px]
    animate-banner-scroll
  "></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
        <div class="relative z-10">
            <NavbarTopBar />
            <NavbarMain />
            <NavbarStatusBar />
        </div>
    </header>
</template>
