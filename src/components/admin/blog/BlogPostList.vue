<template>
  <div class="border-2 border-black p-4 shadow-[4px_4px_0px_black] bg-white">
    <p class="text-xs uppercase font-bold mb-4">Posts</p>

    <div v-if="pending" class="text-sm font-bold animate-pulse py-4">
      <p>Carregando posts...</p>
      <img
        width="173"
        height="120"
        src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif"
      />
    </div>

    <div v-else-if="error" class="text-sm text-red-500 font-bold py-4">
      Erro ao carregar os posts.
    </div>

    <div v-else-if="!posts || posts.length === 0" class="text-sm text-gray-500 py-4">
      Ainda sem dados. Nenhum post encontrado.
    </div>

    <div v-else class="divide-y-2 divide-black border-2 border-black">
      <div
        v-for="post in posts"
        :key="post.id"
        class="p-4 bg-white hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0px_black]"
              :class="post.visibility === 1 ? 'bg-emerald-300' : 'bg-amber-300'"
            >
              {{ post.visibility === 1 ? "Publicado" : "Rascunho" }}
            </span>

            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-200 border border-black"
            >
              {{ tag }}
            </span>
          </div>

          <h2 class="font-black text-lg uppercase leading-tight">
            {{ post.title }}
          </h2>

          <p class="text-xs text-gray-600 font-medium">
            {{ post.excerpt }}
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex gap-2">
            <button
              class="border-2 border-black px-3 py-1 bg-yellow-200 shadow-[2px_2px_0px_black]"
              @click="emit('toggle-visibility', post)"
            >
              {{ post.visibility === 1 ? "Arquivar" : "Desarquivar" }}
            </button>

            <button
              class="border-2 border-black px-3 py-1 bg-red-200 shadow-[2px_2px_0px_black]"
              @click="emit('delete-post', post.id)"
            >
              Excluir
            </button>

            <button
              class="border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_black]"
              @click="$router.push(`/admin/blog/editor/${post.id}`)"
            >
              Editar
            </button>
          </div>

          <div class="text-left md:text-right shrink-0">
            <p class="text-xs font-bold font-mono">
              Created in:
              {{ new Date(post.publish_date).toLocaleDateString("pt-BR") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/composables/posts/types";

defineProps<{
  posts: Post[];
  pending: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "toggle-visibility", post: Post): void;
  (e: "delete-post", id: string): void;
}>();
</script>
