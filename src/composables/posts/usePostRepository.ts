import { useApi } from "../api/useApi";
import type { Post, PostCreateDTO } from "./types";
import { toFormData } from "../../utils/toFormData";

type PostListResponse = {
  data: Post[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type PostCreateResponse = {
  data: Post;
};

type UploadImageResponse = {
  url: string;
};

export const usePostsRepository = () => {
  const { client } = useApi();

  return {
    getPublicPosts(): Promise<PostListResponse> {
      return client("/public/posts", {
        method: "GET",
      });
    },

    getAdminPosts(): Promise<PostListResponse> {
      return client("/admin/posts", {
        method: "GET",
      });
    },

    create(data: PostCreateDTO): Promise<PostCreateResponse> {
      return client("/admin/posts", {
        method: "POST",
        body: toFormData(data),
      });
    },

    update(id: string, data: PostCreateDTO) {
      return client(`/admin/posts/${id}`, {
        method: "POST",
        body: toFormData(data),
        headers: {
          "X-HTTP-Method-Override": "PUT",
        },
      });
    },

    uploadThumbnail(formData: FormData) {
      return client("/admin/posts/thumbnail", {
        method: "POST",
        body: formData,
      });
    },

    uploadImage(formData: FormData): Promise<UploadImageResponse> {
      return client("/upload/image", {
        method: "POST",
        body: formData,
      });
    },

    getAdminPost(id: string): Promise<{ data: Post }> {
      return client(`/admin/posts/${id}`, {
        method: "GET",
      });
    },

    getPublicPost(slug: string): Promise<{ data: Post }> {
      return client(`/public/posts/${encodeURIComponent(slug)}`, {
        method: "GET",
      });
    },

    delete(id: string) {
      return client(`/admin/posts/${id}`, {
        method: "DELETE",
      });
    },
  };
};
