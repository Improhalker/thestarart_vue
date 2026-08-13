<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Eye, Heart } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import PostReadingSidebar from "@/components/global/blog/PostReadingSidebar.vue";
import { usePostEngagement } from "@/composables/posts/usePostEngagement";
import { useOptimisticLikes } from "@/composables/posts/useOptimisticLikes";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import type { PublicPost } from "@/composables/posts/types";
import { sanitizePostHtml } from "@/utils/sanitizePostHtml";
import { applyPostSeo, trackPageView } from "@/composables/useSeo";

const route = useRoute();
const postsRepo = usePostsRepository();
const engagement = usePostEngagement();
const optimisticLikes = useOptimisticLikes();

const post = ref<PublicPost | null>(null);
const pending = ref(true);
const error = ref(false);

const currentLikeState = computed(() => post.value ? optimisticLikes.stateFor(post.value.slug) : null);
const liked = computed(() => currentLikeState.value?.liked ?? false);
const likesCount = computed(() => currentLikeState.value?.likesCount ?? post.value?.likes_count ?? 0);

const minimumReadingTimeMs = 5000;
let viewTimer: ReturnType<typeof setTimeout> | null = null;
let viewRequestSent = false;

const formatDate = (date: string | null) => date
  ? new Date(date).toLocaleDateString("pt-BR")
  : "data indisponível";

const safeContent = (content: string) => sanitizePostHtml(content);

const clearViewTimer = () => {
  if (viewTimer !== null) {
    clearTimeout(viewTimer);
    viewTimer = null;
  }
};

const recordViewAfterReading = () => {
  if (!post.value || viewRequestSent || document.visibilityState !== "visible") return;

  clearViewTimer();
  viewTimer = setTimeout(async () => {
    if (!post.value || document.visibilityState !== "visible") return;

    viewRequestSent = true;

    try {
      const response = await engagement.recordView(post.value.slug);
      post.value.views_count = response.data.views_count;
    } catch {
      viewRequestSent = false;
    }
  }, minimumReadingTimeMs);
};

const onVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    recordViewAfterReading();
    return;
  }

  clearViewTimer();
};

const toggleLike = () => {
  if (post.value) optimisticLikes.toggle(post.value.slug);
};

const loadLikeState = async (slug: string) => {
  try {
    const likes = await engagement.getLikeState(slug);
    if (post.value?.slug === slug) optimisticLikes.reconcile(slug, likes.data);
  } catch {
    // Likes são complementares: o post permanece legível sem este estado inicial.
  }
};

onMounted(async () => {
  try {
    const slug = route.params.slug as string;
    const response = await postsRepo.getPublicPost(slug);
    const currentPost = response.data;

    post.value = currentPost;
    applyPostSeo(currentPost);
    trackPageView(route.fullPath);
    optimisticLikes.initialize(currentPost.slug, { liked: false, likesCount: currentPost.likes_count });

    document.addEventListener("visibilitychange", onVisibilityChange);
    recordViewAfterReading();
    void loadLikeState(currentPost.slug);
  } catch {
    error.value = true;
  } finally {
    pending.value = false;
  }
});

onBeforeUnmount(() => {
  clearViewTimer();
  document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
    <article class="container-style-dark min-w-0 shadow-[8px_8px_0px_rgba(0,0,0,0.7)]">
      <CardWindowHeader title="POST_READER.EXE" />

      <div v-if="pending" class="p-4 text-sm">
        <p>Carregando arquivo...</p>
        <img width="173" height="120" src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif" alt="Carregando post" />
      </div>

      <div v-else-if="error || !post" class="p-4 text-sm text-red-500">
        Não foi possível carregar o post.
      </div>

      <div v-else class="space-y-6 p-4 sm:p-6">
        <header class="space-y-2 border-b border-[var(--ui-border)] pb-5 text-center">
          <p class="text-[10px] uppercase tracking-[0.22em] text-[var(--ts-primary-pink)]">arquivo pessoal carregado</p>
          <h1 class="text-2xl font-black uppercase text-white sm:text-3xl">{{ post.title }}</h1>
          <p class="text-[11px] uppercase text-gray-400">publicado em {{ formatDate(post.published_at) }}</p>

          <div class="flex items-center justify-center gap-3 text-[11px] uppercase text-gray-300">
            <span class="inline-flex items-center gap-1" :aria-label="`${post.views_count} visualizações`">
              <Eye :size="14" aria-hidden="true" />
              {{ post.views_count }} visualizações
            </span>
            <button
              type="button"
              class="inline-flex items-center gap-1 border border-[var(--color-ts-ui-border)] px-2 py-1 transition-colors hover:bg-white/10"
              :class="liked ? 'text-[var(--color-ts-primary-pink)]' : ''"
              :aria-pressed="liked"
              @click="toggleLike"
            >
              <Heart :size="14" :fill="liked ? 'currentColor' : 'none'" aria-hidden="true" />
              {{ likesCount }} {{ liked ? 'curtido' : 'curtidas' }}
            </button>
          </div>
        </header>

        <div v-if="post.thumbnail" class="h-[220px] w-full overflow-hidden border-2 border-[var(--color-ts-ui-border-dark)] sm:h-[300px] md:h-[360px]">
          <img :src="post.thumbnail" :alt="`Capa de ${post.title}`" class="h-full w-full object-cover" />
        </div>

        <div
          class="post-rich-content prose prose-invert max-w-none text-gray-200 leading-relaxed [&_p]:mb-4 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--ts-primary-pink)] [&_blockquote]:bg-ts-retro-gray [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote_p:first-child]:mt-0 [&_blockquote_p:last-child]:mb-0 [&_div:has(>iframe)]:my-4 [&_div:has(>iframe)]:flex [&_div:has(>iframe)]:justify-center [&_iframe]:block [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:max-w-[500px] [&_iframe]:aspect-video"
          v-html="safeContent(post.content)"
        />
      </div>
    </article>

    <PostReadingSidebar v-if="post" :post="post" :likes-count="likesCount" class="order-2" />
  </div>
</template>
