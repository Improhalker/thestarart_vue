<template>
  <div class="p-6 space-y-4">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-black uppercase">Blog Admin</h1>

      <button
        class="border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        @click="goCreate"
      >
        + Novo Post
      </button>
    </div>

    <!-- CARDS (placeholder futuramente lista) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Posts totais</p>
        <p class="text-3xl font-black">--</p>
      </div>

      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Publicados</p>
        <p class="text-3xl font-black">--</p>
      </div>

      <div class="border-2 border-black p-3 shadow-[4px_4px_0px_black] bg-white">
        <p class="text-xs uppercase font-bold">Rascunhos</p>
        <p class="text-3xl font-black">--</p>
      </div>
    </div>

    <!-- FUTURO: LISTA -->
    <div class="border-2 border-black p-4 shadow-[4px_4px_0px_black] bg-white">
      <p class="text-xs uppercase font-bold mb-2">Posts</p>

      <p class="text-sm text-gray-500">
        Ainda sem dados. Em breve aqui será a lista de posts.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goCreate = () => {
  router.push("/admin/blog/editor");
};
</script>
