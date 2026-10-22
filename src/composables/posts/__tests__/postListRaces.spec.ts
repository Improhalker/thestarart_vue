import { beforeEach, describe, expect, it, vi } from "vitest";
const repo = vi.hoisted(() => ({ getAdminPosts: vi.fn(), getPublicPosts: vi.fn() }));
vi.mock("../usePostRepository", () => ({ usePostsRepository: () => repo }));
beforeEach(() => { vi.clearAllMocks(); vi.resetModules(); });
const response = (id: string) => ({ data: [{ id }], meta: { current_page: 1, last_page: 1, per_page: 8, total: 1 } });

describe("post list request ordering", () => {
  it.each(["public", "admin"])("does not let an old %s request replace the newest filter result", async (area) => {
    const source = area === "public" ? repo.getPublicPosts : repo.getAdminPosts;
    let finishOld!: (value: unknown) => void;
    source.mockImplementationOnce(() => new Promise(resolve => { finishOld = resolve; })).mockResolvedValueOnce(response("new"));
    const state = area === "public" ? (await import("../usePublicPosts")).usePublicPosts() : (await import("../usePosts")).usePosts();
    const load = "fetchPublicPosts" in state ? state.fetchPublicPosts : state.fetchAdminPosts;
    const first = load({ lang: "pt" });
    await load({ lang: "en" });
    expect(state.posts.value[0]?.id).toBe("new");
    finishOld(response("old")); await first;
    expect(state.posts.value[0]?.id).toBe("new");
    expect(state.pending.value).toBe(false);
  });
});
