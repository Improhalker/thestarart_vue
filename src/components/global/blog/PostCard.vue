<script setup lang="ts">
import type { Post } from "@/composables/posts/types";

defineProps<{
  post: Post;
}>();
</script>

<template>
  <div
    class="relative group cursor-pointer overflow-hidden border-2 border-[var(--color-ts-ui-border-dark)] min-h-[220px]"
  >
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      :style="{
        backgroundImage: `url(${post.thumbnail ?? '/images/banner.webp'})`,
      }"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-purple-900/70" />

    <!-- Content -->
    <div class="relative z-10 p-4 h-full flex flex-col justify-between text-white">
      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          class="text-[10px] px-2 py-[2px] border border-white/40 rounded-full uppercase font-bold bg-white/10"
        >
          {{ post.tags?.[0] ?? "SYSTEM" }}
        </span>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-black uppercase leading-tight">
          {{ post.title }}
        </h3>

        <p class="text-[12px] text-gray-200 line-clamp-3">
          {{ post.excerpt }}
        </p>

        <span class="text-[10px] text-gray-300">
          {{ new Date(post.publish_date).toLocaleDateString("pt-BR") }}
        </span>
      </div>

      <div class="pt-2 text-center">
        <router-link
          :to="`/post/${post.slug}`"
          class="inline-block transition-transform hover:scale-105 active:scale-95"
        >
          <img
            src="/images/ui/read_nowlight2.png"
            alt="Read Now"
            class="w-32 inline-block"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>
