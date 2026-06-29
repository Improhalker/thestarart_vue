export interface Post {
  id: string;
  user_id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  content: string;
  tags: string[];
  publish_date: string;
  visibility: number;
}

export interface PostCreateDTO {
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: File | null;
  content: string;
  tags: string[];
  publish_date: string;
  visibility: number;
  lang: string;
}