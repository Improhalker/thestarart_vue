<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { postImageFallback } from "@/utils/postImage";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ src?: string | null; alt: string; priority?: boolean }>(), { priority: false });
const failed = ref(false);
const fallbackFailed = ref(false);
const source = computed(() => !failed.value && props.src ? props.src : postImageFallback);
watch(() => props.src, () => { failed.value = false; fallbackFailed.value = false; });
const onError = () => {
  if (source.value === postImageFallback) fallbackFailed.value = true;
  else failed.value = true;
};
</script>

<template>
  <img v-if="!fallbackFailed" v-bind="$attrs" :src="source" :alt="alt"
    :loading="priority ? 'eager' : 'lazy'" :fetchpriority="priority ? 'high' : 'auto'" decoding="async" @error="onError" />
  <span v-else v-bind="$attrs" :role="alt ? 'img' : undefined" :aria-label="alt || undefined" :aria-hidden="!alt || undefined" />
</template>
