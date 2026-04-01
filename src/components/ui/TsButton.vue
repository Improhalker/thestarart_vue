<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost'
}>()
</script>

<template>
  <button
    class="px-6 py-2 rounded-xl transition-all duration-300 ts-font-main"
    :class="[
      variant === 'primary'
        ? 'bg-[var(--primary-red)] hover:bg-[var(--primary-pink)] text-white'
        : 'border border-white/20 hover:bg-white/10 text-white'
    ]"
  >
    <slot />
  </button>
</template>