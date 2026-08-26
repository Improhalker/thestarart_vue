<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGuestbookRepository, type AdminGuestbookEntry } from "@/composables/useGuestbookRepository";

const repository = useGuestbookRepository();
const entries = ref<AdminGuestbookEntry[]>([]);
const status = ref<"" | AdminGuestbookEntry["status"]>("pending");
const pending = ref(true);
const error = ref(false);

const load = async () => {
  pending.value = true; error.value = false;
  try { entries.value = (await repository.listAdmin(status.value || undefined)).data; } catch { error.value = true; } finally { pending.value = false; }
};
const moderate = async (entry: AdminGuestbookEntry, nextStatus: AdminGuestbookEntry["status"]) => Object.assign(entry, (await repository.update(entry.id, nextStatus)).data);
const remove = async (entry: AdminGuestbookEntry) => { if (window.confirm("Remover esta mensagem do guestbook?")) { await repository.remove(entry.id); entries.value = entries.value.filter(({ id }) => id !== entry.id); } };
onMounted(load);
</script>

<template>
  <section class="space-y-4"><header class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3"><div><h1 class="text-xl font-black uppercase">Guestbook: moderação</h1><p class="text-xs text-gray-600">E-mails aparecem somente para usuários autenticados.</p></div><select v-model="status" class="border-2 border-black p-1 text-xs" @change="load"><option value="">Todos</option><option value="pending">Pendentes</option><option value="approved">Aprovados</option><option value="rejected">Rejeitados</option><option value="spam">Spam</option></select></header><p v-if="pending">Carregando mensagens...</p><p v-else-if="error" class="text-red-700">Não foi possível carregar as mensagens.</p><p v-else-if="!entries.length">Nenhuma mensagem encontrada.</p><ul v-else class="space-y-3"><li v-for="entry in entries" :key="entry.id" class="border-2 border-black bg-white p-3 shadow-[3px_3px_0_black]"><p class="text-xs font-bold uppercase">{{ entry.status }}</p><p class="mt-1 text-sm"><strong>{{ entry.name }}</strong> · {{ entry.email }}</p><p class="mt-2 whitespace-pre-wrap text-sm">{{ entry.content }}</p><div class="mt-3 flex flex-wrap gap-2 text-xs"><button class="border border-black px-2 py-1" @click="moderate(entry, 'approved')">Aprovar</button><button class="border border-black px-2 py-1" @click="moderate(entry, 'rejected')">Rejeitar</button><button class="border border-black px-2 py-1" @click="moderate(entry, 'spam')">Spam</button><button class="border border-red-800 px-2 py-1 text-red-800" @click="remove(entry)">Excluir</button></div></li></ul></section>
</template>
