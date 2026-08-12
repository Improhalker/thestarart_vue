<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Eye, Heart } from "lucide-vue-next";
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

const currentLikeState = computed(() =>
  post.value ? optimisticLikes.stateFor(post.value.slug) : null,
);
const liked = computed(() => currentLikeState.value?.liked ?? false);
const likesCount = computed(() => currentLikeState.value?.likesCount ?? post.value?.likes_count ?? 0);

const minimumReadingTimeMs = 5000;
let viewTimer: ReturnType<typeof setTimeout> | null = null;
let viewRequestSent = false;

const fallbackImage = "https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=No+Image";

const formatDate = (date: string | null) => {
  if (!date) return "data indisponível";

  return new Date(date).toLocaleDateString("pt-BR");
};

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
      // O contador é complementar: o conteúdo do post não deve falhar se ele não puder ser registrado.
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
  if (!post.value) return;

  optimisticLikes.toggle(post.value.slug);
};

const loadLikeState = async (slug: string) => {
  try {
    const likes = await engagement.getLikeState(slug);

    if (post.value?.slug !== slug) return;

    optimisticLikes.reconcile(slug, likes.data);
  } catch {
    // Likes são opcionais para a leitura; a página continua útil sem esse estado inicial.
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
    optimisticLikes.initialize(currentPost.slug, {
      liked: false,
      likesCount: currentPost.likes_count,
    });

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

    <div v-else-if="!post" class="p-4 text-sm text-red-500">
      Não foi possível carregar o post.
    </div>

    <div v-else class="p-4 space-y-6">
      <!-- Heading -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-black uppercase text-white">
          {{ post.title }}
        </h1>

        <p class="text-[11px] text-gray-400 uppercase">
          publicado em {{ formatDate(post.published_at) }}
        </p>

        <div class="flex items-center justify-center gap-3 text-[11px] text-gray-300 uppercase">
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
        v-html="safeContent(post.content)"
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
