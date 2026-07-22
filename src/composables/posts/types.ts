export interface PublicPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  tags: string[];
  published_at: string | null;
  lang: string;
  views_count: number;
  likes_count: number;
}

export interface PublicPost extends PublicPostSummary {
  content: string;
}

export interface Post extends PublicPost {
  user_id: number;
  status: "draft" | "scheduled" | "published" | "archived";
  deleted_at?: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicPostListFilters {
  page?: number;
  perPage?: number;
  lang?: "pt" | "en" | "es";
  order?: "asc" | "desc";
}

export interface AdminPostListFilters {
  status?: Post["status"];
  trashed?: "without" | "with" | "only";
  lang?: "pt" | "en" | "es";
  page?: number;
  perPage?: number;
}

export interface PublicViewResult {
  views_count: number;
  recorded: boolean;
}

export interface PublicLikeResult {
  likes_count: number;
  liked: boolean;
  changed?: boolean;
}

export interface PostCreateDTO {
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: File | null;
  content: string;
  tags: string[];
  published_at: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  slug_manually_edited: boolean;
  lang: string;
}
