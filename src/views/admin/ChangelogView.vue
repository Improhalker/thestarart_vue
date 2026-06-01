<script setup lang="ts">
import { computed } from 'vue'
import changelogData from '@/data/changelog.json'
import CardWindowHeader from '@/components/global/CardWindowHeader.vue'
import { Terminal, Headphones } from 'lucide-vue-next'

interface Props {
  variant?: 'default' | 'retro-pink' | 'crimson'
  limit?: number | null
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'retro-pink',
  limit: 5,
  fullHeight: false
})


const logs = computed(() => {
  return props.limit ? changelogData.slice(0, props.limit) : changelogData
})

const isCrimson = computed(() => props.variant === 'crimson')
const isPink = computed(() => props.variant === 'retro-pink')
</script>

<template>
  <div class="font-pixel space-y-4 relative overflow-hidden"
    :class="[
      isPink && 'bg-gradient-to-br from-[var(--ui-bg)] via-[var(--ui-bg-secondary)] to-[var(--ui-bg-tertiary)] border-2 border-[var(--ui-border)] border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)] shadow-[10px_10px_0px_rgba(0,0,0,0.4)]',

      isCrimson && 'bg-gradient-to-r from-[var(--crimson-bg)] via-[var(--crimson-secondary)] to-[var(--crimson-tertiary)] border-2 border-[var(--crimson-border)] border-r-[var(--crimson-border-dark)] border-b-[var(--crimson-border-dark)] shadow-[0_0_20px_rgba(255,0,0,0.15)]',

      !isPink && !isCrimson && 'bg-white'
    ]"
  >

    <CardWindowHeader title="System_Logs.txt" :icon="Headphones" />

    <div
      :class="[
        'overflow-auto pr-1 custom-scrollbar',
        props.fullHeight ? 'h-full' : 'h-[400px] resize-y'
      ]"
    >
      <div class="space-y-4 relative pb-4">
        <div
          class="absolute left-[9px] top-0 bottom-0 w-[2px] hidden md:block"
          :class="
            isPink
              ? 'bg-[var(--ui-accent-soft)]/60'
              : isCrimson
                ? 'bg-red-900/60'
                : 'bg-black/10'
          "
        ></div>
        <div
          v-for="(log, index) in logs"
          :key="log.version"
          class="relative md:pl-5 mb-6"
        >
          <div
            class="absolute left-[4px] top-1 w-3 h-3 border-2 hidden md:block z-10 transition-colors"
            :class="[
              isPink && 'border-[var(--ui-border)]',
              isCrimson && 'border-[var(--crimson-border)]',

              index === 0
                ? isCrimson
                  ? 'bg-[var(--crimson-accent)] shadow-[0_0_10px_red]'
                  : 'bg-[var(--ui-accent)] shadow-[0_0_8px_var(--ui-accent)]'
                : 'bg-white/60'
            ]"
          ></div>
          <div
            class="overflow-hidden border-2 backdrop-blur-sm"
            :class="[
              isPink && 'border-[var(--ui-border)] border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)] bg-[var(--ui-bg)]/60',

              isCrimson && 'border-[var(--crimson-border)] border-r-[var(--crimson-border-dark)] border-b-[var(--crimson-border-dark)] bg-[var(--crimson-bg)]/70'
            ]"
          >
            <CardWindowHeader
              :title="`BUILD_${log.version.replace('.', '_')}`"
              :icon="Terminal"
            >
              <template #right>
                <span class="text-[8px] md:text-[10px] font-bold mr-2 text-white">
                  {{ log.date }}
                </span>
              </template>
            </CardWindowHeader>
            <div
              class="p-3 text-[13px]"
              :class="
                isPink
                  ? 'bg-[var(--ui-bg)]/70 text-[var(--ui-text)]'
                  : isCrimson
                    ? 'bg-black/40 text-[var(--crimson-text)]'
                    : 'bg-white text-black'
              "
            >
              <ul class="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                <li
                  v-for="item in log.changes"
                  :key="item"
                  class="flex gap-2 leading-tight"
                >
                  <span class="font-black shrink-0 text-[var(--ui-accent)]">
                    >>
                  </span>

                  <span class="font-bold uppercase tracking-tighter">
                    {{ item }}
                  </span>
                </li>
              </ul>
            </div>
            <div
              class="p-1 px-3 text-[8px] flex justify-between uppercase"
              :class="
                isPink
                  ? 'bg-[var(--ui-bg)]/50 border-t border-[var(--ui-border)] text-[var(--ui-text-soft)]'
                  : isCrimson
                    ? 'bg-black/50 border-t border-[var(--crimson-border)] text-red-300'
                    : 'bg-gray-50 border-t border-gray-200 text-gray-400'
              "
            >
              <span>Kernel_v4.2</span>

              <span class="font-bold text-[var(--ui-accent)]">
                ● {{ log.status }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div
      class="pt-2 flex items-center gap-4 opacity-60 scale-75 origin-left"
      :class="isPink ? 'saturate-150' : ''"
    >
      <img src="https://blinkies.cafe/b/display/0178-mikuwink2.gif" />

      <p
        class="text-[9px] font-black uppercase leading-none"
        :class="
          isPink
            ? 'text-[var(--ui-text-soft)]'
            : isCrimson
              ? 'text-red-300'
              : 'text-black'
        "
      >
        SCROLL_FOR_HISTORY.
      </p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--ui-bg-secondary);
  border-left: 1px solid var(--ui-border);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--ui-accent);
  border: 1px solid black;
}
</style>