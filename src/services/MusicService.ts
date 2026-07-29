import { useApi } from "@/composables/api/useApi";

export type PublicMusic = {
  id: number;
  youtube_video_id: string;
  title: string;
  artist: string | null;
  thumbnail_url: string;
  personal_note: string | null;
  position: number;
};

export type AdminMusic = PublicMusic & {
  youtube_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MusicPayload = {
  youtube_url: string;
  title: string;
  artist: string | null;
  personal_note: string | null;
  is_active: boolean;
};

type MusicListResponse<TMusic> = {
  data: TMusic[];
};

type MusicResponse<TMusic> = {
  data: TMusic;
};

type PublicPlaylistCache = {
  expiresAt: number;
  data: PublicMusic[];
};

const PUBLIC_PLAYLIST_CACHE_KEY = "thestarart:music:public-playlist:v1";
const PUBLIC_PLAYLIST_CACHE_TTL_MS = 5 * 60 * 1000;

const { client, requestCsrfCookie } = useApi();

let publicPlaylistRequest: Promise<MusicListResponse<PublicMusic>> | null = null;
let adminPlaylistRequest: Promise<MusicListResponse<AdminMusic>> | null = null;
let publicPlaylistCache: PublicPlaylistCache | null = null;

const clonePublicPlaylist = (playlist: PublicMusic[]): PublicMusic[] => playlist.map((music) => ({ ...music }));

const isPublicMusic = (value: unknown): value is PublicMusic => {
  if (!value || typeof value !== "object") return false;

  const music = value as Record<string, unknown>;

  return typeof music.id === "number"
    && typeof music.youtube_video_id === "string"
    && typeof music.title === "string"
    && (typeof music.artist === "string" || music.artist === null)
    && typeof music.thumbnail_url === "string"
    && (typeof music.personal_note === "string" || music.personal_note === null)
    && typeof music.position === "number";
};

const cacheStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const clearPublicPlaylistCache = () => {
  publicPlaylistCache = null;

  try {
    cacheStorage()?.removeItem(PUBLIC_PLAYLIST_CACHE_KEY);
  } catch {
    // O cache é opcional e não deve afetar o gerenciamento da playlist.
  }
};

const readPublicPlaylistCache = (): PublicMusic[] | null => {
  const now = Date.now();
  const inMemoryCache = publicPlaylistCache;

  if (inMemoryCache && inMemoryCache.expiresAt > now) return clonePublicPlaylist(inMemoryCache.data);

  if (inMemoryCache) publicPlaylistCache = null;

  try {
    const rawCache = cacheStorage()?.getItem(PUBLIC_PLAYLIST_CACHE_KEY);
    if (!rawCache) return null;

    const cached = JSON.parse(rawCache) as Partial<PublicPlaylistCache>;
    if (typeof cached.expiresAt !== "number" || cached.expiresAt <= now || !Array.isArray(cached.data) || !cached.data.every(isPublicMusic)) {
      clearPublicPlaylistCache();
      return null;
    }

    publicPlaylistCache = {
      expiresAt: cached.expiresAt,
      data: clonePublicPlaylist(cached.data),
    };

    return clonePublicPlaylist(publicPlaylistCache.data);
  } catch {
    clearPublicPlaylistCache();
    return null;
  }
};

const cachePublicPlaylist = (playlist: PublicMusic[]) => {
  const cache: PublicPlaylistCache = {
    expiresAt: Date.now() + PUBLIC_PLAYLIST_CACHE_TTL_MS,
    data: clonePublicPlaylist(playlist),
  };

  publicPlaylistCache = cache;

  try {
    cacheStorage()?.setItem(PUBLIC_PLAYLIST_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // A resposta continua disponível em memória quando o storage não puder ser usado.
  }
};

const mutation = async <T>(endpoint: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> => {
  await requestCsrfCookie();

  const response = await client<T>(endpoint, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  clearPublicPlaylistCache();

  return response;
};

export const MusicService = {
  getPublicPlaylist(): Promise<MusicListResponse<PublicMusic>> {
    const cachedPlaylist = readPublicPlaylistCache();
    if (cachedPlaylist) return Promise.resolve({ data: cachedPlaylist });

    if (publicPlaylistRequest) return publicPlaylistRequest;

    publicPlaylistRequest = client<MusicListResponse<PublicMusic>>("/musics", { method: "GET" })
      .then((response) => {
        cachePublicPlaylist(response.data);

        return { data: clonePublicPlaylist(response.data) };
      })
      .finally(() => {
        publicPlaylistRequest = null;
      });

    return publicPlaylistRequest;
  },

  getAdminPlaylist(): Promise<MusicListResponse<AdminMusic>> {
    if (adminPlaylistRequest) return adminPlaylistRequest;

    adminPlaylistRequest = client<MusicListResponse<AdminMusic>>("/admin/musics", { method: "GET" })
      .finally(() => {
        adminPlaylistRequest = null;
      });

    return adminPlaylistRequest;
  },

  create(payload: MusicPayload): Promise<MusicResponse<AdminMusic>> {
    return mutation<MusicResponse<AdminMusic>>("/admin/musics", "POST", payload);
  },

  update(id: number, payload: Partial<MusicPayload>): Promise<MusicResponse<AdminMusic>> {
    return mutation<MusicResponse<AdminMusic>>(`/admin/musics/${id}`, "PATCH", payload);
  },

  reorder(items: Array<{ id: number; position: number }>): Promise<MusicListResponse<AdminMusic>> {
    return mutation<MusicListResponse<AdminMusic>>("/admin/musics/reorder", "PATCH", { items });
  },

  delete(id: number): Promise<{ message: string }> {
    return mutation<{ message: string }>(`/admin/musics/${id}`, "DELETE");
  },
};
