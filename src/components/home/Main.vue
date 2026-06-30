<script setup lang="ts">
import { onMounted } from "vue";

import PostGrid from "../global/blog/PostGrid.vue";
import CardWindowHeader from "../global/CardWindowHeader.vue";
import About from "./About.vue";
import Thought from "./Thought.vue";
import CsGallery from "./CsGallery.vue";
import { usePosts } from "@/composables/posts/usePosts";

const { posts, pending, error, fetchPosts } = usePosts();

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Thought />

    <About />
    <div class="container-style-dark">
      <CardWindowHeader title="Blog.exe" />
      <PostGrid
        :posts="posts"
        :loading="pending"
        :error="error"
        :limit="4"
        show-view-all
      />
    </div>
    <CsGallery />
  </div>
</template>
