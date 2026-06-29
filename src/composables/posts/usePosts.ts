import { computed, ref } from "vue";
import { usePostsRepository } from "./usePostRepository";
import type { Post, PostCreateDTO } from "./types";

const posts = ref<Post[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);

const totalPosts = computed(() => posts.value.length);
const publishedPosts = computed(() =>
  posts.value.filter((p) => p.visibility === 1).length
);
const draftPosts = computed(() =>
  posts.value.filter((p) => p.visibility !== 1).length
);

export const usePosts = () => {
  const repo = usePostsRepository();

  const fetchPosts = async () => {
    pending.value = true;
    error.value = null;

    try {
      const response = await repo.getAll();

      posts.value = response.data;

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
        publish_date: post.publish_date,
        visibility: post.visibility === 1 ? 0 : 1,
        lang: post.lang,
        tags: post.tags,
        thumbnail: null,
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
    fetchPosts,
    createPost,
    toggleVisibility,
    deletePost
  };
};