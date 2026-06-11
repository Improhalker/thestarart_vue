<script setup lang="ts">
import { reactive } from "vue";
import TiptapEditor from "@/components/admin/blog/editor/TiptapEditor.vue";

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
const submit = async () => {
  await fetch("http://localhost:8000/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer TOKEN_AQUI`,
    },
    body: JSON.stringify(form),
  });
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Criar Post</h1>

    <input v-model="form.title" placeholder="Título" class="border p-2 w-full" />

    <input v-model="form.slug" placeholder="Slug" class="border p-2 w-full" />

    <textarea v-model="form.excerpt" placeholder="Excerpt" class="border p-2 w-full" />

    <TiptapEditor v-model="form.content" />

    <button class="border-2 border-black px-4 py-2 bg-white shadow" @click="submit">
      Salvar
    </button>
  </div>
</template>
