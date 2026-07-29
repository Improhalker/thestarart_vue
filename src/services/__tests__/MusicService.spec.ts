import { beforeEach, describe, expect, it, vi } from "vitest";

const { client, requestCsrfCookie } = vi.hoisted(() => ({
  client: vi.fn(),
  requestCsrfCookie: vi.fn(),
}));

vi.mock("@/composables/api/useApi", () => ({
  useApi: () => ({ client, requestCsrfCookie }),
}));

const publicTrack = {
  id: 1,
  youtube_video_id: "dQw4w9WgXcQ",
  title: "Faixa pública",
  artist: null,
  thumbnail_url: "https://example.test/thumbnail.jpg",
  personal_note: null,
  position: 1,
};

describe("MusicService", () => {
  beforeEach(() => {
    vi.resetModules();
    client.mockReset();
    requestCsrfCookie.mockReset();
    window.sessionStorage.clear();
  });

  it("deduplicates and reuses the public playlist cache during the session", async () => {
    client.mockResolvedValue({ data: [publicTrack] });
    const { MusicService } = await import("../MusicService");

    const [first, second] = await Promise.all([
      MusicService.getPublicPlaylist(),
      MusicService.getPublicPlaylist(),
    ]);

    expect(client).toHaveBeenCalledTimes(1);
    expect(first).toEqual({ data: [publicTrack] });
    expect(second).toEqual({ data: [publicTrack] });

    vi.resetModules();
    const { MusicService: reloadedMusicService } = await import("../MusicService");
    const cached = await reloadedMusicService.getPublicPlaylist();

    expect(client).toHaveBeenCalledTimes(1);
    expect(cached).toEqual({ data: [publicTrack] });
  });

  it("deduplicates administrative requests without persisting their payload", async () => {
    let resolveRequest!: (value: { data: [] }) => void;
    client.mockImplementation(
      () => new Promise<{ data: [] }>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { MusicService } = await import("../MusicService");
    const firstRequest = MusicService.getAdminPlaylist();
    const duplicateRequest = MusicService.getAdminPlaylist();

    expect(duplicateRequest).toBe(firstRequest);
    expect(client).toHaveBeenCalledTimes(1);

    resolveRequest({ data: [] });
    await firstRequest;

    expect(window.sessionStorage.getItem("thestarart:music:public-playlist:v1")).toBeNull();
  });
});
