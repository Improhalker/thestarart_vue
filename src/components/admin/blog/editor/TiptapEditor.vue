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
    <div class="editor-content p-3"><EditorContent :editor="editor" /></div>
  </div>
</template>

<style scoped>
.editor-content :deep(.ProseMirror) {
  min-height: 300px;
  outline: none;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0.8rem 0;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  margin: 0.8rem 0;
  padding-left: 1.75rem;
}

.editor-content :deep(.ProseMirror ul) {
  list-style: disc;
}

.editor-content :deep(.ProseMirror ol) {
  list-style: decimal;
}

.editor-content :deep(.ProseMirror ul ul) {
  list-style: circle;
}

.editor-content :deep(.ProseMirror ul ul ul) {
  list-style: square;
}

.editor-content :deep(.ProseMirror ol ol) {
  list-style: lower-alpha;
}

.editor-content :deep(.ProseMirror ol ol ol) {
  list-style: lower-roman;
}

.editor-content :deep(.ProseMirror li) {
  margin: 0.25rem 0;
}

.editor-content :deep(.ProseMirror li > p) {
  margin: 0;
}

.editor-content :deep(.ProseMirror blockquote) {
  margin: 1rem 0;
  border-left: 4px solid var(--ts-primary-pink);
  background: var(--ts-retro-gray);
  padding: 0.75rem 1rem;
  font-style: italic;
}

.editor-content :deep(.ProseMirror blockquote p:first-child) {
  margin-top: 0;
}

.editor-content :deep(.ProseMirror blockquote p:last-child) {
  margin-bottom: 0;
}
</style>
