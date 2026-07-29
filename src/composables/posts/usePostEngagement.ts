import { useApi } from "../api/useApi";
import { usePostsRepository } from "./usePostRepository";

const VISITOR_STORAGE_KEY = "thestarart_visitor_id";
let memoryVisitorId: string | null = null;
let csrfCookieRequest: Promise<void> | null = null;

type LikeSyncOptions = {
  keepalive?: boolean;
};

const createAnonymousVisitorId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const value = Math.floor(Math.random() * 16);
    const digit = character === "x" ? value : (value & 0x3) | 0x8;

    return digit.toString(16);
  });
};

const anonymousVisitorId = (): string => {
  if (memoryVisitorId) return memoryVisitorId;

  try {
    const existingId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existingId) {
      memoryVisitorId = existingId;
      return existingId;
    }

    memoryVisitorId = createAnonymousVisitorId();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, memoryVisitorId);
  } catch {
    memoryVisitorId = createAnonymousVisitorId();
  }

  return memoryVisitorId;
};

export const usePostEngagement = () => {
  const postsRepository = usePostsRepository();
  const { requestCsrfCookie } = useApi();

  const visitorId = () => anonymousVisitorId();

  const prepareCsrfCookie = () => {
    if (!csrfCookieRequest) {
      csrfCookieRequest = requestCsrfCookie().finally(() => {
        csrfCookieRequest = null;
      });
    }

    return csrfCookieRequest;
  };

  const syncLike = async (slug: string, liked: boolean, options: LikeSyncOptions = {}) => {
    await prepareCsrfCookie();

    return liked
      ? postsRepository.addPublicLike(slug, visitorId(), options)
      : postsRepository.removePublicLike(slug, visitorId(), options);
  };

  return {
    getLikeState: (slug: string) => postsRepository.getPublicLikeState(slug, visitorId()),

    prepareCsrfCookie,

    async recordView(slug: string) {
      await prepareCsrfCookie();
      return postsRepository.recordPublicView(slug, visitorId());
    },

    async addLike(slug: string) {
      return syncLike(slug, true);
    },

    async removeLike(slug: string) {
      return syncLike(slug, false);
    },

    syncLike,
  };
};
