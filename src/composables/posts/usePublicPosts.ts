import { getCurrentScope, onScopeDispose, ref } from "vue";
import { usePostsRepository } from "./usePostRepository";
import type { PaginationMeta, PublicPostListFilters, PublicPostSummary } from "./types";

export const usePublicPosts = () => {
  const repository = usePostsRepository();
  const posts = ref<PublicPostSummary[]>([]);
  const pagination = ref<PaginationMeta | null>(null);
  const pending = ref(false);
  const error = ref<string | null>(null);
  let requestId = 0;
  if (getCurrentScope()) onScopeDispose(() => { requestId++; });

  const fetchPublicPosts = async (filters: PublicPostListFilters = {}) => {
    const currentRequest = ++requestId;
    pending.value = true;
    error.value = null;

    try {
      const response = await repository.getPublicPosts(filters);
      if (currentRequest !== requestId) return;
      posts.value = response.data;
      pagination.value = response.meta;

      return response;
    } catch {
      if (currentRequest !== requestId) return;
      error.value = "Erro ao carregar posts";
    } finally {
      if (currentRequest === requestId) pending.value = false;
    }
  };

  return {
    posts,
    pagination,
    pending,
    error,
    fetchPublicPosts,
  };
};
