<script setup lang="ts">
import { computed, watch } from "vue";
import { CalendarDays, Eye, FileText, Heart, Tag } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import ChangelogView from "@/views/ChangelogView.vue";
import Chat from "@/components/globalchat/Chat.vue";
import { usePublicPosts } from "@/composables/posts/usePublicPosts";
import type { PublicPost } from "@/composables/posts/types";

const props = defineProps<{
  post: PublicPost;
  likesCount: number;
}>();
const { posts, pending, fetchPublicPosts } = usePublicPosts();

const recentPosts = computed(() => posts.value
  .filter((item) => item.slug !== props.post.slug)
  .slice(0, 3));

const formatDate = (date: string | null) => date
  ? new Date(date).toLocaleDateString("pt-BR")
  : "data indisponível";

const languageLabel: Record<string, string> = { pt: "PT-BR", en: "EN-US", es: "ES-ES" };

watch(
  () => [props.post.slug, props.post.lang] as const,
  ([, language]) => {
    void fetchPublicPosts({ lang: language as "pt" | "en" | "es", perPage: 4 });
  },
  { immediate: true },
);
</script>

<template>
  <aside
    class="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1"
    aria-label="Informações complementares do post"
  >
    <section class="container-style-dark relative overflow-hidden border-2 px-5 py-4" aria-labelledby="music-reminder-title">
      <img src="https://blob.gifcities.org/gifcities/6O45UO25F4LWLOD3LPHJWYZXBHC25S76.gif" alt="" class="pointer-events-none absolute left-0 top-0 h-7 w-7 -translate-x-1 -translate-y-1 -scale-x-100 pixelated" />
      <img src="https://blob.gifcities.org/gifcities/6O45UO25F4LWLOD3LPHJWYZXBHC25S76.gif" alt="" class="pointer-events-none absolute right-0 top-0 h-7 w-7 translate-x-1 -translate-y-1 pixelated" />
      <img src="https://blob.gifcities.org/gifcities/6O45UO25F4LWLOD3LPHJWYZXBHC25S76.gif" alt="" class="pointer-events-none absolute bottom-0 left-0 h-7 w-7 -translate-x-1 translate-y-1 scale-x-100 -scale-y-100 pixelated" />
      <img src="https://blob.gifcities.org/gifcities/6O45UO25F4LWLOD3LPHJWYZXBHC25S76.gif" alt="" class="pointer-events-none absolute bottom-0 right-0 h-7 w-7 translate-x-1 translate-y-1 -scale-y-100 pixelated" />

      <div class="relative flex items-center gap-3">
        <img src="https://blob.gifcities.org/gifcities/UYMWYFCKIQLBBT73NQ653J5DIVI3EIE7.gif" alt="Personagem lembrando sobre a música" class="h-16 w-16 shrink-0 object-contain pixelated" />
        <div class="min-w-0 space-y-1">
          <h2 id="music-reminder-title" class="text-[11px] font-bold uppercase text-[var(--ts-primary-pink)]">MUSIC_REQUIRED.EXE</h2>
          <p class="text-[10px] leading-relaxed text-gray-200">A música faz parte do arquivo. Dê play antes de continuar: sem ela, você não vai sentir a verdadeira essencia do post... XD</p>
          <img src="https://blob.gifcities.org/gifcities/725MZXGI6VVIVKRWCOPELDMP6K3PIAZD.gif" alt="" width="88" height="31" class="h-[31px] w-[88px] pixelated" />
        </div>
      </div>
    </section>

    <section class="border-2 container-style-dark">
      <CardWindowHeader title="RECENT_FILES" :icon="FileText" />

      <div class="divide-y divide-[var(--ui-border)] p-2">
        <router-link
          v-for="item in recentPosts"
          :key="item.id"
          :to="`/post/${item.slug}`"
          class="group flex gap-2 p-2 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ts-primary-pink)]"
        >
          <img :src="item.thumbnail ?? '/images/banner.webp'" alt="" class="h-20 w-20 shrink-0 border border-black object-cover pixelated" loading="lazy" />
          <span class="min-w-0">
            <span class="block truncate text-[11px] font-bold uppercase text-white group-hover:text-[var(--ts-primary-pink)]">{{ item.title }}</span>
            <span class="mt-1 block text-[9px] uppercase text-gray-400">{{ formatDate(item.published_at) }}</span>
          </span>
        </router-link>

        <p v-if="pending" class="p-3 text-center text-[10px] uppercase text-gray-400">procurando arquivos...</p>
        <p v-else-if="recentPosts.length === 0" class="p-3 text-center text-[10px] uppercase text-gray-400">nenhum arquivo relacionado.</p>
      </div>
    </section>

    <section class="border-2 container-style-dark">
      <CardWindowHeader title="POST_INFO" />

      <dl class="space-y-3 p-3 text-[10px] uppercase text-gray-300">
        <div class="flex items-start gap-2"><CalendarDays :size="14" class="mt-0.5 shrink-0 text-[var(--ts-primary-pink)]" /><div><dt class="text-gray-500">publicado</dt><dd class="text-white">{{ formatDate(post.published_at) }}</dd></div></div>
        <div class="flex items-start gap-2"><FileText :size="14" class="mt-0.5 shrink-0 text-[var(--ts-primary-pink)]" /><div><dt class="text-gray-500">idioma</dt><dd class="text-white">{{ languageLabel[post.lang] ?? post.lang }}</dd></div></div>
        <div class="flex items-start gap-2"><Eye :size="14" class="mt-0.5 shrink-0 text-[var(--ts-primary-pink)]" /><div><dt class="text-gray-500">visualizações</dt><dd class="text-white">{{ post.views_count }}</dd></div></div>
        <div class="flex items-start gap-2"><Heart :size="14" class="mt-0.5 shrink-0 text-[var(--ts-primary-pink)]" /><div><dt class="text-gray-500">curtidas</dt><dd class="text-white">{{ likesCount }}</dd></div></div>
        <div class="flex items-start gap-2"><Tag :size="14" class="mt-0.5 shrink-0 text-[var(--ts-primary-pink)]" /><div><dt class="text-gray-500">tags</dt><dd class="text-white">{{ post.tags.length ? post.tags.join(" · ") : "sem categoria" }}</dd></div></div>
      </dl>
    </section>

    <section class="border-2 container-style-dark">
      <CardWindowHeader title="CHATROOM.EXE" />
      <Chat class="!my-0 !mb-0" height="347px" />
    </section>
                <ChangelogView variant="retro-pink" :limit="5" :fullHeight="false" />

  </aside>
</template>
