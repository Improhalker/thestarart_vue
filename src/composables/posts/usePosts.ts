import { computed, ref } from "vue";
import { usePostsRepository } from "./usePostRepository";
import type { AdminPostListFilters, PaginationMeta, Post, PostCreateDTO } from "./types";

const posts = ref<Post[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const totalPosts = computed(() => pagination.value.total);
const publishedPosts = computed(() =>
  posts.value.filter((p) => p.status === "published").length
);
const draftPosts = computed(() =>
  posts.value.filter((p) => p.status === "draft").length
);
const totalViews = computed(() =>
  posts.value.reduce((total, post) => total + post.views_count, 0)
);
const totalLikes = computed(() =>
  posts.value.reduce((total, post) => total + post.likes_count, 0)
);

export const usePosts = () => {
  const repo = usePostsRepository();

  const fetchAdminPosts = async (filters: AdminPostListFilters = {}) => {
    pending.value = true;
    error.value = null;

    try {
      const response = await repo.getAdminPosts(filters);

      posts.value = response.data;
      pagination.value = response.meta;

    } catch (e) {
      error.value = "Erro ao carregar posts";
    } finally {
      pending.value = false;
    }
  };

  const createPost = async (data: PostCreateDTO) => {
    pending.value = true;
    error.value = null;

    try {
      const response = await repo.create(data);
      const newPost = response.data;

      posts.value.unshift(newPost);

      return newPost;

    } catch (e) {
      error.value = "Erro ao criar post";
      throw e;
    } finally {
      pending.value = false;
    }
  };
  const toggleVisibility = async (post: Post) => {
    pending.value = true;
    error.value = null;

    try {
      const response = await repo.update(post.id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published_at: post.published_at,
        status: post.status === "published" ? "archived" : "published",
        lang: post.lang,
        tags: post.tags,
        thumbnail: null,
        slug_manually_edited: false,
      });

      const index = posts.value.findIndex((p) => p.id === post.id);

      if (index !== -1) {
        posts.value[index] = response.data;
      }
    } catch (e) {
      error.value = "Erro ao atualizar visibilidade";
      throw e;
    } finally {
      pending.value = false;
    }
  };
  const deletePost = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    await repo.delete(id);

    posts.value = posts.value.filter(p => p.id !== id);
  };

  return {
    posts,
    pending,
    error,
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    pagination,
    fetchAdminPosts,
    createPost,
    toggleVisibility,
    deletePost
  };
};
