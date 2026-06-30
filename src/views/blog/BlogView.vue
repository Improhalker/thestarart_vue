<script setup lang="ts">
import { onMounted } from "vue";

import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import PostGrid from "@/components/global/blog/PostGrid.vue";
import { usePosts } from "@/composables/posts/usePosts";

const { posts, pending, error, fetchPosts } = usePosts();

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="container-style-dark">
    <CardWindowHeader title="Blog.exe" />

    <!-- BANNER -->
    <div class="relative overflow-hidden mb-4 h-40">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('/images/blog-banner.jpg')"
      />

      <div class="absolute inset-0 bg-black/60" />

      <div class="relative z-10 h-full flex flex-col justify-center p-4">
        <h1 class="text-xl font-black text-white uppercase">Bem-vindo à Área do Blog</h1>

        <p class="text-xs text-gray-300 mt-1">
          pensamentos · desenhos · dev notes · atualizações de sistema
        </p>
      </div>
    </div>

    <PostGrid :posts="posts" :loading="pending" :error="error" />
  </div>
</template>
