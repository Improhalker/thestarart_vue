<script setup lang="ts">
import { onMounted, ref } from "vue";
import { BookHeart, Send } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import { ApiError } from "@/composables/api/useApi";
import { usePostEngagement } from "@/composables/posts/usePostEngagement";
import { useGuestbookRepository, type GuestbookEntry } from "@/composables/useGuestbookRepository";

const repository = useGuestbookRepository();
const engagement = usePostEngagement();
const entries = ref<GuestbookEntry[]>([]);
const loading = ref(true);
const sending = ref(false);
const error = ref("");
const feedback = ref("");
const form = ref({ name: "", email: "", content: "", website: "" });

const formatDate = (value: string) => new Date(value).toLocaleDateString("pt-BR", { dateStyle: "medium" });

const load = async () => {
  try {
    entries.value = (await repository.listPublic()).data;
  } catch {
    error.value = "Não foi possível carregar o guestbook.";
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  sending.value = true;
  error.value = "";
  feedback.value = "";
  try {
    await engagement.prepareCsrfCookie();
    await repository.create(form.value);
    form.value.content = "";
    form.value.website = "";
    feedback.value = "Mensagem recebida! Ela aparecerá após a moderação.";
  } catch (exception) {
    error.value = exception instanceof ApiError ? exception.message : "Não foi possível enviar sua mensagem.";
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  void engagement.prepareCsrfCookie().catch(() => undefined);
  void load();
});
</script>

<template>
  <section class="container-style-dark overflow-hidden border-2 shadow-[8px_8px_0_rgba(0,0,0,0.7)]">
    <CardWindowHeader title="GUESTBOOK.EXE" :icon="BookHeart" />
    <div class="space-y-6 p-4 sm:p-6">
      <header class="border-b border-[var(--ui-border)] pb-5 text-center">
        <p class="text-[10px] uppercase tracking-[0.22em] text-[var(--ts-primary-pink)]">livro de visitas online</p>
        <h1 class="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">Deixe uma mensagem</h1>
        <p class="mt-2 text-xs text-gray-300">Assine o arquivo do TheStarArt_. Mensagens passam por moderação antes de serem publicadas.</p>
      </header>

      <form class="space-y-4 border border-[var(--ui-border)] bg-black/20 p-4" @submit.prevent="submit">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-xs text-gray-200">Nome<input v-model.trim="form.name" required minlength="2" maxlength="80" autocomplete="name" class="mt-1 w-full border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
          <label class="text-xs text-gray-200">E-mail <span class="text-gray-500">(não será público)</span><input v-model.trim="form.email" required type="email" maxlength="255" autocomplete="email" class="mt-1 w-full border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
        </div>
        <label class="block text-xs text-gray-200">Mensagem<textarea v-model.trim="form.content" required maxlength="800" rows="5" class="mt-1 w-full resize-y border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
        <label class="hidden" aria-hidden="true">Website<input v-model="form.website" tabindex="-1" autocomplete="off" /></label>
        <button type="submit" :disabled="sending" class="inline-flex items-center gap-2 border border-[var(--ts-primary-pink)] px-3 py-2 text-xs uppercase text-white transition-colors hover:bg-[var(--ts-primary-pink)] disabled:cursor-wait disabled:opacity-50"><Send :size="14" aria-hidden="true" /> {{ sending ? "Enviando..." : "Assinar guestbook" }}</button>
        <p v-if="feedback" class="text-xs text-green-300">{{ feedback }}</p><p v-if="error" role="alert" class="text-xs text-red-300">{{ error }}</p>
      </form>

      <section aria-labelledby="entries-title">
        <h2 id="entries-title" class="mb-3 text-sm font-bold uppercase text-white">Mensagens aprovadas</h2>
        <p v-if="loading" class="text-xs text-gray-400">Abrindo arquivo...</p>
        <p v-else-if="!entries.length" class="text-xs text-gray-400">Ainda não há mensagens aprovadas. Você pode ser a primeira pessoa a assinar.</p>
        <ol v-else class="space-y-3">
          <li v-for="entry in entries" :key="entry.id" class="border-l-2 border-[var(--ts-primary-pink)] bg-black/20 p-3">
            <p class="text-xs font-bold uppercase text-white">{{ entry.name }} <span class="ml-2 font-normal text-gray-500">{{ formatDate(entry.created_at) }}</span></p>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">{{ entry.content }}</p>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>
