<script setup lang="ts">
import { useAchievements } from "@/composables/useAchievements";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import NavbarMobile from "./NavbarMobile.vue";
const { unlock } = useAchievements();
import { navigationLinks } from "./navigation";
</script>

<template>
  <nav
    class="container hidden lg:block bg-[var(--ts-secondary-black)] border-[2px] border-[var(--ts-primary-pink)] mb-6 shadow-[4px_4px_0px_var(--ts-primary-black)]"
  >
    <CardWindowHeader title="THESTARART.EXE" />

    <div class="flex flex-wrap items-center justify-between p-1 bg-black/60">
      <ul class="flex items-center gap-1">
        <li v-for="link in navigationLinks" :key="link.name">
          <RouterLink
            :to="link.path"
            class="block px-3 py-1 font-pixel text-[12px] text-[var(--ts-retro-gray)] uppercase border-2 border-transparent hover:border-[var(--ts-primary-pink)] hover:bg-[var(--ts-primary-pink)]/20 hover:text-white transition-none"
            active-class="bg-[var(--ts-primary-pink)]/40 border-[var(--ts-primary-pink)] text-white shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5)]"
          >
            [{{ link.name }}]
          </RouterLink>
        </li>
      </ul>

      <div
        class="flex items-center gap-4 px-2 border-l-2 border-[var(--ts-primary-pink)]/30"
      >
        <div
          class="flex items-center gap-1.5 font-pixel text-[10px] uppercase text-[var(--onyx-accent)]"
        >
          <span
            class="w-2 h-2 bg-[var(--onyx-accent)] border border-black shadow-[0_0_5px_var(--onyx-accent)] animate-pulse"
          ></span>
          SYS.ONLINE
        </div>

        <UiSelector />
      </div>
    </div>
  </nav>
  <div class="lg:hidden">
    <NavbarMobile />
  </div>
</template>
