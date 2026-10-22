<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";
import { Eye, Heart } from "lucide-vue-next";
import TiptapEditor from "@/components/admin/blog/editor/TiptapEditor.vue";
import PostImage from "@/components/global/blog/PostImage.vue";
import { ApiError } from "@/composables/api/useApi";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import type { Post } from "@/composables/posts/types";
import { normalizePostSlug } from "@/utils/postSlug";
import { sanitizePostHtml } from "@/utils/sanitizePostHtml";
import { useI18n } from "vue-i18n";
import { handlePostContentImageError, validatePostImage } from "@/utils/postImage";

type PostStatus = Post["status"];

const route = useRoute();
const postsRepo = usePostsRepository();
const { t } = useI18n();
const postId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => Boolean(postId.value));
const statuses: Array<{ value: PostStatus; label: string }> = [
  { value: "draft", label: "Rascunho" },
  { value: "scheduled", label: "Agendado" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];

const tagInput = ref("");
const isSubmitting = ref(false);
const isLoading = ref(false);
const editorKey = ref(0);
const successMessage = ref("");
const errorMessage = ref("");
const slugManuallyEdited = ref(false);
const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);
const thumbnailInput = ref<HTMLInputElement | null>(null);
const savedFingerprint = ref("");
const fieldErrors = ref<Record<string, string[]>>({});
const engagement = ref({ views: 0, likes: 0 });
const isUploadingContent = ref(false);
const loadFailed = ref(false);
let applyingPost = false;
let disposed = false;
let loadGeneration = 0;
let successTimer: ReturnType<typeof setTimeout> | undefined;

const localDateTime = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: null as string | null,
  tags: [] as string[],
  published_at: "",
  status: "draft" as PostStatus,
  lang: "pt",
});

const safePreview = computed(() => sanitizePostHtml(form.content));
const wordCount = computed(() => {
  const text = new DOMParser().parseFromString(safePreview.value, "text/html").body.textContent || "";
  return text.trim() ? text.trim().split(/\s+/).length : 0;
});
const readingMinutes = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)));
const fingerprint = computed(() => JSON.stringify({ ...form, pendingThumbnail: thumbnailFile.value
  ? [thumbnailFile.value.name, thumbnailFile.value.size, thumbnailFile.value.lastModified] : null }));
const hasUnsavedChanges = computed(() => fingerprint.value !== savedFingerprint.value);
const currentThumbnail = computed(() => thumbnailPreview.value || form.thumbnail);
const tagErrors = computed(() => Object.entries(fieldErrors.value)
  .filter(([field]) => field === "tags" || field.startsWith("tags.")).flatMap(([, messages]) => messages));

watch(
  () => form.title,
  (title) => {
    if (!applyingPost && !slugManuallyEdited.value) form.slug = normalizePostSlug(title);
  },
  { immediate: true },
);

watch(
  () => form.status,
  (status) => {
    if (applyingPost) return;
    if (["draft", "archived"].includes(status)) {
      form.published_at = "";
    } else if (!form.published_at) {
      form.published_at = localDateTime();
    }
  },
  { immediate: true },
);

const toLocalDateTime = (value: string | null) => (value ? localDateTime(new Date(value)) : "");

const setSavedFingerprint = async () => {
  await nextTick();
  savedFingerprint.value = fingerprint.value;
};

const applySavedPost = async (post: Post) => {
  applyingPost = true;
  clearThumbnailPreview();
  thumbnailFile.value = null;
  if (thumbnailInput.value) thumbnailInput.value.value = "";
  Object.assign(form, {
    title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content || "",
    thumbnail: post.thumbnail, tags: [...(post.tags ?? [])],
    published_at: toLocalDateTime(post.published_at), status: post.status, lang: post.lang,
  });
  engagement.value = { views: post.views_count, likes: post.likes_count };
  slugManuallyEdited.value = true;
  await nextTick();
  applyingPost = false;
  await setSavedFingerprint();
};

const loadPost = async () => {
  const generation = ++loadGeneration;
  loadFailed.value = false;
  errorMessage.value = "";
  successMessage.value = "";
  fieldErrors.value = {};
  if (!isEditing.value) {
    isLoading.value = false;
    await resetForm();
    await setSavedFingerprint();
    return;
  }

  isLoading.value = true;

  try {
    const { data: post } = await postsRepo.getAdminPost(postId.value!);
    if (disposed || generation !== loadGeneration) return;
    await applySavedPost(post);
    editorKey.value++;
    await setSavedFingerprint();
  } catch (cause) {
    if (disposed || generation !== loadGeneration) return;
    loadFailed.value = true;
    errorMessage.value = cause instanceof ApiError && cause.status === 403
      ? "Acesso negado: você precisa de permissão administrativa e ser o autor deste post para editá-lo."
      : "Não foi possível carregar o post.";
  } finally {
    if (generation === loadGeneration) isLoading.value = false;
  }
};

onMounted(loadPost);
watch(postId, () => { void loadPost(); });

const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase();
  if (!tag || form.tags.includes(tag)) return;

  form.tags.push(tag);
  tagInput.value = "";
};

const removeTag = (index: number) => form.tags.splice(index, 1);

const updateSlug = (event: Event) => {
  slugManuallyEdited.value = true;
  form.slug = normalizePostSlug((event.target as HTMLInputElement).value);
};

const clearThumbnailPreview = () => {
  if (thumbnailPreview.value) URL.revokeObjectURL(thumbnailPreview.value);
  thumbnailPreview.value = null;
};

const cancelThumbnailSelection = () => {
  clearThumbnailPreview();
  thumbnailFile.value = null;
  if (thumbnailInput.value) thumbnailInput.value.value = "";
  delete fieldErrors.value.thumbnail;
};

const handleThumbnailUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const validationError = validatePostImage(file, "thumbnail");
  if (validationError) {
    fieldErrors.value.thumbnail = [t(validationError)];
    input.value = "";
    return;
  }
  delete fieldErrors.value.thumbnail;

  clearThumbnailPreview();
  thumbnailFile.value = file;
  thumbnailPreview.value = URL.createObjectURL(file);
};

const resetForm = async () => {
  cancelThumbnailSelection();
  form.title = "";
  form.slug = "";
  form.excerpt = "";
  form.content = "";
  form.thumbnail = null;
  form.tags = [];
  form.published_at = "";
  form.status = "draft";
  form.lang = "pt";
  tagInput.value = "";
  thumbnailFile.value = null;
  slugManuallyEdited.value = false;
  editorKey.value++;
  await setSavedFingerprint();
};

const submit = async () => {
  if (isSubmitting.value || isLoading.value || loadFailed.value || isUploadingContent.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  fieldErrors.value = {};

  try {
    const payload = {
      title: form.title,
      slug: form.slug,
      slug_manually_edited: slugManuallyEdited.value,
      excerpt: form.excerpt,
      content: form.content,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      status: form.status,
      lang: form.lang,
      tags: form.tags,
      thumbnail: thumbnailFile.value,
    };

    if (isEditing.value) {
      const { data: post } = await postsRepo.update(postId.value!, payload);
      if (disposed) return;
      await applySavedPost(post);
      successMessage.value = "Post atualizado com sucesso!";
    } else {
      await postsRepo.create(payload);
      if (disposed) return;
      successMessage.value = "Post criado com sucesso!";
      await resetForm();
    }

    if (successTimer) clearTimeout(successTimer);
    successTimer = setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error) {
    if (disposed) return;
    if (error instanceof ApiError && error.status === 422) {
      const payload = error.payload as { errors?: Record<string, string[]> };
      fieldErrors.value = payload.errors || {};
      errorMessage.value = "Revise os campos destacados.";
    } else {
      errorMessage.value = error instanceof ApiError ? error.message : "Não foi possível salvar o post.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const canLeaveEditor = () => {
  if (isSubmitting.value) return false;
  if (isLoading.value || loadFailed.value) return true;
  if (!hasUnsavedChanges.value && !isUploadingContent.value) return true;
  return window.confirm("Há alterações não salvas. Deseja sair mesmo assim?");
};
onBeforeRouteLeave(canLeaveEditor);
onBeforeRouteUpdate((to, from) => to.params.id === from.params.id || canLeaveEditor());

const beforeUnload = (event: BeforeUnloadEvent) => {
  if ((!isLoading.value && !loadFailed.value && hasUnsavedChanges.value) || isSubmitting.value || isUploadingContent.value) {
    event.preventDefault();
    event.returnValue = "";
  }
};
onMounted(() => window.addEventListener("beforeunload", beforeUnload));
onBeforeUnmount(() => {
  disposed = true;
  loadGeneration++;
  clearThumbnailPreview();
  if (successTimer) clearTimeout(successTimer);
  window.removeEventListener("beforeunload", beforeUnload);
});
</script>

<template>
  <div class="space-y-5 sm:space-y-6">
    <div class="flex flex-col gap-3 border-b-2 border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.18em] text-ts-pink">Post_Editor.exe</p>
        <h1 class="text-2xl font-black uppercase sm:text-3xl">{{ isEditing ? "Editar Post" : "Criar Post" }}</h1>
      </div>
      <div class="flex flex-wrap items-center gap-2 sm:justify-end">
      <p class="text-xs font-bold" :class="hasUnsavedChanges ? 'text-amber-700' : 'text-emerald-700'">
        {{ hasUnsavedChanges ? "Alterações não salvas" : "Tudo salvo" }}
      </p>
        <div v-if="isEditing" class="flex items-center gap-2 text-[11px] font-bold">
          <span class="inline-flex items-center gap-1 border border-black bg-white px-2 py-1"><Eye :size="13" /> {{ engagement.views.toLocaleString("pt-BR") }}</span>
          <span class="inline-flex items-center gap-1 border border-black bg-white px-2 py-1"><Heart :size="13" /> {{ engagement.likes.toLocaleString("pt-BR") }}</span>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="space-y-2">
      <p>Carregando post...</p>
      <img width="173" height="120" src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif" alt="Carregando" />
    </div>

    <div v-else-if="loadFailed" role="alert" class="space-y-3 border-2 border-red-800 bg-red-100 p-3 text-sm text-red-900">
      <p>{{ errorMessage }}</p>
      <button type="button" class="border-2 border-black px-3 py-2 font-bold" @click="loadPost">Tentar novamente</button>
    </div>
    <fieldset v-else class="contents" :disabled="isSubmitting">
      <div class="space-y-1">
        <label for="post-title" class="text-sm font-bold">Título</label>
        <input id="post-title" v-model="form.title" placeholder="Título" class="border p-2 w-full" />
        <p v-if="fieldErrors.title" class="text-xs font-bold text-red-800">{{ fieldErrors.title[0] }}</p>
      </div>

      <div class="space-y-1">
        <label for="post-slug" class="text-sm font-bold">Slug</label>
        <input id="post-slug" :value="form.slug" maxlength="255" placeholder="slug-do-post" class="border p-2 w-full" @input="updateSlug" />
        <p class="text-xs text-gray-600">
          {{ slugManuallyEdited ? "Slug definida manualmente." : "Gerada automaticamente a partir do título." }}
        </p>
        <p v-if="fieldErrors.slug" class="text-xs font-bold text-red-800">{{ fieldErrors.slug[0] }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div class="space-y-1">
          <label for="post-status" class="text-sm font-bold">Status</label>
          <select id="post-status" v-model="form.status" class="min-h-11 w-full border-2 border-black p-2">
            <option v-for="status in statuses" :key="status.value" :value="status.value">{{ status.label }}</option>
          </select>
        </div>
        <div v-if="form.status === 'published' || form.status === 'scheduled'" class="space-y-1">
          <label for="post-published-at" class="text-sm font-bold">Data de publicação (horário local)</label>
          <input id="post-published-at" v-model="form.published_at" type="datetime-local" required class="min-h-11 w-full border-2 border-black p-2" />
          <p v-if="fieldErrors.published_at" class="text-xs font-bold text-red-800">{{ fieldErrors.published_at[0] }}</p>
        </div>
        <div class="space-y-1">
          <label for="post-language" class="text-sm font-bold">Idioma</label>
          <select id="post-language" v-model="form.lang" class="min-h-11 w-full border-2 border-black p-2">
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="es">Espanhol</option>
          </select>
          <p v-if="fieldErrors.lang" class="text-xs font-bold text-red-800">{{ fieldErrors.lang[0] }}</p>
        </div>
      </div>

      <div class="space-y-1">
        <label for="post-excerpt" class="text-sm font-bold">Resumo</label>
        <textarea id="post-excerpt" v-model="form.excerpt" placeholder="Resumo do post" class="w-full border-2 border-black p-2" rows="3" />
        <p v-if="fieldErrors.excerpt" class="text-xs font-bold text-red-800">{{ fieldErrors.excerpt[0] }}</p>
      </div>

      <div class="space-y-2">
        <p class="font-bold text-sm">Thumbnail</p>
        <button type="button" class="flex w-full items-center justify-between gap-3 border-2 border-black px-3 py-2 bg-white shadow cursor-pointer hover:bg-gray-50 transition" @click="thumbnailInput?.click()">
          <span class="truncate text-xs font-bold">{{ thumbnailFile ? thumbnailFile.name : "Selecionar imagem..." }}</span>
          <span class="shrink-0 text-[10px] uppercase opacity-70">choose file</span>
        </button>
        <input ref="thumbnailInput" type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="handleThumbnailUpload" />
        <button v-if="thumbnailFile" type="button" class="text-xs font-bold underline" @click="cancelThumbnailSelection">Cancelar seleção</button>
        <PostImage v-if="currentThumbnail" :src="currentThumbnail" class="max-h-40 border-2 border-black object-cover" alt="Prévia da thumbnail" priority />
        <p v-if="fieldErrors.thumbnail" role="alert" class="text-xs font-bold text-red-800">{{ fieldErrors.thumbnail[0] }}</p>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <label class="text-sm font-bold">Conteúdo</label>
          <span class="text-[10px] font-bold uppercase text-black/60">Editor rico</span>
        </div>
        <TiptapEditor :key="editorKey" v-model="form.content" :disabled="isSubmitting" @uploading="isUploadingContent = $event" />
        <p v-if="fieldErrors.content" class="text-xs font-bold text-red-800">{{ fieldErrors.content[0] }}</p>
      </div>
      <p class="text-xs text-gray-600">{{ wordCount }} palavras · cerca de {{ readingMinutes }} min de leitura</p>

      <details class="border-2 border-black bg-white">
        <summary class="cursor-pointer px-3 py-2 font-bold">Prévia segura</summary>
        <div class="post-rich-content prose max-w-none border-t-2 border-black p-3" @error.capture="handlePostContentImageError" v-html="safePreview" />
      </details>

      <div class="space-y-2">
        <label class="font-bold text-sm">Tags</label>
        <p v-if="tagErrors.length" class="text-xs font-bold text-red-800">{{ tagErrors[0] }}</p>
        <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Digite uma tag e pressione Enter" class="min-h-11 w-full border-2 border-black p-2" />
        <div class="flex flex-wrap gap-2">
          <span v-for="(tag, index) in form.tags" :key="tag" class="border-2 border-black px-2 py-1 text-xs font-bold flex items-center gap-2">
            #{{ tag }}
            <button type="button" aria-label="Remover tag" @click="removeTag(index)">×</button>
          </span>
        </div>
      </div>

      <button @click="submit" :disabled="isSubmitting || isUploadingContent" class="min-h-11 w-full border-2 border-black bg-white px-4 py-2 font-bold shadow disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {{ isSubmitting ? (isEditing ? "Atualizando..." : "Salvando...") : (isEditing ? "Atualizar" : "Salvar") }}
      </button>

      <p v-if="successMessage" class="border-2 border-black bg-green-100 p-2 text-sm font-bold">{{ successMessage }}</p>
      <p v-if="errorMessage" role="alert" class="border-2 border-red-800 bg-red-100 p-2 text-sm font-bold text-red-900">{{ errorMessage }}</p>
    </fieldset>
  </div>
</template>
