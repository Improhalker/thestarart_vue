<script setup lang="ts">
import { computed } from "vue";
import type { PaginationMeta, PublicPostSummary } from "@/composables/posts/types";
import PostCard from "./PostCard.vue";

const props = withDefaults(
  defineProps<{
    posts: PublicPostSummary[];
    loading?: boolean;
    error?: string | null;
    limit?: number;
    showViewAll?: boolean;
    pagination?: PaginationMeta | null;
  }>(),
  {
    loading: false,
    error: null,
    showViewAll: false,
    pagination: null,
  }
);

const emit = defineEmits<{
  (event: "change-page", page: number): void;
}>();

const visiblePosts = computed(() => {
  if (!props.limit) return props.posts;

  return props.posts.slice(0, props.limit);
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];

  const { current_page: currentPage, last_page: lastPage } = props.pagination;
  const start = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  const end = Math.min(lastPage, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});
</script>

<template>
  <div class="p-4 space-y-4">
    <div v-if="loading && visiblePosts.length === 0">
      <p>Carregando posts...</p>

      <img
        width="139"
        height="115"
        src="https://blob.gifcities.org/gifcities/NNDAMTBIN4ZDLQSQMSMSLE3YFC7K646F.gif"
        alt="Carregando"
      />
    </div>

    <!-- Error -->
    <div v-else-if="error && visiblePosts.length === 0" class="border-2 border-red-500 bg-red-50 p-4 text-sm">
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

    <nav
      v-if="pagination && pagination.last_page > 1"
      class="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-ts-ui-border)] pt-4 text-xs"
      aria-label="Paginação dos posts"
    >
      <button
        type="button"
        class="retro-btn px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="loading || pagination.current_page <= 1"
        @click="emit('change-page', pagination.current_page - 1)"
      >
        Anterior
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="min-w-8 border-2 px-2 py-1 font-bold disabled:cursor-not-allowed"
        :class="page === pagination.current_page
          ? 'border-white bg-white/10 text-white'
          : 'border-[var(--color-ts-ui-border)] hover:bg-white/10'"
        :aria-current="page === pagination.current_page ? 'page' : undefined"
        :disabled="loading"
        @click="emit('change-page', page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="retro-btn px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="loading || pagination.current_page >= pagination.last_page"
        @click="emit('change-page', pagination.current_page + 1)"
      >
        Próxima
      </button>

      <p class="basis-full text-center text-[11px] text-gray-400">
        Página {{ pagination.current_page }} de {{ pagination.last_page }} · {{ pagination.total }} posts
      </p>
    </nav>

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
