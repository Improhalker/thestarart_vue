<script setup lang="ts">
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import PostGrid from "@/components/global/blog/PostGrid.vue";
import { usePublicPosts } from "@/composables/posts/usePublicPosts";
import UnderConstruction from "@/components/global/UnderConstruction.vue";

const route = useRoute();
const router = useRouter();
const pageSize = 8;
const { posts, pagination, pending, error, fetchPublicPosts } = usePublicPosts();

const pageFromRoute = (): number => {
  const page = Number(route.query.page);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const loadPage = async () => {
  const requestedPage = pageFromRoute();
  const response = await fetchPublicPosts({ page: requestedPage, perPage: pageSize });

  if (response && requestedPage > response.meta.last_page && response.meta.last_page > 0) {
    await router.replace({
      query: { ...route.query, page: String(response.meta.last_page) },
    });
  }
};

const changePage = async (page: number) => {
  if (!pagination.value || pending.value || page === pagination.value.current_page) return;

  await router.push({
    query: {
      ...route.query,
      page: page === 1 ? undefined : String(page),
    },
  });
};

watch(() => route.query.page, () => {
  void loadPage();
}, { immediate: true });
</script>

<template>
  <div>
    <div class="container-style-dark mb-4 lg:mb-8">
      <CardWindowHeader title="Blog.exe" />

      <!-- BANNER -->
      <div class="relative overflow-hidden mb-4 h-40">
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="background-image: url('/images/blog-banner.jpg')"
        />

        <div class="absolute inset-0 bg-black/60" />

        <div class="relative z-10 h-full flex flex-col justify-center p-4">
          <h1 class="text-xl font-black text-white uppercase">
            Bem-vindo à Área do Blog
          </h1>

          <p class="text-xs text-gray-300 mt-1">
            pensamentos · desenhos · dev notes · atualizações de sistema
          </p>
        </div>
      </div>

      <PostGrid
        :posts="posts"
        :loading="pending"
        :error="error"
        :pagination="pagination"
        @change-page="changePage"
      />
    </div>
    <UnderConstruction />
  </div>
</template>
