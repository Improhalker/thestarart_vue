<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Check, CircleX, Mail, MessageSquareWarning, Trash2 } from "lucide-vue-next";
import { usePostsRepository } from "@/composables/posts/usePostRepository";
import type { AdminPostComment } from "@/composables/posts/types";

type CommentFilter = "all" | AdminPostComment["status"] | "deleted";

const repository = usePostsRepository();
const comments = ref<AdminPostComment[]>([]);
const filter = ref<CommentFilter>("all");
const pending = ref(true);
const error = ref(false);
const actionInProgress = ref<string | null>(null);

const statusLabel: Record<AdminPostComment["status"], string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  spam: "Spam",
};

const statusClass: Record<AdminPostComment["status"], string> = {
  pending: "bg-amber-300",
  approved: "bg-emerald-300",
  rejected: "bg-red-200",
  spam: "bg-fuchsia-200",
};

const load = async () => {
  pending.value = true;
  error.value = false;

  try {
    comments.value = (await repository.getAdminComments({
      status: filter.value === "all" || filter.value === "deleted" ? undefined : filter.value,
      trashed: filter.value === "deleted" ? "only" : "without",
    })).data;
  } catch {
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const moderate = async (comment: AdminPostComment, nextStatus: AdminPostComment["status"]) => {
  if (comment.status === nextStatus || actionInProgress.value) return;

  actionInProgress.value = comment.id;
  try {
    const response = await repository.updateAdminComment(comment.id, nextStatus);
    const index = comments.value.findIndex(({ id }) => id === comment.id);

    if (index === -1) return;
    if (filter.value !== "all" && filter.value !== nextStatus) {
      comments.value.splice(index, 1);
      return;
    }

    comments.value[index] = response.data;
  } finally {
    actionInProgress.value = null;
  }
};

const remove = async (comment: AdminPostComment) => {
  if (actionInProgress.value || !window.confirm("Excluir este comentário? Ele ficará disponível apenas no filtro Excluídos.")) return;

  actionInProgress.value = comment.id;
  try {
    await repository.deleteAdminComment(comment.id);
    comments.value = comments.value.filter(({ id }) => id !== comment.id);
  } finally {
    actionInProgress.value = null;
  }
};

onMounted(load);
</script>

<template>
  <section class="space-y-4">
    <header class="flex flex-col gap-3 border-b-2 border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.18em] text-ts-pink">Inbox_Moderation.exe</p>
        <h1 class="text-2xl font-black uppercase">Moderação de comentários</h1>
        <p class="mt-1 text-xs text-black/65">E-mails são visíveis somente nesta área administrativa.</p>
      </div>
      <label class="grid gap-1 text-xs font-bold uppercase">
        Filtro
        <select v-model="filter" class="min-h-10 border-2 border-black bg-white px-2 normal-case" @change="load">
          <option value="all">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovados</option>
          <option value="rejected">Rejeitados</option>
          <option value="spam">Spam</option>
          <option value="deleted">Excluídos</option>
        </select>
      </label>
    </header>

    <p v-if="pending" class="py-6 text-sm font-bold">Carregando comentários...</p>
    <p v-else-if="error" class="border-2 border-red-800 bg-red-100 p-3 text-sm font-bold text-red-900" role="alert">Não foi possível carregar os comentários.</p>
    <p v-else-if="!comments.length" class="border-2 border-dashed border-black/50 p-6 text-center text-sm text-black/65">Nenhum comentário encontrado.</p>

    <ul v-else class="space-y-3">
      <li v-for="comment in comments" :key="comment.id" class="border-2 border-black bg-white p-3 shadow-[3px_3px_0_black] sm:p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate text-xs font-black uppercase">{{ comment.post.title }}</p>
              <span class="border border-black px-2 py-0.5 text-[10px] font-black uppercase" :class="comment.deleted_at ? 'bg-gray-300' : statusClass[comment.status]">
                {{ comment.deleted_at ? "Excluído" : statusLabel[comment.status] }}
              </span>
            </div>
            <p class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"><strong>{{ comment.name }}</strong><span class="inline-flex items-center gap-1 text-black/65"><Mail :size="13" />{{ comment.email }}</span></p>
          </div>
          <p class="shrink-0 text-[11px] font-bold text-black/60">{{ new Date(comment.created_at).toLocaleString("pt-BR") }}</p>
        </div>

        <p class="mt-3 whitespace-pre-wrap border-l-2 border-ts-pink pl-3 text-sm">{{ comment.content }}</p>

        <div v-if="!comment.deleted_at" class="mt-4 grid grid-cols-2 gap-2 text-xs sm:flex">
          <button type="button" class="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1 border-2 border-black bg-emerald-200 px-3 py-2 font-bold disabled:cursor-wait disabled:opacity-50" :disabled="actionInProgress === comment.id" @click="moderate(comment, 'approved')"><Check :size="14" /> Aprovar</button>
          <button type="button" class="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1 border-2 border-black bg-amber-200 px-3 py-2 font-bold disabled:cursor-wait disabled:opacity-50" :disabled="actionInProgress === comment.id" @click="moderate(comment, 'rejected')"><CircleX :size="14" /> Rejeitar</button>
          <button type="button" class="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1 border-2 border-black bg-fuchsia-200 px-3 py-2 font-bold disabled:cursor-wait disabled:opacity-50" :disabled="actionInProgress === comment.id" @click="moderate(comment, 'spam')"><MessageSquareWarning :size="14" /> Spam</button>
          <button type="button" class="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1 border-2 border-red-800 bg-red-100 px-3 py-2 font-bold text-red-900 disabled:cursor-wait disabled:opacity-50" :disabled="actionInProgress === comment.id" @click="remove(comment)"><Trash2 :size="14" /> Excluir</button>
        </div>
      </li>
    </ul>
  </section>
</template>
