<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Eye, Heart } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import PostReadingSidebar from "@/components/global/blog/PostReadingSidebar.vue";
import { usePostEngagement } from "@/composables/posts/usePostEngagement";
import { useOptimisticLikes } from "@/composables/posts/useOptimisticLikes";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import type { PublicComment, PublicPost, VisitorIdentity } from "@/composables/posts/types";
import { sanitizePostHtml } from "@/utils/sanitizePostHtml";
import { applyPostSeo, trackPageView } from "@/composables/useSeo";

const route = useRoute();
const postsRepo = usePostsRepository();
const engagement = usePostEngagement();
const optimisticLikes = useOptimisticLikes();

const post = ref<PublicPost | null>(null);
const pending = ref(true);
const error = ref(false);
const comments = ref<PublicComment[]>([]);
const commentContent = ref("");
const visitorName = ref("");
const visitorEmail = ref("");
const engagementKnown = ref(false);
const showIdentityForm = ref(false);
const commentPending = ref(false);
const commentFeedback = ref("");

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

const visitorIdentity = (): VisitorIdentity | null => {
  if (!visitorName.value.trim() || !visitorEmail.value.trim()) return null;
  return { name: visitorName.value.trim(), email: visitorEmail.value.trim() };
};

const toggleLike = () => {
  if (!post.value) return;
  if (!engagementKnown.value) {
    showIdentityForm.value = true;
    return;
  }
  optimisticLikes.toggle(post.value.slug);
};

const confirmLike = () => {
  if (!post.value || !visitorIdentity()) return;
  engagementKnown.value = true;
  window.localStorage.setItem("thestarart:engagement-identified", "1");
  showIdentityForm.value = false;
  optimisticLikes.toggle(post.value.slug, visitorIdentity());
};

const loadComments = async (slug: string) => {
  try {
    comments.value = (await postsRepo.getPublicComments(slug)).data;
  } catch {
    comments.value = [];
  }
};

const submitComment = async () => {
  if (!post.value || !commentContent.value.trim() || (!engagementKnown.value && !visitorIdentity())) return;
  commentPending.value = true;
  commentFeedback.value = "";
  try {
    await engagement.prepareCsrfCookie();
    await postsRepo.createPublicComment(post.value.slug, {
      ...(visitorIdentity() ?? { name: "", email: "" }),
      content: commentContent.value.trim(),
    });
    engagementKnown.value = true;
    window.localStorage.setItem("thestarart:engagement-identified", "1");
    commentContent.value = "";
    commentFeedback.value = "ComentÃ¡rio enviado para moderaÃ§Ã£o.";
  } catch {
    commentFeedback.value = "NÃ£o foi possÃ­vel enviar o comentÃ¡rio.";
  } finally {
    commentPending.value = false;
  }
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
    engagementKnown.value = window.localStorage.getItem("thestarart:engagement-identified") === "1";
    applyPostSeo(currentPost);
    trackPageView(route.fullPath);
    optimisticLikes.initialize(currentPost.slug, { liked: false, likesCount: currentPost.likes_count });

    document.addEventListener("visibilitychange", onVisibilityChange);
    // Prepara o cookie fora da ação do usuário. Comentários e likes continuam
    // protegidos por CSRF, mas o primeiro clique não precisa aguardar este round-trip.
    void engagement.prepareCsrfCookie().catch(() => undefined);
    recordViewAfterReading();
    void loadLikeState(currentPost.slug);
    void loadComments(currentPost.slug);
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

        <section class="space-y-4 border-t border-[var(--ui-border)] pt-5" aria-labelledby="comments-title">
          <h2 id="comments-title" class="text-sm font-bold uppercase text-white">Comentários</h2>
          <form class="space-y-3" @submit.prevent="submitComment">
            <div v-if="!engagementKnown" class="grid gap-3 sm:grid-cols-2">
              <label class="text-xs text-gray-300">Nome<input v-model="visitorName" required maxlength="80" class="mt-1 w-full border border-[var(--ui-border)] bg-black/30 p-2 text-white" /></label>
              <label class="text-xs text-gray-300">E-mail<input v-model="visitorEmail" required type="email" maxlength="255" class="mt-1 w-full border border-[var(--ui-border)] bg-black/30 p-2 text-white" /></label>
            </div>
            <label class="block text-xs text-gray-300">Mensagem<textarea v-model="commentContent" required maxlength="2000" rows="4" class="mt-1 w-full border border-[var(--ui-border)] bg-black/30 p-2 text-white" /></label>
            <button type="submit" :disabled="commentPending" class="border border-[var(--ts-primary-pink)] px-3 py-2 text-xs uppercase text-white disabled:opacity-50">{{ commentPending ? "Enviando..." : "Enviar para moderação" }}</button>
            <p v-if="commentFeedback" class="text-xs text-gray-300">{{ commentFeedback }}</p>
          </form>
          <p v-if="!comments.length" class="text-xs text-gray-400">Ainda não há comentários aprovados.</p>
          <ol v-else class="space-y-3">
            <li v-for="comment in comments" :key="comment.id" class="border-l-2 border-[var(--ts-primary-pink)] pl-3 text-sm text-gray-200"><strong class="text-white">{{ comment.name }}</strong><p class="mt-1 whitespace-pre-wrap">{{ comment.content }}</p></li>
          </ol>
        </section>
      </div>
    </article>

    <PostReadingSidebar v-if="post" :post="post" :likes-count="likesCount" class="order-2" />

    <div v-if="showIdentityForm" class="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form class="w-full max-w-sm space-y-3 border-2 border-[var(--ts-primary-pink)] bg-[var(--ui-bg)] p-5" @submit.prevent="confirmLike">
        <h2 class="text-sm font-bold uppercase text-white">Identificação para curtidas</h2>
        <p class="text-xs text-gray-300">Seu e-mail não será exibido publicamente.</p>
        <label class="block text-xs text-gray-300">Nome<input v-model="visitorName" required maxlength="80" class="mt-1 w-full border border-[var(--ui-border)] bg-black/30 p-2 text-white" /></label>
        <label class="block text-xs text-gray-300">E-mail<input v-model="visitorEmail" required type="email" maxlength="255" class="mt-1 w-full border border-[var(--ui-border)] bg-black/30 p-2 text-white" /></label>
        <div class="flex gap-2"><button class="border border-[var(--ts-primary-pink)] px-3 py-2 text-xs text-white">Curtir</button><button type="button" class="px-3 py-2 text-xs text-gray-300" @click="showIdentityForm = false">Cancelar</button></div>
      </form>
    </div>
  </div>
</template>
