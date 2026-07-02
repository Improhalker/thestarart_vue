<script setup lang="ts">
import changelog from '@/data/changelog.json'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import {
  Cpu,
  Gamepad2,
  GripHorizontal 
} from 'lucide-vue-next'

import { navigationLinks } from './navigation'

const currentVersion =
  changelog[0]?.version ?? '0.0.0'
</script>

<template>
  <Sheet>

    <!-- Trigger -->
    <SheetTrigger as-child>

      <button
        class="
          flex items-center justify-center

          w-10 h-10

          bg-ts-pink

          border
          border-white
          border-r-black
          border-b-black

          text-white

          active:translate-x-px
          active:translate-y-px
        "
      >
        <GripHorizontal :size="18" />
      </button>

    </SheetTrigger>

    <!-- Sheet -->
    <SheetContent
      side="right"
      class="
        w-[320px]
        p-0

        bg-ts-black
        text-white

        border-l-2
        border-ts-pink

        flex
        flex-col
      "
    >

      <!-- Window Header -->
      <SheetHeader class="p-0">

        <div
          class="
            flex items-center justify-between

            px-3 py-2

            bg-ts-pink

            text-white
            text-xs
            font-bold
            uppercase
            tracking-widest
          "
        >
          <div class="flex items-center gap-2">

            <Cpu :size="12" />

            <SheetTitle
              class="
                text-white
                text-xs
                font-bold
                tracking-widest
              "
            >
              THESTARART.EXE
            </SheetTitle>

          </div>

          <p>
            v{{ currentVersion }}
          </p>

        </div>

      </SheetHeader>

      <!-- System Info -->
      <div
        class="
          px-4 py-3

          text-[11px]

          border-b
          border-white/10

          bg-black/30
        "
      >

        <div class="flex justify-between">
          <p>USER</p>
          <p>IMPROHALKER</p>
        </div>

        <div class="flex justify-between">
          <p>STATUS</p>
          <p class="text-green-400">
            ONLINE
          </p>
        </div>

        <div class="flex justify-between">
          <p>BUILD</p>
          <p>
            {{ currentVersion }}
          </p>
        </div>

      </div>

      <!-- Navigation -->
      <nav
        class="
          flex flex-col
          gap-2

          p-3
        "
      >

        <RouterLink
          v-for="link in navigationLinks"
          :key="link.path"
          :to="link.path"
          class="
            group

            flex items-center
            gap-3

            px-3 py-3

            bg-black/40

            border
            border-white/10

            transition-all

            hover:bg-ts-pink
            hover:border-white
          "
        >

          <p
            class="
              text-ts-pink
              font-bold

              group-hover:text-white
            "
          >
            >
          </p>

          <p
            class="
              text-xs
              font-bold
              tracking-widest
            "
          >
            {{ link.name }}
          </p>

        </RouterLink>

      </nav>

      <!-- Footer -->
      <div
        class="
          mt-auto

          border-t
          border-white/10

          p-3

          text-[10px]
          uppercase

          bg-black/40

          text-white/50
        "
      >

        <div class="flex items-center gap-2">

          <Gamepad2 :size="12" />

          <p>
            DRAWING.EXE ACTIVE
          </p>

        </div>

        <div class="mt-1">
          THESTARART SYSTEM
        </div>

      </div>

    </SheetContent>

  </Sheet>
</template>