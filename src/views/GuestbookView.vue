<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { BookHeart, Send } from "lucide-vue-next";
import CardWindowHeader from "@/components/global/CardWindowHeader.vue";
import PaginationControls from "@/components/global/PaginationControls.vue";
import { ApiError } from "@/composables/api/useApi";
import { usePostEngagement } from "@/composables/posts/usePostEngagement";
import { useGuestbookRepository, type GuestbookEntry, type GuestbookPagination } from "@/composables/useGuestbookRepository";

const repository = useGuestbookRepository();
const engagement = usePostEngagement();
const { locale, t } = useI18n();
const entries = ref<GuestbookEntry[]>([]);
const pagination = ref<GuestbookPagination | null>(null);
const loading = ref(true);
const sending = ref(false);
const error = ref("");
const feedback = ref("");
const form = ref({ name: "", email: "", content: "", website: "" });

const formatDate = (value: string) => new Date(value).toLocaleDateString(locale.value, { dateStyle: "medium" });

const load = async (page = pagination.value?.current_page ?? 1) => {
  loading.value = true;
  error.value = "";
  try {
    const response = await repository.listPublic({ page, perPage: 10 });
    entries.value = response.data;
    pagination.value = response.meta;
  } catch {
    error.value = t("blog.guestbookLoadError");
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
    feedback.value = t("blog.guestbookSent");
  } catch (exception) {
    error.value = exception instanceof ApiError ? exception.message : t("blog.guestbookError");
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
        <p class="text-[10px] uppercase tracking-[0.22em] text-[var(--ts-primary-pink)]">{{ t("blog.guestbookTag") }}</p>
        <h1 class="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">{{ t("blog.guestbookTitle") }}</h1>
        <p class="mt-2 text-xs text-gray-300">{{ t("blog.guestbookSubtitle") }}</p>
      </header>

      <form class="space-y-4 border border-[var(--ui-border)] bg-black/20 p-4" @submit.prevent="submit">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-xs text-gray-200">{{ t("blog.name") }}<input v-model.trim="form.name" required minlength="2" maxlength="80" autocomplete="name" class="mt-1 w-full border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
          <label class="text-xs text-gray-200">{{ t("blog.email") }} <span class="text-gray-500">({{ t("blog.emailPrivate") }})</span><input v-model.trim="form.email" required type="email" maxlength="255" autocomplete="email" class="mt-1 w-full border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
        </div>
        <label class="block text-xs text-gray-200">{{ t("blog.message") }}<textarea v-model.trim="form.content" required maxlength="800" rows="5" class="mt-1 w-full resize-y border border-[var(--ui-border)] bg-black/40 p-2 text-white" /></label>
        <label class="hidden" aria-hidden="true">Website<input v-model="form.website" tabindex="-1" autocomplete="off" /></label>
        <button type="submit" :disabled="sending" class="inline-flex items-center gap-2 border border-[var(--ts-primary-pink)] px-3 py-2 text-xs uppercase text-white transition-colors hover:bg-[var(--ts-primary-pink)] disabled:cursor-wait disabled:opacity-50"><Send :size="14" aria-hidden="true" /> {{ sending ? t("blog.guestbookSending") : t("blog.guestbookSubmit") }}</button>
        <p v-if="feedback" class="text-xs text-green-300">{{ feedback }}</p><p v-if="error" role="alert" class="text-xs text-red-300">{{ error }}</p>
      </form>

      <section aria-labelledby="entries-title">
        <h2 id="entries-title" class="mb-3 text-sm font-bold uppercase text-white">{{ t("blog.approvedMessages") }}</h2>
        <p v-if="loading" class="text-xs text-gray-400">{{ t("blog.openingArchive") }}</p>
        <p v-else-if="!entries.length" class="text-xs text-gray-400">{{ t("blog.noEntries") }}</p>
        <ol v-else class="space-y-3">
          <li v-for="entry in entries" :key="entry.id" class="border-l-2 border-[var(--ts-primary-pink)] bg-black/20 p-3">
            <p class="text-xs font-bold uppercase text-white">{{ entry.name }} <span class="ml-2 font-normal text-gray-500">{{ formatDate(entry.created_at) }}</span></p>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">{{ entry.content }}</p>
          </li>
        </ol>
        <PaginationControls
          v-if="pagination"
          class="mt-4"
          :current-page="pagination.current_page"
          :last-page="pagination.last_page"
          :total="pagination.total"
          :pending="loading"
          :label="t('blog.guestbookPagination')"
          @change="load"
        />
      </section>
    </div>
  </section>
</template>
