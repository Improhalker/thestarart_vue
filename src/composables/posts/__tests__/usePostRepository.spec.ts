import { beforeEach, describe, expect, it, vi } from "vitest";

const { client } = vi.hoisted(() => ({
  client: vi.fn(),
}));

vi.mock("@/composables/api/useApi", () => ({
  useApi: () => ({ client }),
}));

vi.mock("@/utils/toFormData", () => ({
  toFormData: vi.fn(),
}));

const summary = {
  id: "post-1",
  title: "Post cacheado",
  slug: "post-cacheado",
  excerpt: "Resumo",
  thumbnail: null,
  tags: ["dev"],
  published_at: "2026-07-23T12:00:00.000Z",
  lang: "pt",
  views_count: 1,
  likes_count: 2,
};

const listResponse = {
  data: [summary],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 1,
  },
};

const postResponse = {
  data: {
    ...summary,
    content: "<p>Conteúdo público</p>",
  },
};

describe("usePostsRepository public cache", () => {
  beforeEach(() => {
    vi.resetModules();
    client.mockReset();
    window.sessionStorage.clear();
  });

  it("deduplicates a public listing request and reuses it during the session", async () => {
    let resolveRequest!: (value: typeof listResponse) => void;
    client.mockImplementation(
      () => new Promise<typeof listResponse>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { usePostsRepository } = await import("../usePostRepository");
    const repository = usePostsRepository();
    const firstRequest = repository.getPublicPosts({ page: 1, perPage: 8 });
    const duplicateRequest = repository.getPublicPosts({ page: 1, perPage: 8 });

    expect(client).toHaveBeenCalledTimes(1);

    resolveRequest(listResponse);
    await Promise.all([firstRequest, duplicateRequest]);

    vi.resetModules();
    const { usePostsRepository: useReloadedPostsRepository } = await import("../usePostRepository");
    const cachedResponse = await useReloadedPostsRepository().getPublicPosts({ page: 1, perPage: 8 });

    expect(client).toHaveBeenCalledTimes(1);
    expect(cachedResponse).toEqual(listResponse);
  });

  it("caches a public post by slug and invalidates public data after an admin deletion", async () => {
    client
      .mockResolvedValueOnce(postResponse)
      .mockResolvedValueOnce({ message: "deleted" })
      .mockResolvedValueOnce(postResponse);

    const { usePostsRepository } = await import("../usePostRepository");
    const repository = usePostsRepository();

    await repository.getPublicPost(summary.slug);
    await repository.getPublicPost(summary.slug);
    expect(client).toHaveBeenCalledTimes(1);

    await repository.delete(summary.id);
    await repository.getPublicPost(summary.slug);

    expect(client).toHaveBeenCalledTimes(3);
  });

  it("passes keepalive for a small like mutation that must survive page exit when possible", async () => {
    client.mockResolvedValue({
      data: { liked: true, likes_count: 3, changed: true },
    });

    const { usePostsRepository } = await import("../usePostRepository");
    await usePostsRepository().addPublicLike(
      "post-cacheado",
      "4da803c4-88b6-458a-b070-97c9d0b80853",
      { keepalive: true },
    );

    expect(client).toHaveBeenCalledWith(
      "/public/posts/post-cacheado/likes",
      expect.objectContaining({ method: "POST", keepalive: true }),
    );
  });
});
