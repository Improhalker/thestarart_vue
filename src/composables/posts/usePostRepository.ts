import { useApi } from "../api/useApi";
import type { Post, PostCreateDTO } from "./types";
import { toFormData } from "../../utils/toFormData";

type PostListResponse = {
  data: Post[];
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
    getAll(): Promise<PostListResponse> {
      return client("/api/posts", {
        method: "GET",
      });
    },

    create(data: PostCreateDTO): Promise<PostCreateResponse> {
      return client("/api/posts", {
        method: "POST",
        body: toFormData(data),
      });
    },

    update(id: string, data: PostCreateDTO): Promise<{ data: Post }> {
      return client(`/api/posts/${id}`, {
        method: "POST", 
        body: toFormData(data),
      });
    },

    uploadThumbnail(formData: FormData) {
      return client("/api/upload/thumbnail", {
        method: "POST",
        body: formData,
      });
    },

    uploadImage(formData: FormData): Promise<UploadImageResponse> {
      return client("/api/upload/image", {
        method: "POST",
        body: formData,
      });
    },

    getById(id: string): Promise<{ data: Post }> {
      return client(`/api/posts/id/${id}`, {
        method: "GET",
      });
    },

    getBySlug(id: string): Promise<{ data: Post }> {
      return client(`/api/posts/slug/${id}`, {
        method: "GET",
      });
    },
  };
};