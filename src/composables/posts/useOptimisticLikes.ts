import { reactive } from "vue";
import { useToast } from "@/composables/useToast";
import { usePostEngagement } from "./usePostEngagement";
import type { PublicLikeResult } from "./types";

type LikeSnapshot = {
  liked: boolean;
  likesCount: number;
};

type LikeRecord = LikeSnapshot & {
  confirmedLiked: boolean;
  confirmedLikesCount: number;
  desiredLiked: boolean;
  isSyncing: boolean;
};

type PendingLike = {
  timer: ReturnType<typeof setTimeout> | null;
};

const SYNC_DEBOUNCE_MS = 250;

// O estado e a fila pertencem ao módulo, não à view. Assim, uma navegação SPA
// não cancela uma curtida já iniciada.
const records = reactive(new Map<string, LikeRecord>());
const pendingLikes = new Map<string, PendingLike>();

const engagement = usePostEngagement();
const { show } = useToast();

const currentState = (record: LikeRecord): LikeSnapshot => ({
  liked: record.liked,
  likesCount: record.likesCount,
});

const projectedLikesCount = (record: LikeRecord) => {
  if (record.desiredLiked === record.confirmedLiked) return record.confirmedLikesCount;

  return Math.max(0, record.confirmedLikesCount + (record.desiredLiked ? 1 : -1));
};

const updateOptimisticState = (record: LikeRecord) => {
  record.liked = record.desiredLiked;
  record.likesCount = projectedLikesCount(record);
};

const updateConfirmedState = (record: LikeRecord, result: PublicLikeResult) => {
  record.confirmedLiked = result.liked;
  record.confirmedLikesCount = result.likes_count;
  updateOptimisticState(record);
};

const getOrCreateRecord = (slug: string, snapshot: LikeSnapshot = { liked: false, likesCount: 0 }) => {
  const existing = records.get(slug);
  if (existing) return existing;

  const record: LikeRecord = {
    liked: snapshot.liked,
    likesCount: snapshot.likesCount,
    confirmedLiked: snapshot.liked,
    confirmedLikesCount: snapshot.likesCount,
    desiredLiked: snapshot.liked,
    isSyncing: false,
  };

  records.set(slug, record);

  return record;
};

const clearScheduledSync = (slug: string) => {
  const pending = pendingLikes.get(slug);
  if (!pending) return;

  if (pending.timer) clearTimeout(pending.timer);
  pendingLikes.delete(slug);
};

const synchronize = async (slug: string): Promise<void> => {
  const record = records.get(slug);
  if (!record || record.isSyncing || record.desiredLiked === record.confirmedLiked) return;

  record.isSyncing = true;
  const targetLiked = record.desiredLiked;

  try {
    const response = await engagement.syncLike(slug, targetLiked, { keepalive: true });
    updateConfirmedState(record, response.data);
  } catch {
    // O estado otimista só é confirmado após a resposta da API. Em falha,
    // retornamos ao último estado que o servidor confirmou.
    record.desiredLiked = record.confirmedLiked;
    updateOptimisticState(record);
    clearScheduledSync(slug);
    show("Não foi possível registrar sua curtida. Tente novamente.", { tone: "error" });
  } finally {
    record.isSyncing = false;

    // Um novo clique enquanto a requisição estava em voo vira a próxima
    // operação da fila, sem gerar uma tempestade de requests.
    if (record.desiredLiked !== record.confirmedLiked) {
      scheduleSynchronization(slug, 0);
    }
  }
};

const scheduleSynchronization = (slug: string, delay = SYNC_DEBOUNCE_MS) => {
  const record = records.get(slug);
  if (!record || record.isSyncing || record.desiredLiked === record.confirmedLiked) return;

  clearScheduledSync(slug);

  const pending: PendingLike = { timer: null };
  pending.timer = setTimeout(() => {
    pendingLikes.delete(slug);
    void synchronize(slug);
  }, delay);

  pendingLikes.set(slug, pending);
};

const flushPendingLikes = () => {
  for (const [slug, pending] of pendingLikes) {
    if (pending.timer) clearTimeout(pending.timer);
    pendingLikes.delete(slug);
    void synchronize(slug);
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushPendingLikes);
}

export const useOptimisticLikes = () => {
  const initialize = (slug: string, snapshot: LikeSnapshot) => {
    // Ao voltar para o mesmo post, preservar a confirmação/ação já conhecida
    // evita um flicker enquanto a consulta de estado do like é refeita.
    if (records.has(slug)) return;

    getOrCreateRecord(slug, snapshot);
  };

  const reconcile = (slug: string, result: PublicLikeResult) => {
    const record = getOrCreateRecord(slug, {
      liked: result.liked,
      likesCount: result.likes_count,
    });

    updateConfirmedState(record, result);
  };

  const toggle = (slug: string) => {
    const record = getOrCreateRecord(slug);
    record.desiredLiked = !record.liked;
    updateOptimisticState(record);

    // Inicia o pré-flight cedo, mas nunca bloqueia a atualização visual.
    void engagement.prepareCsrfCookie().catch(() => undefined);

    if (record.isSyncing) return;

    if (record.desiredLiked === record.confirmedLiked) {
      clearScheduledSync(slug);
      updateOptimisticState(record);
      return;
    }

    scheduleSynchronization(slug);
  };

  const stateFor = (slug: string): LikeSnapshot | null => {
    const record = records.get(slug);
    return record ? currentState(record) : null;
  };

  return {
    initialize,
    reconcile,
    toggle,
    stateFor,
  };
};
