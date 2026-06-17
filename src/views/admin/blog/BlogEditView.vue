<script setup lang="ts">
import { ref, reactive } from "vue";
import TiptapEditor from "@/components/admin/blog/editor/TiptapEditor.vue";

const tagInput = ref("");
const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase();

  if (!tag) return;
  if (form.tags.includes(tag)) return;

  form.tags.push(tag);
  tagInput.value = "";
};

const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: [] as string[],
  publish_date: new Date().toISOString(),
  visibility: 1,
  lang: "pt",
});

const isSubmitting = ref(false);

const editorKey = ref(0);

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
};

const submit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(JSON.stringify(errorData));
    }

    resetForm();
    successMessage.value = "✅ Post salvo com sucesso!";

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error(error);
    alert("Não foi possível salvar o post.");
  } finally {
    isSubmitting.value = false;
  }
};

const successMessage = ref("");
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Criar Post</h1>

    <input v-model="form.title" placeholder="Título" class="border p-2 w-full" />

    <input v-model="form.slug" placeholder="Slug" class="border p-2 w-full" />

    <textarea v-model="form.excerpt" placeholder="Excerpt" class="border p-2 w-full" />

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
      {{ isSubmitting ? "Salvando..." : "Salvar" }}
    </button>
    <p
      v-if="successMessage"
      class="border-2 border-black bg-green-100 p-2 text-sm font-bold"
    >
      {{ successMessage }}
    </p>
  </div>
</template>
