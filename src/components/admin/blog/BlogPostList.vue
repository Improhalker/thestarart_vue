<script setup lang="ts">
import { Eye, Heart, Pencil, Trash2 } from "lucide-vue-next";
import type { PaginationMeta, Post } from "@/composables/posts/types";

defineProps<{
  posts: Post[];
  pending: boolean;
  error: string | null;
  pagination: PaginationMeta;
}>();

const emit = defineEmits<{
  (e: "toggle-visibility", post: Post): void;
  (e: "delete-post", id: string): void;
  (e: "page-change", page: number): void;
}>();

const statusLabel: Record<Post["status"], string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

const statusClass: Record<Post["status"], string> = {
  draft: "bg-amber-300",
  scheduled: "bg-blue-300",
  published: "bg-emerald-300",
  archived: "bg-gray-300",
};

const languageLabel: Record<Post["lang"], string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Sem data definida";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCount = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
</script>

<template>
  <section class="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_black] sm:p-4" :aria-busy="pending">
    <div class="mb-4 flex flex-col gap-1 border-b-2 border-black pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-sm font-black uppercase">Posts</h2>
        <p class="text-xs text-black/60">{{ pagination.total }} resultado(s) encontrado(s)</p>
      </div>
      <p v-if="posts.length" class="text-xs font-bold text-black/65">
        Exibindo {{ posts.length }} por página
      </p>
    </div>

    <div v-if="pending" class="py-6 text-sm font-bold" role="status">
      <p>Carregando posts...</p>
      <img
        width="173"
        height="120"
        src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif"
        alt=""
      />
    </div>

    <div v-else-if="error" class="border-2 border-red-800 bg-red-100 p-3 text-sm font-bold text-red-900" role="alert">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="border-2 border-dashed border-black/50 p-6 text-center text-sm text-black/65">
      Ainda não há posts para estes filtros.
    </div>

    <div v-else class="divide-y-2 divide-black border-2 border-black">
      <article
        v-for="post in posts"
        :key="post.id"
        class="grid gap-4 bg-white p-3 transition-colors hover:bg-gray-50 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-4"
      >
        <div class="flex min-w-0 gap-3">
          <img
            v-if="post.thumbnail"
            :src="post.thumbnail"
            alt=""
            class="h-16 w-16 shrink-0 border-2 border-black object-cover sm:h-20 sm:w-24"
          />

          <div class="min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="border border-black px-2 py-0.5 text-[10px] font-black uppercase shadow-[1px_1px_0px_black]"
                :class="statusClass[post.status]"
              >
                {{ statusLabel[post.status] }}
              </span>
              <span class="border border-black bg-white px-1.5 py-0.5 text-[10px] font-black">{{ languageLabel[post.lang] }}</span>
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag"
                class="border border-black bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold"
              >
                #{{ tag }}
              </span>
              <span v-if="post.tags.length > 3" class="text-[10px] font-bold text-black/60">+{{ post.tags.length - 3 }}</span>
            </div>

            <h3 class="break-words text-base font-black uppercase leading-tight sm:text-lg">{{ post.title }}</h3>
            <p v-if="post.excerpt" class="line-clamp-2 text-xs leading-5 text-black/70 sm:text-sm">{{ post.excerpt }}</p>

            <div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-black/70">
              <span class="inline-flex items-center gap-1"><Eye :size="14" aria-hidden="true" /> {{ formatCount(post.views_count) }} visualizações</span>
              <span class="inline-flex items-center gap-1"><Heart :size="14" aria-hidden="true" /> {{ formatCount(post.likes_count) }} curtidas</span>
            </div>

            <p class="text-[11px] font-bold text-black/60">
              {{ post.deleted_at ? "Removido em" : post.status === "scheduled" ? "Agendado para" : "Publicação" }}:
              {{ formatDate(post.deleted_at || post.published_at) }}
            </p>
          </div>
        </div>

        <div v-if="!post.deleted_at" class="grid grid-cols-2 gap-2 self-end sm:flex sm:flex-col sm:items-stretch sm:justify-end">
          <button
            v-if="post.status === 'published'"
            class="min-h-10 border-2 border-black bg-amber-200 px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_black] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="pending"
            @click="emit('toggle-visibility', post)"
          >
            Arquivar
          </button>

          <button
            class="order-last col-span-2 inline-flex min-h-10 items-center justify-center gap-1 border-2 border-black bg-white px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_black] sm:order-none sm:col-span-1"
            :disabled="pending"
            @click="$router.push(`/admin/blog/editor/${post.id}`)"
          >
            <Pencil :size="14" aria-hidden="true" />
            Editar
          </button>

          <button
            class="min-h-10 border-2 border-black bg-red-200 px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_black] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="pending"
            @click="emit('delete-post', post.id)"
          >
            <Trash2 :size="14" class="mx-auto" aria-label="Excluir post" />
          </button>
        </div>
      </article>
    </div>

    <nav v-if="posts.length && pagination.last_page > 1" class="mt-4 flex flex-col gap-2 border-t-2 border-black pt-3 text-xs font-bold sm:flex-row sm:items-center sm:justify-between" aria-label="Paginação de posts">
      <span>Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
      <div class="grid grid-cols-2 gap-2 sm:flex">
        <button
          class="min-h-10 border-2 border-black bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="pending || pagination.current_page <= 1"
          @click="emit('page-change', pagination.current_page - 1)"
        >
          Anterior
        </button>
        <button
          class="min-h-10 border-2 border-black bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="pending || pagination.current_page >= pagination.last_page"
          @click="emit('page-change', pagination.current_page + 1)"
        >
          Próxima
        </button>
      </div>
    </nav>
  </section>
</template>
