<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-black uppercase">Blog Admin</h1>

      <button
        class="border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        @click="goCreate"
      >
        + Novo Post
      </button>
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
      <BlogPostList :posts="posts" :pending="pending" :error="error" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import BlogPostList from "@/components/admin/blog/BlogPostList.vue";
import { usePosts } from "@/composables/posts/usePosts";
import { useRouter } from "vue-router";
const {
  posts,
  error,
  pending,
  fetchPosts,
  totalPosts,
  draftPosts,
  publishedPosts,
} = usePosts();

onMounted(async () => {
  await fetchPosts();
});

const router = useRouter();

const goCreate = () => {
  router.push("/admin/blog/editor");
};
</script>
