<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TiptapToolbar from "./TiptapToolbar.vue";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue || "<p>Olá mundo!</p>",
  extensions: [
    StarterKit,
    Image,
    Link.configure({
      openOnClick: false,
    }),
    Underline,
    Youtube.configure({
      controls: true,
    }),
  ],
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});
</script>

<template>
  <div class="border-2 border-black shadow-[4px_4px_0px_0px_black] bg-white">
    <!-- TOOLBAR -->
    <TiptapToolbar v-if="editor" :editor="editor" />

    <!-- EDITOR -->
    <div class="p-3">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style>
.ProseMirror {
  min-height: 300px;
  outline: none;
}

.ProseMirror p {
  margin: 0.8rem 0;
}
</style>
