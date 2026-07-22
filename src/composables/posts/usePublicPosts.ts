import { ref } from "vue";
import { usePostsRepository } from "./usePostRepository";
import type { PaginationMeta, PublicPostListFilters, PublicPostSummary } from "./types";

export const usePublicPosts = () => {
  const repository = usePostsRepository();
  const posts = ref<PublicPostSummary[]>([]);
  const pagination = ref<PaginationMeta | null>(null);
  const pending = ref(false);
  const error = ref<string | null>(null);

  const fetchPublicPosts = async (filters: PublicPostListFilters = {}) => {
    pending.value = true;
    error.value = null;

    try {
      const response = await repository.getPublicPosts(filters);
      posts.value = response.data;
      pagination.value = response.meta;

      return response;
    } catch {
      error.value = "Erro ao carregar posts";
    } finally {
      pending.value = false;
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
