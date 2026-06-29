<script setup lang="ts">
import { onMounted } from "vue";
import { usePosts } from "@/composables/posts/usePosts";

const { posts, pending, error, fetchPosts } = usePosts();

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="p-4 space-y-4">
    <div v-if="pending">
      <p>Carregando posts...</p>
      <img
        width="139"
        height="115"
        src="https://blob.gifcities.org/gifcities/NNDAMTBIN4ZDLQSQMSMSLE3YFC7K646F.gif"
      />
    </div>

    <div v-else-if="error" class="border-2 border-red-500 bg-red-50 p-4 text-sm">
      <p class="font-black uppercase text-red-700">
        ⚠️ Não foi possível carregar os posts.
      </p>

      <p class="mt-2 text-gray-700">
        Tente atualizar a página em alguns instantes. Se o problema continuar, entre em
        contato pelo Instagram ou por e-mail.
      </p>

      <div class="mt-3 flex flex-wrap gap-3 text-xs font-bold">
        <a
          href="https://www.instagram.com/thestarart_/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:opacity-80"
        >
          📷 @thestarart_
        </a>

        <a href="mailto:thestarart@gmail.com" class="underline hover:opacity-80">
          ✉️ thestarart@gmail.com
        </a>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="post in posts.slice(0, 4)"
        :key="post.id"
        class="relative group cursor-pointer overflow-hidden border-2 border-[var(--color-ts-ui-border-dark)] min-h-[220px]"
      >
        <!-- Background image -->
        <div
          class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          :style="{
            backgroundImage: `url(${post.thumbnail ?? '/images/banner.webp'})`,
          }"
        />

        <!-- Overlay roxo -->
        <div class="absolute inset-0 bg-purple-900/70" />

        <!-- Conteúdo -->
        <div class="relative z-10 p-4 h-full flex flex-col justify-between text-white">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              class="text-[10px] px-2 py-[2px] border border-white/40 rounded-full uppercase font-bold bg-white/10"
            >
              {{ post.tags?.[0] ?? "SYSTEM" }}
            </span>
          </div>

          <!-- Main content -->
          <div class="space-y-2">
            <h3 class="text-lg font-black uppercase leading-tight">
              {{ post.title }}
            </h3>

            <p class="text-[12px] text-gray-200 line-clamp-3">
              {{ post.excerpt }}
            </p>

            <span class="text-[10px] text-gray-300">
              {{ new Date(post.publish_date).toLocaleDateString("pt-BR") }}
            </span>
          </div>

          <div class="pt-2 text-center">
            <router-link
              :to="`/post/${post.slug}`"
              class="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/images/ui/read_nowlight2.png"
                alt="Load More"
                class="w-32 inline-block"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!pending && posts.length === 0" class="text-center text-sm">
      Nenhum post encontrado.
    </div>

    <!-- LOAD MORE -->
    <div class="pt-2 text-center">
      <router-link
        to="/blog"
        class="inline-block transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src="/images/ui/load_morebutton.png"
          alt="Load More"
          class="w-32 inline-block"
        />
      </router-link>
    </div>
  </div>
</template>
