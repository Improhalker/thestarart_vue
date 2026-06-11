<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { Bold, Italic, Underline, Link, Image, Youtube } from "lucide-vue-next";

const props = defineProps<{
  editor: Editor;
}>();

const btn =
  "p-1 border-2 border-black bg-white shadow-[2px_2px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#ff4d6d] transition-all flex items-center justify-center";

const isActive = (type: string) =>
  props.editor.isActive(type) ? "bg-black text-white" : "";

const insertLink = () => {
  const url = window.prompt("URL:");
  if (url) {
    props.editor.chain().focus().setLink({ href: url }).run();
  }
};

const insertImage = () => {
  const url = window.prompt("Image URL:");
  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run();
  }
};

const insertYoutube = () => {
  const url = window.prompt("YouTube URL:");
  if (url) {
    props.editor.commands.setYoutubeVideo({
      src: url,
    });
  }
};
</script>

<template>
  <div class="flex items-center gap-1 p-2 border-b-2 border-black bg-ts-retro-gray">
    <!-- BOLD -->
    <button
      :class="[btn, isActive('bold')]"
      @click="props.editor.chain().focus().toggleBold().run()"
    >
      <Bold :size="12" />
    </button>

    <!-- ITALIC -->
    <button
      :class="[btn, isActive('italic')]"
      @click="props.editor.chain().focus().toggleItalic().run()"
    >
      <Italic :size="12" />
    </button>

    <!-- UNDERLINE -->
    <button
      :class="[btn, isActive('underline')]"
      @click="props.editor.chain().focus().toggleUnderline?.().run()"
    >
      <Underline :size="12" />
    </button>

    <!-- LINK -->
    <button :class="btn" @click="insertLink">
      <Link :size="12" />
    </button>

    <!-- IMAGE -->
    <button :class="btn" @click="insertImage">
      <Image :size="12" />
    </button>

    <!-- YOUTUBE -->
    <button :class="btn" @click="insertYoutube">
      <Youtube :size="12" />
    </button>
  </div>
</template>
