<script setup lang="ts">
import { computed } from "vue";
import type { Post } from "@/composables/posts/types";
import PostCard from "./PostCard.vue";

const props = withDefaults(
  defineProps<{
    posts: Post[];
    loading?: boolean;
    error?: string | null;
    limit?: number;
    showViewAll?: boolean;
  }>(),
  {
    loading: false,
    error: null,
    showViewAll: false,
  }
);

const visiblePosts = computed(() => {
  if (!props.limit) return props.posts;

  return props.posts.slice(0, props.limit);
});
</script>

<template>
  <div class="p-4 space-y-4">
    <div v-if="loading">
      <p>Carregando posts...</p>

      <img
        width="139"
        height="115"
        src="https://blob.gifcities.org/gifcities/NNDAMTBIN4ZDLQSQMSMSLE3YFC7K646F.gif"
        alt="Carregando"
      />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="border-2 border-red-500 bg-red-50 p-4 text-sm">
      <p class="font-black uppercase text-red-700">
        ⚠️ Não foi possível carregar os posts.
      </p>

      <p class="mt-2 text-gray-700">
        Tente atualizar a página em alguns instantes. Se o problema continuar, entre em
        contato pelo Instagram ou por e-mail.
      </p>

      <div class="mt-3 text-gray-700 flex flex-wrap gap-3 text-xs font-bold">
        <a
          href="https://www.instagram.com/thestarart_/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:opacity-80"
        >
          📷 @thestarart_
        </a>

        <a href="mailto:thestarart@gmail.com" class="underline hover:opacity-80">
          ✉️ thestarart@gmail.com
        </a>
      </div>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PostCard v-for="post in visiblePosts" :key="post.id" :post="post" />
    </div>

    <!-- Empty -->
    <div
      v-if="!loading && !error && visiblePosts.length === 0"
      class="text-center text-sm"
    >
      Nenhum post encontrado.
    </div>

    <!-- View All -->
    <div v-if="showViewAll && visiblePosts.length" class="pt-2 text-center">
      <router-link
        to="/blog"
        class="inline-block transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src="/images/ui/load_morebutton.png"
          alt="Ver todos os posts"
          class="w-32 inline-block"
        />
      </router-link>
    </div>
  </div>
</template>
