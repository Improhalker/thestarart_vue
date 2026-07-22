<template>
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-black uppercase">Blog Admin</h1>

      <button
        class="border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        @click="goCreate"
      >
        + Novo Post
      </button>
    </div>

    <div class="flex flex-wrap gap-2 border-2 border-black bg-white p-3 text-sm">
      <label class="flex items-center gap-2">Status
        <select v-model="statusFilter" class="border border-black p-1" @change="loadPosts">
          <option value="">Todos</option>
          <option value="draft">Rascunhos</option>
          <option value="scheduled">Agendados</option>
          <option value="published">Publicados</option>
          <option value="archived">Arquivados</option>
        </select>
      </label>
      <label class="flex items-center gap-2">Removidos
        <select v-model="trashedFilter" class="border border-black p-1" @change="loadPosts">
          <option value="without">Ocultar</option>
          <option value="with">Incluir</option>
          <option value="only">Somente removidos</option>
        </select>
      </label>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Posts totais</p>
        <p class="text-3xl font-black">{{ totalPosts }}</p>
      </div>

      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Publicados</p>
        <p class="text-3xl font-black">{{ publishedPosts }}</p>
      </div>

      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Rascunhos</p>
        <p class="text-3xl font-black">{{ draftPosts }}</p>
      </div>
    </div>

    <section>
      <BlogPostList
        :posts="posts"
        :pending="pending"
        :error="error"
        @toggle-visibility="toggleVisibility"
        @delete-post="deletePost"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BlogPostList from "@/components/admin/blog/BlogPostList.vue";
import { usePosts } from "@/composables/posts/usePosts";
import { useRouter } from "vue-router";
const {
  posts,
  error,
  pending,
  fetchAdminPosts,
  totalPosts,
  draftPosts,
  toggleVisibility,
  publishedPosts,
  deletePost,
} = usePosts();

const statusFilter = ref<"" | "draft" | "scheduled" | "published" | "archived">("");
const trashedFilter = ref<"without" | "with" | "only">("without");
const loadPosts = () => fetchAdminPosts({
  status: statusFilter.value || undefined,
  trashed: trashedFilter.value,
});

onMounted(loadPosts);

const router = useRouter();

const goCreate = () => {
  router.push("/admin/blog/editor");
};
</script>
