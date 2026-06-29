<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import TiptapEditor from "@/components/admin/blog/editor/TiptapEditor.vue";
import { usePostsRepository } from "@/composables/posts/usePostRepository";

const route = useRoute();
const postsRepo = usePostsRepository();

const postId = route.params.id as string | undefined;
const isEditing = !!postId;

const tagInput = ref("");
const isSubmitting = ref(false);
const isLoading = ref(false);
const editorKey = ref(0);
const successMessage = ref("");

const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: null as string | null,
  tags: [] as string[],
  publish_date: new Date().toISOString(),
  visibility: 1,
  lang: "pt",
});

onMounted(async () => {
  if (!isEditing) return;

  isLoading.value = true;

  try {
    const response = await postsRepo.getById(postId!);
    const post = response.data;

    form.title = post.title;
    form.slug = post.slug;
    form.excerpt = post.excerpt;
    form.content = post.content;
    form.thumbnail = post.thumbnail;
    form.tags = [...post.tags];
    form.publish_date = post.publish_date;
    form.visibility = post.visibility;

    editorKey.value++;
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar o post.");
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

const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

const resetForm = () => {
  form.title = "";
  form.slug = "";
  form.excerpt = "";
  form.content = "";
  form.tags = [];
  form.publish_date = new Date().toISOString();
  form.visibility = 1;
  form.lang = "pt";

  tagInput.value = "";
  editorKey.value++;

  thumbnailFile.value = null;
};

const submit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      publish_date: form.publish_date,
      visibility: form.visibility,
      lang: form.lang,
      tags: form.tags,
      thumbnail: thumbnailFile.value,
    };

    if (isEditing) {
      await postsRepo.update(postId!, payload);
      successMessage.value = "✅ Post atualizado com sucesso!";
    } else {
      await postsRepo.create(payload);
      resetForm();
      successMessage.value = "✅ Post criado com sucesso!";
    }

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);

const handleThumbnailUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;

  thumbnailFile.value = file;
  thumbnailPreview.value = URL.createObjectURL(file);
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">
      {{ isEditing ? "Editar Post" : "Criar Post" }}
    </h1>

    <div v-if="isLoading">
      <p>Carregando post...</p>
      <img
        width="173"
        height="120"
        src="https://blob.gifcities.org/gifcities/3CCTKJPWEPVDFGJ6YSRXG7732XOYGHQS.gif"
      />
    </div>

    <template v-else>
      <input v-model="form.title" placeholder="Título" class="border p-2 w-full" />

      <input v-model="form.slug" placeholder="Slug" class="border p-2 w-full" />

      <textarea v-model="form.excerpt" placeholder="Excerpt" class="border p-2 w-full" />
      <div class="space-y-2">
        <label class="font-bold text-sm">Thumbnail</label>

        <label
          class="flex items-center justify-between border-2 border-black px-3 py-2 bg-white shadow cursor-pointer hover:bg-gray-50 transition"
        >
          <span class="text-xs font-bold">
            {{ thumbnailFile ? thumbnailFile.name : "Selecionar imagem..." }}
          </span>

          <span class="text-[10px] uppercase opacity-70"> choose file </span>

          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleThumbnailUpload"
          />
        </label>

        <!-- preview opcional -->
        <div v-if="thumbnailPreview" class="mt-2">
          <img
            :src="thumbnailPreview"
            class="max-h-40 border-2 border-black object-cover"
          />
        </div>
      </div>
      <TiptapEditor :key="editorKey" v-model="form.content" />

      <div class="space-y-2">
        <label class="font-bold text-sm">Tags</label>

        <input
          v-model="tagInput"
          @keydown.enter.prevent="addTag"
          placeholder="Digite uma tag e pressione Enter"
          class="border p-2 w-full"
        />

        <div class="flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in form.tags"
            :key="tag"
            class="border-2 border-black px-2 py-1 text-xs font-bold flex items-center gap-2"
          >
            #{{ tag }}

            <button @click="removeTag(index)">✕</button>
          </span>
        </div>
      </div>

      <button
        @click="submit"
        :disabled="isSubmitting"
        class="border-2 border-black px-4 py-2 bg-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{
          isSubmitting
            ? isEditing
              ? "Atualizando..."
              : "Salvando..."
            : isEditing
            ? "Atualizar"
            : "Salvar"
        }}
      </button>

      <p
        v-if="successMessage"
        class="border-2 border-black bg-green-100 p-2 text-sm font-bold"
      >
        {{ successMessage }}
      </p>
    </template>
  </div>
</template>
