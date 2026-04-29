<script setup lang="ts">
import { computed } from 'vue'
import changelogData from '@/data/changelog.json'
import CardWindowHeader from '@/components/global/CardWindowHeader.vue'
import { Terminal, Headphones } from 'lucide-vue-next'

interface Props {
  variant?: 'default' | 'retro-pink'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'retro-pink'
})

const isPink = computed(() => props.variant === 'retro-pink')
</script>

<template>
  <div
    class="font-pixel space-y-4 p-4 relative overflow-hidden"
    :class="isPink
      ? 'bg-gradient-to-br from-[var(--ui-bg)] via-[var(--ui-bg-secondary)] to-[var(--ui-bg-tertiary)] shadow-[10px_10px_0px_rgba(0,0,0,0.4)] border-2 border-[var(--ui-border)] border-r-[var(--ui-border-dark)] border-b-[var(--ui-border-dark)]'
      : 'bg-white'">

    <!-- sparkles -->
    <img
      v-if="isPink"
      src="https://blob.gifcities.org/gifcities/RAB63QVEAB73QGUZU6DNIMIIIRIYTYLQ.gif"
      class="absolute top-2 right-2 w-10 opacity-30 pointer-events-none" />

    <CardWindowHeader title="System_Logs.txt" :icon="Headphones" />

    <div class="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
      <div class="space-y-4 relative pb-4">

        <!-- timeline line -->
        <div
          class="absolute left-[9px] top-0 bottom-0 w-[2px] hidden md:block"
          :class="isPink
            ? 'bg-[var(--ui-accent-soft)]/60'
            : 'bg-black/10'"></div>

        <!-- items -->
        <div
          v-for="(log, index) in changelogData.slice(0, 5)"
          :key="log.version"
          class="relative md:pl-8 mb-6">

          <!-- dot -->
          <div
            class="absolute left-[4px] top-1 w-3 h-3 border-2 hidden md:block z-10 transition-colors"
            :class="[
              isPink ? 'border-[var(--ui-border)]' : 'border-black',
              index === 0
                ? 'bg-[var(--ui-accent)] shadow-[0_0_8px_var(--ui-accent)]'
                : 'bg-white/60'
            ]"></div>

          <!-- card -->
          <div
            class="overflow-hidden
            border-2 border-[var(--ui-border)]
            border-r-[var(--ui-border-dark)]
            border-b-[var(--ui-border-dark)]
            bg-[var(--ui-bg)]/60 backdrop-blur-sm">

            <CardWindowHeader
              :title="`BUILD_${log.version.replace('.', '_')}`"
              :icon="Terminal">

              <template #right>
                <span class="text-[8px] md:text-[12px] font-bold mr-2 text-[var(--ui-text)]">
                  {{ log.date }}
                </span>
              </template>
            </CardWindowHeader>

            <!-- content -->
            <div
              class="p-3 text-[13px]"
              :class="isPink
                ? 'bg-[var(--ui-bg)]/70 text-[var(--ui-text)]'
                : 'bg-white text-black'">

              <ul class="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                <li
                  v-for="item in log.changes"
                  :key="item"
                  class="flex gap-2 leading-tight">

                  <span
                    class="font-black shrink-0 text-[var(--ui-accent)]">
                    >>
                  </span>

                  <span class="font-bold uppercase tracking-tighter">
                    {{ item }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- footer -->
            <div
              class="p-1 px-3 text-[8px] flex justify-between uppercase"
              :class="isPink
                ? 'bg-[var(--ui-bg)]/50 border-t border-[var(--ui-border)] text-[var(--ui-text-soft)]'
                : 'bg-gray-50 border-t border-gray-200 text-gray-400'">

              <span>Kernel_v4.2</span>

              <span class="font-bold text-[var(--ui-accent)]">
                ● checksum_ok
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div
      class="pt-2 flex items-center gap-4 opacity-60 scale-75 origin-left"
      :class="isPink ? 'saturate-150' : ''">

      <img src="https://cyber.dabamos.de/88x31/webmaster.gif" />

      <p
        class="text-[9px] font-black uppercase leading-none"
        :class="isPink
          ? 'text-[var(--ui-text-soft)]'
          : 'text-black'">

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