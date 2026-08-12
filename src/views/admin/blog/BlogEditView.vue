<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { Eye, Heart } from "lucide-vue-next";
import TiptapEditor from "@/components/admin/blog/editor/TiptapEditor.vue";
import { ApiError } from "@/composables/api/useApi";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import type { Post } from "@/composables/posts/types";
import { normalizePostSlug } from "@/utils/postSlug";
import { sanitizePostHtml } from "@/utils/sanitizePostHtml";

type PostStatus = Post["status"];

const route = useRoute();
const postsRepo = usePostsRepository();
const postId = route.params.id as string | undefined;
const isEditing = Boolean(postId);
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
const savedFingerprint = ref("");
const fieldErrors = ref<Record<string, string[]>>({});
const engagement = ref({ views: 0, likes: 0 });

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
const fingerprint = computed(() => JSON.stringify({ ...form, thumbnail: thumbnailFile.value?.name || null }));
const hasUnsavedChanges = computed(() => fingerprint.value !== savedFingerprint.value);
const currentThumbnail = computed(() => thumbnailPreview.value || form.thumbnail);

watch(
  () => form.title,
  (title) => {
    if (!slugManuallyEdited.value) form.slug = normalizePostSlug(title);
  },
  { immediate: true },
);

watch(
  () => form.status,
  (status) => {
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

onMounted(async () => {
  if (!isEditing) {
    await setSavedFingerprint();
    return;
  }

  isLoading.value = true;

  try {
    const { data: post } = await postsRepo.getAdminPost(postId!);
    form.title = post.title;
    form.slug = post.slug;
    form.excerpt = post.excerpt;
    form.content = post.content;
    form.thumbnail = post.thumbnail;
    form.tags = [...post.tags];
    form.published_at = toLocalDateTime(post.published_at);
    form.status = post.status;
    form.lang = post.lang;
    engagement.value = { views: post.views_count, likes: post.likes_count };
    slugManuallyEdited.value = true;
    editorKey.value++;
    await setSavedFingerprint();
  } catch {
    errorMessage.value = "Não foi possível carregar o post.";
  } finally {
    isLoading.value = false;
  }
});

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

const handleThumbnailUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  clearThumbnailPreview();
  thumbnailFile.value = file;
  thumbnailPreview.value = URL.createObjectURL(file);
};

const resetForm = async () => {
  clearThumbnailPreview();
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
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";
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

    if (isEditing) {
      await postsRepo.update(postId!, payload);
      successMessage.value = "Post atualizado com sucesso!";
      await setSavedFingerprint();
    } else {
      await postsRepo.create(payload);
      successMessage.value = "Post criado com sucesso!";
      await resetForm();
    }

    window.setTimeout(() => (successMessage.value = ""), 3000);
  } catch (error) {
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

onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) return true;
  return window.confirm("Há alterações não salvas. Deseja sair mesmo assim?");
});

onBeforeUnmount(clearThumbnailPreview);
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

    <template v-else>
      <div class="space-y-1">
        <label for="post-title" class="text-sm font-bold">Título</label>
        <input id="post-title" v-model="form.title" placeholder="Título" class="border p-2 w-full" />
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
        <label class="font-bold text-sm">Thumbnail</label>
        <label class="flex items-center justify-between gap-3 border-2 border-black px-3 py-2 bg-white shadow cursor-pointer hover:bg-gray-50 transition">
          <span class="truncate text-xs font-bold">{{ thumbnailFile ? thumbnailFile.name : "Selecionar imagem..." }}</span>
          <span class="shrink-0 text-[10px] uppercase opacity-70">choose file</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="handleThumbnailUpload" />
        </label>
        <img v-if="currentThumbnail" :src="currentThumbnail" class="max-h-40 border-2 border-black object-cover" alt="Prévia da thumbnail" />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <label class="text-sm font-bold">Conteúdo</label>
          <span class="text-[10px] font-bold uppercase text-black/60">Editor rico</span>
        </div>
        <TiptapEditor :key="editorKey" v-model="form.content" />
        <p v-if="fieldErrors.content" class="text-xs font-bold text-red-800">{{ fieldErrors.content[0] }}</p>
      </div>
      <p class="text-xs text-gray-600">{{ wordCount }} palavras · cerca de {{ readingMinutes }} min de leitura</p>

      <details class="border-2 border-black bg-white">
        <summary class="cursor-pointer px-3 py-2 font-bold">Prévia segura</summary>
        <div class="post-rich-content prose max-w-none border-t-2 border-black p-3" v-html="safePreview" />
      </details>

      <div class="space-y-2">
        <label class="font-bold text-sm">Tags</label>
        <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Digite uma tag e pressione Enter" class="min-h-11 w-full border-2 border-black p-2" />
        <div class="flex flex-wrap gap-2">
          <span v-for="(tag, index) in form.tags" :key="tag" class="border-2 border-black px-2 py-1 text-xs font-bold flex items-center gap-2">
            #{{ tag }}
            <button type="button" aria-label="Remover tag" @click="removeTag(index)">×</button>
          </span>
        </div>
      </div>

      <button @click="submit" :disabled="isSubmitting" class="min-h-11 w-full border-2 border-black bg-white px-4 py-2 font-bold shadow disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {{ isSubmitting ? (isEditing ? "Atualizando..." : "Salvando...") : (isEditing ? "Atualizar" : "Salvar") }}
      </button>

      <p v-if="successMessage" class="border-2 border-black bg-green-100 p-2 text-sm font-bold">{{ successMessage }}</p>
      <p v-if="errorMessage" role="alert" class="border-2 border-red-800 bg-red-100 p-2 text-sm font-bold text-red-900">{{ errorMessage }}</p>
    </template>
  </div>
</template>
