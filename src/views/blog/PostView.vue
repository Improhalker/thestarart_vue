<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostsRepository } from "@/composables/posts/usePostRepository";

const route = useRoute();
const postsRepo = usePostsRepository();

const post = ref<any>(null);
const pending = ref(true);
const error = ref(false);

const fallbackImage = "https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=No+Image";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

onMounted(async () => {
  try {
    const slug = route.params.slug as string;

    const response = (await postsRepo.getBySlug)
      ? await postsRepo.getBySlug(slug)
      : await postsRepo.getById(slug);

    post.value = response.data;
  } catch (e) {
    error.value = true;
  } finally {
    pending.value = false;
  }
});
</script>
<template>
  <div class="container-style-dark max-w-xl">
    <CardWindowHeader :title="post?.title ?? 'loading.exe'" />

    <div v-if="pending" class="p-4 text-sm">
      <p>Carregando post...</p>
      <img
        width="173"
        height="120"
        src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif"
      />
    </div>

    <div v-else-if="error" class="p-4 text-sm text-red-500">
      Não foi possível carregar o post.
    </div>

    <div v-else class="p-4 space-y-6">
      <!-- Heading -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-black uppercase text-white">
          {{ post.title }}
        </h1>

        <p class="text-[11px] text-gray-400 uppercase">
          publicado em {{ formatDate(post.publish_date) }}
        </p>
      </div>

      <!-- Thumbnail -->
      <div
        v-if="post.thumbnail"
        class="w-full h-[260px] md:h-[360px] overflow-hidden border-2 border-[var(--color-ts-ui-border-dark)]"
      >
        <img :src="post.thumbnail" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <div
        class="prose prose-invert max-w-none text-gray-200 leading-relaxed"
        v-html="post.content"
      />
    </div>
  </div>
</template>

<style>
[data-youtube-video] {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

[data-youtube-video] iframe {
  width: 100% !important;
  aspect-ratio: 16 / 9;
  height: auto !important;
  display: block;
}
</style>
