import { useApi } from "../api/useApi";
import type {
  AdminPostListFilters,
  PaginationMeta,
  Post,
  PostCreateDTO,
  PublicLikeResult,
  PublicComment,
  AdminPostComment,
  VisitorIdentity,
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

type BackgroundRequestOptions = {
  /**
   * Solicita ao navegador que tente concluir a mutação mesmo durante a saída
   * da página. O payload de likes é pequeno e cabe no limite de keepalive.
   */
  keepalive?: boolean;
};

type PublicCacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const PUBLIC_POST_CACHE_PREFIX = "thestarart:posts:public:v1:";
const PUBLIC_POST_CACHE_TTL_MS = 5 * 60 * 1000;

const publicCache = new Map<string, PublicCacheEntry<unknown>>();
const publicRequests = new Map<string, Promise<unknown>>();
let publicCacheGeneration = 0;

const cacheStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const normalizeTags = (tags: unknown): string[] => (
  Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : []
);

const clonePublicPostSummary = (post: PublicPostSummary): PublicPostSummary => ({
  ...post,
  tags: normalizeTags(post.tags),
});

const clonePublicPost = (post: PublicPost): PublicPost => ({
  ...clonePublicPostSummary(post),
  content: post.content,
});

const clonePublicPostListResponse = (response: PostListResponse<PublicPostSummary>): PostListResponse<PublicPostSummary> => ({
  data: response.data.map(clonePublicPostSummary),
  meta: { ...response.meta },
});

const clonePublicPostResponse = (response: { data: PublicPost }): { data: PublicPost } => ({
  data: clonePublicPost(response.data),
});

const normalizePostListResponse = <T extends PublicPostSummary>(
  response: PostListResponse<T>,
): PostListResponse<T> => ({
  ...response,
  data: response.data.map((post) => ({
    ...post,
    tags: normalizeTags(post.tags),
  })),
});

const normalizePostResponse = (response: PostCreateResponse): PostCreateResponse => ({
  data: {
    ...response.data,
    tags: normalizeTags(response.data.tags),
  },
});

const readPublicCache = <T>(key: string): T | null => {
  const now = Date.now();
  const inMemoryEntry = publicCache.get(key) as PublicCacheEntry<T> | undefined;

  if (inMemoryEntry?.expiresAt && inMemoryEntry.expiresAt > now) return inMemoryEntry.value;
  if (inMemoryEntry) publicCache.delete(key);

  try {
    const rawEntry = cacheStorage()?.getItem(key);
    if (!rawEntry) return null;

    const entry = JSON.parse(rawEntry) as Partial<PublicCacheEntry<T>>;
    if (typeof entry.expiresAt !== "number" || entry.expiresAt <= now || entry.value === undefined) {
      cacheStorage()?.removeItem(key);
      return null;
    }

    const cacheEntry = { expiresAt: entry.expiresAt, value: entry.value } as PublicCacheEntry<T>;
    publicCache.set(key, cacheEntry);

    return cacheEntry.value;
  } catch {
    try {
      cacheStorage()?.removeItem(key);
    } catch {
      // O cache é opcional e não pode impedir a leitura pública do blog.
    }

    return null;
  }
};

const writePublicCache = <T>(key: string, value: T) => {
  const entry: PublicCacheEntry<T> = {
    expiresAt: Date.now() + PUBLIC_POST_CACHE_TTL_MS,
    value,
  };

  publicCache.set(key, entry);

  try {
    cacheStorage()?.setItem(key, JSON.stringify(entry));
  } catch {
    // O cache em memória continua disponível quando o storage não puder ser usado.
  }
};

const invalidatePublicPostCache = () => {
  publicCacheGeneration += 1;
  publicCache.clear();
  publicRequests.clear();

  try {
    const storage = cacheStorage();
    if (!storage) return;

    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (key?.startsWith(PUBLIC_POST_CACHE_PREFIX)) storage.removeItem(key);
    }
  } catch {
    // A invalidação persistida é uma otimização; a memória já foi limpa.
  }
};

const requestPublicResource = <T>(
  key: string,
  request: () => Promise<T>,
  clone: (value: T) => T,
): Promise<T> => {
  const cached = readPublicCache<T>(key);
  if (cached) return Promise.resolve(clone(cached));

  const pending = publicRequests.get(key) as Promise<T> | undefined;
  if (pending) return pending.then(clone);

  const requestGeneration = publicCacheGeneration;
  const pendingRequest = request()
    .then((response) => {
      if (requestGeneration === publicCacheGeneration) writePublicCache(key, clone(response));

      return response;
    })
    .finally(() => {
      if (publicRequests.get(key) === pendingRequest) publicRequests.delete(key);
    });

  publicRequests.set(key, pendingRequest);

  return pendingRequest.then(clone);
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

      const path = `/public/posts${params.size ? `?${params}` : ""}`;

      return requestPublicResource(
        `${PUBLIC_POST_CACHE_PREFIX}list:${params.toString()}`,
        () => client<PostListResponse<PublicPostSummary>>(path, { method: "GET" }),
        clonePublicPostListResponse,
      );
    },

    getAdminPosts(filters: AdminPostListFilters = {}): Promise<PostListResponse<Post>> {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.trashed) params.set("trashed", filters.trashed);
      if (filters.lang) params.set("lang", filters.lang);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.perPage) params.set("per_page", String(filters.perPage));

      return client<PostListResponse<Post>>(`/admin/posts${params.size ? `?${params}` : ""}`, {
        method: "GET",
      }).then(normalizePostListResponse);
    },

    async create(data: PostCreateDTO): Promise<PostCreateResponse> {
      const response = await client<PostCreateResponse>("/admin/posts", {
        method: "POST",
        body: toFormData(data),
      });

      invalidatePublicPostCache();

      return normalizePostResponse(response);
    },

    async update(id: string, data: PostCreateDTO): Promise<PostCreateResponse> {
      const response = await client<PostCreateResponse>(`/admin/posts/${id}`, {
        method: "POST",
        body: toFormData(data),
        headers: {
          "X-HTTP-Method-Override": "PUT",
        },
      });

      invalidatePublicPostCache();

      return normalizePostResponse(response);
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
      return client<PostCreateResponse>(`/admin/posts/${id}`, {
        method: "GET",
      }).then(normalizePostResponse);
    },

    getPublicPost(slug: string): Promise<{ data: PublicPost }> {
      const encodedSlug = encodeURIComponent(slug);

      return requestPublicResource(
        `${PUBLIC_POST_CACHE_PREFIX}post:${encodedSlug}`,
        () => client<{ data: PublicPost }>(`/public/posts/${encodedSlug}`, { method: "GET" }),
        clonePublicPostResponse,
      );
    },

    recordPublicView(slug: string, visitorId: string): Promise<{ data: PublicViewResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
    },

    getPublicLikeState(slug: string): Promise<{ data: PublicLikeResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/likes`, {
        method: "GET",
      });
    },

    addPublicLike(
      slug: string,
      identity: VisitorIdentity | null,
      options: BackgroundRequestOptions = {},
    ): Promise<{ data: PublicLikeResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/likes`, {
        method: "POST",
        keepalive: options.keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identity ?? {}),
      });
    },

    removePublicLike(
      slug: string,
      options: BackgroundRequestOptions = {},
    ): Promise<{ data: PublicLikeResult }> {
      return client(`/public/posts/${encodeURIComponent(slug)}/likes`, {
        method: "DELETE",
        keepalive: options.keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    },

    getPublicComments(slug: string): Promise<PostListResponse<PublicComment>> {
      return client(`/public/posts/${encodeURIComponent(slug)}/comments`, { method: "GET" });
    },

    createPublicComment(slug: string, payload: VisitorIdentity & { content: string; website?: string }) {
      return client<{ data: { id: string; status: string }; message: string }>(`/public/posts/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },

    getAdminComments(filters: { status?: AdminPostComment["status"]; trashed?: "without" | "only"; postId?: string; page?: number } = {}) {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.trashed) params.set("trashed", filters.trashed);
      if (filters.postId) params.set("post_id", filters.postId);
      if (filters.page) params.set("page", String(filters.page));
      return client<PostListResponse<AdminPostComment>>(`/admin/comments${params.size ? `?${params}` : ""}`, { method: "GET" });
    },

    updateAdminComment(id: string, status: AdminPostComment["status"]) {
      return client<{ data: AdminPostComment }>(`/admin/comments/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
    },

    deleteAdminComment(id: string) {
      return client(`/admin/comments/${id}`, { method: "DELETE" });
    },

    async delete(id: string) {
      const response = await client(`/admin/posts/${id}`, {
        method: "DELETE",
      });

      invalidatePublicPostCache();

      return response;
    },
  };
};
