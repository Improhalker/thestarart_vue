import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prepareCsrfCookie, show, syncLike } = vi.hoisted(() => ({
  prepareCsrfCookie: vi.fn(),
  show: vi.fn(),
  syncLike: vi.fn(),
}));

vi.mock("@/composables/posts/usePostEngagement", () => ({
  usePostEngagement: () => ({
    prepareCsrfCookie,
    syncLike,
  }),
}));

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({ show }),
}));

describe("useOptimisticLikes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    prepareCsrfCookie.mockReset();
    show.mockReset();
    syncLike.mockReset();
    prepareCsrfCookie.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates the icon and count before the background request completes", async () => {
    syncLike.mockResolvedValue({
      data: { liked: true, likes_count: 125, changed: true },
    });

    const { useOptimisticLikes } = await import("../useOptimisticLikes");
    const likes = useOptimisticLikes();
    likes.initialize("post-premium", { liked: false, likesCount: 124 });

    likes.toggle("post-premium");

    expect(likes.stateFor("post-premium")).toEqual({ liked: true, likesCount: 125 });
    expect(syncLike).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(250);

    expect(syncLike).toHaveBeenCalledTimes(1);
    expect(syncLike).toHaveBeenCalledWith("post-premium", true, { keepalive: true });
    expect(likes.stateFor("post-premium")).toEqual({ liked: true, likesCount: 125 });
  });

  it("consolidates rapid toggles into one request with the latest intended state", async () => {
    syncLike.mockResolvedValue({
      data: { liked: true, likes_count: 10, changed: true },
    });

    const { useOptimisticLikes } = await import("../useOptimisticLikes");
    const likes = useOptimisticLikes();
    likes.initialize("post-rapido", { liked: false, likesCount: 9 });

    likes.toggle("post-rapido");
    likes.toggle("post-rapido");
    likes.toggle("post-rapido");

    expect(likes.stateFor("post-rapido")).toEqual({ liked: true, likesCount: 10 });

    await vi.advanceTimersByTimeAsync(250);

    expect(syncLike).toHaveBeenCalledTimes(1);
    expect(syncLike).toHaveBeenCalledWith("post-rapido", true, { keepalive: true });
  });

  it("queues the latest action when the visitor changes their mind during a request", async () => {
    let confirmFirstRequest!: (value: { data: { liked: boolean; likes_count: number; changed: boolean } }) => void;
    syncLike
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            confirmFirstRequest = resolve;
          }),
      )
      .mockResolvedValueOnce({
        data: { liked: false, likes_count: 2, changed: true },
      });

    const { useOptimisticLikes } = await import("../useOptimisticLikes");
    const likes = useOptimisticLikes();
    likes.initialize("post-em-fila", { liked: false, likesCount: 2 });

    likes.toggle("post-em-fila");
    await vi.advanceTimersByTimeAsync(250);
    likes.toggle("post-em-fila");

    expect(likes.stateFor("post-em-fila")).toEqual({ liked: false, likesCount: 2 });

    confirmFirstRequest({
      data: { liked: true, likes_count: 3, changed: true },
    });
    await vi.advanceTimersByTimeAsync(0);

    expect(syncLike).toHaveBeenCalledTimes(2);
    expect(syncLike).toHaveBeenLastCalledWith("post-em-fila", false, { keepalive: true });
  });

  it("restores the confirmed state and displays a discreet error when synchronization fails", async () => {
    syncLike.mockRejectedValue(new Error("network unavailable"));

    const { useOptimisticLikes } = await import("../useOptimisticLikes");
    const likes = useOptimisticLikes();
    likes.initialize("post-com-erro", { liked: false, likesCount: 7 });

    likes.toggle("post-com-erro");
    expect(likes.stateFor("post-com-erro")).toEqual({ liked: true, likesCount: 8 });

    await vi.advanceTimersByTimeAsync(250);

    expect(likes.stateFor("post-com-erro")).toEqual({ liked: false, likesCount: 7 });
    expect(show).toHaveBeenCalledWith(
      "Não foi possível registrar sua curtida. Tente novamente.",
      { tone: "error" },
    );
  });
});
