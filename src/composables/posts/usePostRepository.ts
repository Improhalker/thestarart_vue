import { useApi } from "../api/useApi";
import type {
  PaginationMeta,
  Post,
  PostCreateDTO,
  PublicLikeResult,
  PublicPost,
  PublicPostListFilters,
  PublicPostSummary,
  PublicViewResult,
} from "./types";
import { toFormData } from "../../utils/toFormData";

type PostListResponse<T> = {
  data: T[];
  meta: PaginationMeta;
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
    getPublicPosts(filters: PublicPostListFilters = {}): Promise<PostListResponse<PublicPostSummary>> {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.perPage) params.set("per_page", String(filters.perPage));
      if (filters.lang) params.set("lang", filters.lang);
      if (filters.order) params.set("order", filters.order);

      return client(`/public/posts${params.size ? `?${params}` : ""}`, {
        method: "GET",
      });
    },

    getAdminPosts(filters: { status?: Post["status"]; trashed?: "without" | "with" | "only" } = {}): Promise<PostListResponse<Post>> {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.trashed) params.set("trashed", filters.trashed);

      return client(`/admin/posts${params.size ? `?${params}` : ""}`, {
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

    getPublicPost(slug: string): Promise<{ data: PublicPost }> {
      return client(`/public/posts/${encodeURIComponent(slug)}`, {
        method: "GET",
      });
    },

    recordPublicView(slug: string, visitorId: string): Promise<{ data: PublicViewResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
    },

    getPublicLikeState(slug: string, visitorId: string): Promise<{ data: PublicLikeResult }> {
      const params = new URLSearchParams({ visitor_id: visitorId });

      return client(`/public/posts/${encodeURIComponent(slug)}/likes?${params}`, {
        method: "GET",
      });
    },

    addPublicLike(slug: string, visitorId: string): Promise<{ data: PublicLikeResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
    },

    removePublicLike(slug: string, visitorId: string): Promise<{ data: PublicLikeResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/likes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
    },

    delete(id: string) {
      return client(`/admin/posts/${id}`, {
        method: "DELETE",
      });
    },
  };
};
