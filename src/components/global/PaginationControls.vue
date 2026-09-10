<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  currentPage: number;
  lastPage: number;
  total: number;
  pending?: boolean;
  label: string;
}>();

const emit = defineEmits<{ (event: "change", page: number): void }>();
const { t } = useI18n();

const pages = computed(() => {
  const start = Math.max(1, Math.min(props.currentPage - 2, props.lastPage - 4));
  const end = Math.min(props.lastPage, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const change = (page: number) => {
  if (props.pending || page < 1 || page > props.lastPage || page === props.currentPage) return;
  emit("change", page);
};
</script>

<template>
  <nav
    v-if="lastPage > 1"
    class="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-ts-ui-border)] pt-4 text-xs"
    :aria-label="label"
  >
    <button type="button" class="retro-btn px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50" :disabled="pending || currentPage <= 1" @click="change(currentPage - 1)">
      {{ t("common.previous") }}
    </button>
    <button
      v-for="page in pages"
      :key="page"
      type="button"
      class="min-w-8 border-2 px-2 py-1 font-bold disabled:cursor-not-allowed"
      :class="page === currentPage ? 'border-white bg-white/10 text-white' : 'border-[var(--color-ts-ui-border)] hover:bg-white/10'"
      :aria-current="page === currentPage ? 'page' : undefined"
      :disabled="pending"
      @click="change(page)"
    >
      {{ page }}
    </button>
    <button type="button" class="retro-btn px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50" :disabled="pending || currentPage >= lastPage" @click="change(currentPage + 1)">
      {{ t("common.next") }}
    </button>
    <p class="basis-full text-center text-[11px] text-gray-400">{{ t("common.pageOf", { current: currentPage, total: lastPage, count: total }) }}</p>
  </nav>
</template>
