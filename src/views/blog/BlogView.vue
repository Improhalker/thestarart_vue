<script setup lang="ts">
import BlogGrid from "@/components/global/blog/BlogGrid.vue";
</script>

<template>
  <div class="container-style-dark">
    <CardWindowHeader title="Blog.exe" />

    <!-- BANNER -->
    <div class="relative overflow-hidden mb-4 h-40">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('/images/blog-banner.jpg')"
      />

      <!-- overlay -->
      <div class="absolute inset-0 bg-black/60" />

      <!-- content -->
      <div class="relative z-10 h-full flex flex-col justify-center p-4">
        <h1 class="text-xl font-black text-white uppercase">Bem Vindo a Area do Blog</h1>

        <p class="text-xs text-gray-300 mt-1">
          pensamentos · desenhos · dev notes · atualizacoes de sistema
        </p>
      </div>
    </div>

    <BlogGrid />
  </div>
</template>
