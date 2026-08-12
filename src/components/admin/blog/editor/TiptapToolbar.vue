<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import { Bold, Code2, Heading2, Heading3, Image, Italic, Link, List, ListOrdered, Minus, Quote, Redo2, Underline, Undo2, Youtube } from "lucide-vue-next";

const props = defineProps<{ editor: Editor }>();
const imageInput = ref<HTMLInputElement | null>(null);
const postsRepo = usePostsRepository();
const btn = "shrink-0 bg-[#8d8d8d] p-1 border-2 border-black shadow-[2px_2px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#ff4d6d] transition-all flex items-center justify-center";
const isActive = (type: string, attributes?: Record<string, unknown>) => props.editor.isActive(type, attributes) ? "bg-black text-white" : "";

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const alt = window.prompt("Texto alternativo da imagem (obrigatório):")?.trim();
  if (!alt) {
    window.alert("Informe um texto alternativo para inserir a imagem.");
    input.value = "";
    return;
  }

  const title = window.prompt("Título da imagem (opcional):")?.trim();
  const formData = new FormData();
  formData.append("image", file);

  try {
    const data = await postsRepo.uploadImage(formData);
    props.editor.chain().focus().setImage({ src: data.url, alt, title: title || undefined }).run();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
  } finally {
    input.value = "";
  }
};

const insertLink = () => {
  const value = window.prompt("URL segura (http ou https):")?.trim();
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    props.editor.chain().focus().setLink({ href: url.href, target: "_blank", rel: "noopener noreferrer" }).run();
  } catch {
    window.alert("Informe uma URL http ou https válida.");
  }
};

const youtubeIdFrom = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
      return url.searchParams.get("v") || url.pathname.match(/^\/embed\/([^/?]+)/)?.[1] || "";
    }
  } catch { return ""; }
  return "";
};

const insertYoutube = () => {
  const input = window.prompt("URL do YouTube:")?.trim();
  if (!input) return;
  const id = youtubeIdFrom(input);
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
    window.alert("Informe uma URL válida de vídeo do YouTube.");
    return;
  }
  props.editor.commands.setYoutubeVideo({ src: `https://www.youtube-nocookie.com/embed/${id}` });
};
</script>

<template>
  <div class="flex items-center gap-1 overflow-x-auto p-2 border-b-2 border-black bg-ts-retro-gray sm:flex-wrap" aria-label="Ferramentas do editor">
    <button type="button" :class="[btn, isActive('bold')]" aria-label="Negrito" @click="props.editor.chain().focus().toggleBold().run()"><Bold :size="12" /></button>
    <button type="button" :class="[btn, isActive('italic')]" aria-label="Itálico" @click="props.editor.chain().focus().toggleItalic().run()"><Italic :size="12" /></button>
    <button type="button" :class="[btn, isActive('underline')]" aria-label="Sublinhado" @click="props.editor.chain().focus().toggleUnderline().run()"><Underline :size="12" /></button>
    <button type="button" :class="[btn, isActive('heading', { level: 2 })]" aria-label="Título nível 2" @click="props.editor.chain().focus().toggleHeading({ level: 2 }).run()"><Heading2 :size="12" /></button>
    <button type="button" :class="[btn, isActive('heading', { level: 3 })]" aria-label="Título nível 3" @click="props.editor.chain().focus().toggleHeading({ level: 3 }).run()"><Heading3 :size="12" /></button>
    <button type="button" :class="[btn, isActive('bulletList')]" aria-label="Lista" @click="props.editor.chain().focus().toggleBulletList().run()"><List :size="12" /></button>
    <button type="button" :class="[btn, isActive('orderedList')]" aria-label="Lista ordenada" @click="props.editor.chain().focus().toggleOrderedList().run()"><ListOrdered :size="12" /></button>
    <button type="button" :class="[btn, isActive('blockquote')]" aria-label="Citação" @click="props.editor.chain().focus().toggleBlockquote().run()"><Quote :size="12" /></button>
    <button type="button" :class="[btn, isActive('codeBlock')]" aria-label="Bloco de código" @click="props.editor.chain().focus().toggleCodeBlock().run()"><Code2 :size="12" /></button>
    <button type="button" :class="btn" aria-label="Separador" @click="props.editor.chain().focus().setHorizontalRule().run()"><Minus :size="12" /></button>
    <button type="button" :class="btn" aria-label="Inserir link" @click="insertLink"><Link :size="12" /></button>
    <button type="button" :class="btn" aria-label="Inserir imagem" @click="imageInput?.click()"><Image :size="12" /></button>
    <input ref="imageInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden" @change="handleImageUpload" />
    <button type="button" :class="btn" aria-label="Inserir vídeo do YouTube" @click="insertYoutube"><Youtube :size="12" /></button>
    <button type="button" :class="btn" aria-label="Desfazer" :disabled="!props.editor.can().undo()" @click="props.editor.chain().focus().undo().run()"><Undo2 :size="12" /></button>
    <button type="button" :class="btn" aria-label="Refazer" :disabled="!props.editor.can().redo()" @click="props.editor.chain().focus().redo().run()"><Redo2 :size="12" /></button>
  </div>
</template>
