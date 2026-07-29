<script setup lang="ts">
import { useToast } from "@/composables/useToast";

const { notifications, dismiss } = useToast();
</script>

<template>
  <TransitionGroup
    tag="div"
    name="toast"
    class="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="pointer-events-auto flex items-start gap-3 border-2 border-[var(--ts-primary-pink)] bg-[var(--ts-primary-black)] px-3 py-2 text-xs text-pink-100 shadow-[4px_4px_0_var(--ts-retro-shadow)]"
      role="alert"
    >
      <span class="min-w-0 flex-1">{{ notification.message }}</span>
      <button
        type="button"
        class="-mt-0.5 text-pink-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Fechar aviso"
        @click="dismiss(notification.id)"
      >
        ×
      </button>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
