<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import TiptapToolbar from "./TiptapToolbar.vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue || "<p></p>",
  extensions: [
    StarterKit,
    Image.configure({ allowBase64: false }),
    Link.configure({
      openOnClick: false,
      protocols: ["http", "https"],
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
    Underline,
    Youtube.configure({ controls: true, nocookie: true }),
  ],
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});
</script>

<template>
  <div class="border-2 border-black shadow-[4px_4px_0px_0px_black] bg-white">
    <TiptapToolbar v-if="editor" :editor="editor" />
    <div class="p-3"><EditorContent :editor="editor" /></div>
  </div>
</template>

<style>
.ProseMirror { min-height: 300px; outline: none; }
.ProseMirror p { margin: 0.8rem 0; }
</style>
