<script setup lang="ts">
import NavbarTopBar from './NavbarTopBar.vue'
import NavbarMain from './NavbarMain.vue'
import NavbarStatusBar from './NavbarStatusBar.vue'
import './Navbar.css'
</script>

<template>
    <header class="
            container
            px-0!
            bg-black
            relative
            overflow-hidden
            border-b-[3px]
            border-[var(--ui-border-dark)]
            sticky top-0 z-50
            lg:relative
        ">
        <div class="
                absolute inset-0 opacity-70
                bg-[url('/images/banner.webp')]
                bg-repeat-x bg-cover
                bg-[position:center_-100px]
                animate-banner-scroll
            "></div>

        <div class="
            absolute 
            inset-0 
            bg-gradient-to-r from-[var(--ts-primary-pink)]/50 to-[#2d0240]" />


        <div class="relative z-10">
            <NavbarTopBar />
            <NavbarMain />
            <NavbarStatusBar />
        </div>
    </header>
</template>
