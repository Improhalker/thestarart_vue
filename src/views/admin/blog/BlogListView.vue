<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Eye, FileText, Heart, Plus } from "lucide-vue-next";
import BlogPostList from "@/components/admin/blog/BlogPostList.vue";
import { usePosts } from "@/composables/posts/usePosts";
import { useRouter } from "vue-router";

const {
  posts,
  error,
  pending,
  fetchAdminPosts,
  totalPosts,
  publishedPosts,
  totalViews,
  totalLikes,
  pagination,
  toggleVisibility,
  deletePost,
} = usePosts();

const router = useRouter();
const statusFilter = ref<"" | "draft" | "scheduled" | "published" | "archived">("");
const trashedFilter = ref<"without" | "with" | "only">("without");
const langFilter = ref<"" | "pt" | "en" | "es">("");
const pageDescription = computed(() => `Página ${pagination.value.current_page} de ${pagination.value.last_page}`);

const loadPosts = (page = 1) => fetchAdminPosts({
  status: statusFilter.value || undefined,
  trashed: trashedFilter.value,
  lang: langFilter.value || undefined,
  page,
});

const goCreate = () => router.push("/admin/blog/editor");

onMounted(() => loadPosts());
</script>

<template>
  <div class="space-y-4 sm:space-y-5">
    <header class="flex flex-col gap-3 border-b-2 border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.18em] text-ts-pink">Content_Control.exe</p>
        <h1 class="text-2xl font-black uppercase sm:text-3xl">Blog Admin</h1>
        <p class="mt-1 text-xs text-black/65">Gerencie seus posts, publicação e desempenho.</p>
      </div>

      <button
        class="flex min-h-11 w-full items-center justify-center gap-2 border-2 border-black bg-white px-4 py-2 font-bold shadow-[3px_3px_0px_black] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] sm:w-auto"
        @click="goCreate"
      >
        <Plus :size="16" aria-hidden="true" />
        Novo post
      </button>
    </header>

    <section class="grid gap-3 border-2 border-black bg-ts-retro-gray p-3 shadow-[3px_3px_0px_black] sm:grid-cols-3 sm:p-4" aria-label="Filtros de posts">
      <label class="grid gap-1 text-xs font-bold uppercase">
        Status
        <select v-model="statusFilter" class="min-h-10 border-2 border-black bg-white px-2 normal-case" @change="loadPosts()">
          <option value="">Todos</option>
          <option value="draft">Rascunhos</option>
          <option value="scheduled">Agendados</option>
          <option value="published">Publicados</option>
          <option value="archived">Arquivados</option>
        </select>
      </label>

      <label class="grid gap-1 text-xs font-bold uppercase">
        Idioma
        <select v-model="langFilter" class="min-h-10 border-2 border-black bg-white px-2 normal-case" @change="loadPosts()">
          <option value="">Todos os idiomas</option>
          <option value="pt">Português</option>
          <option value="en">Inglês</option>
          <option value="es">Espanhol</option>
        </select>
      </label>

      <label class="grid gap-1 text-xs font-bold uppercase">
        Posts removidos
        <select v-model="trashedFilter" class="min-h-10 border-2 border-black bg-white px-2 normal-case" @change="loadPosts()">
          <option value="without">Ocultar</option>
          <option value="with">Incluir</option>
          <option value="only">Somente removidos</option>
        </select>
      </label>
    </section>

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Resumo dos posts">
      <div class="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_black] sm:p-4">
        <div class="flex items-start justify-between gap-2">
          <p class="text-[10px] font-black uppercase">Posts encontrados</p>
          <FileText :size="16" aria-hidden="true" />
        </div>
        <p class="mt-2 text-2xl font-black sm:text-3xl">{{ totalPosts }}</p>
        <p class="mt-1 text-[10px] text-black/60">{{ pageDescription }}</p>
      </div>

      <div class="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_black] sm:p-4">
        <p class="text-[10px] font-black uppercase">Publicados</p>
        <p class="mt-2 text-2xl font-black sm:text-3xl">{{ publishedPosts }}</p>
        <p class="mt-1 text-[10px] text-black/60">Nesta página</p>
      </div>

      <div class="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_black] sm:p-4">
        <div class="flex items-start justify-between gap-2">
          <p class="text-[10px] font-black uppercase">Visualizações</p>
          <Eye :size="16" aria-hidden="true" />
        </div>
        <p class="mt-2 text-2xl font-black sm:text-3xl">{{ totalViews.toLocaleString("pt-BR") }}</p>
        <p class="mt-1 text-[10px] text-black/60">Posts exibidos</p>
      </div>

      <div class="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_black] sm:p-4">
        <div class="flex items-start justify-between gap-2">
          <p class="text-[10px] font-black uppercase">Curtidas</p>
          <Heart :size="16" aria-hidden="true" />
        </div>
        <p class="mt-2 text-2xl font-black sm:text-3xl">{{ totalLikes.toLocaleString("pt-BR") }}</p>
        <p class="mt-1 text-[10px] text-black/60">Posts exibidos</p>
      </div>
    </section>

    <BlogPostList
      :posts="posts"
      :pending="pending"
      :error="error"
      :pagination="pagination"
      @toggle-visibility="toggleVisibility"
      @delete-post="deletePost"
      @page-change="loadPosts"
    />
  </div>
</template>
