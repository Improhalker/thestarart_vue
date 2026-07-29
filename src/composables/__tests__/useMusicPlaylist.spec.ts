import { beforeEach, describe, expect, it, vi } from "vitest";

const { getPublicPlaylist } = vi.hoisted(() => ({
  getPublicPlaylist: vi.fn(),
}));

vi.mock("@/services/MusicService", () => ({
  MusicService: { getPublicPlaylist },
}));

const tracks = [
  {
    id: 2,
    youtube_video_id: "dQw4w9WgXcQ",
    title: "Segunda",
    artist: null,
    thumbnail_url: "https://example.test/2.jpg",
    personal_note: null,
    position: 2,
  },
  {
    id: 1,
    youtube_video_id: "zMVxXzB38Cs",
    title: "Primeira",
    artist: "Artista",
    thumbnail_url: "https://example.test/1.jpg",
    personal_note: "Nota",
    position: 1,
  },
];

describe("useMusicPlaylist", () => {
  beforeEach(() => {
    vi.resetModules();
    getPublicPlaylist.mockReset();
    window.localStorage.clear();
  });

  it("loads, orders and wraps the public playlist", async () => {
    getPublicPlaylist.mockResolvedValue({ data: tracks });
    const { useMusicPlaylist } = await import("../useMusicPlaylist");
    const playlist = useMusicPlaylist();

    await playlist.load();

    expect(playlist.state.value).toBe("ready");
    expect(playlist.currentMusic.value?.id).toBe(1);
    expect(playlist.trackLabel.value).toBe("TRACK 01/02");

    playlist.previous();
    expect(playlist.currentMusic.value?.id).toBe(2);
    playlist.next();
    expect(playlist.currentMusic.value?.id).toBe(1);
  });

  it("reuses a pending playlist load", async () => {
    let resolveRequest!: (value: { data: typeof tracks }) => void;
    getPublicPlaylist.mockImplementation(
      () => new Promise<{ data: typeof tracks }>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { useMusicPlaylist } = await import("../useMusicPlaylist");
    const playlist = useMusicPlaylist();
    const firstLoad = playlist.load();
    const duplicateLoad = playlist.load();

    expect(duplicateLoad).toBe(firstLoad);
    expect(getPublicPlaylist).toHaveBeenCalledTimes(1);

    resolveRequest({ data: tracks });
    await firstLoad;

    expect(playlist.state.value).toBe("ready");
  });

  it("restores only a track that is still returned by the public API", async () => {
    window.localStorage.setItem("thestarart:music:last-track", "999");
    getPublicPlaylist.mockResolvedValue({ data: tracks });
    const { useMusicPlaylist } = await import("../useMusicPlaylist");
    const playlist = useMusicPlaylist();

    await playlist.load();

    expect(playlist.currentMusic.value?.id).toBe(1);
    expect(window.localStorage.getItem("thestarart:music:last-track")).toBe("1");
  });

  it("exposes empty and API error states without retaining stale tracks", async () => {
    getPublicPlaylist.mockResolvedValueOnce({ data: [] });
    const { useMusicPlaylist } = await import("../useMusicPlaylist");
    const playlist = useMusicPlaylist();

    await playlist.load();
    expect(playlist.state.value).toBe("empty");
    expect(playlist.currentMusic.value).toBeNull();

    getPublicPlaylist.mockRejectedValueOnce(new Error("network"));
    await playlist.load();
    expect(playlist.state.value).toBe("error");
    expect(playlist.playlist.value).toEqual([]);
  });

  it("skips an unavailable video and stops when every video is unavailable", async () => {
    getPublicPlaylist.mockResolvedValue({ data: tracks });
    const { useMusicPlaylist } = await import("../useMusicPlaylist");
    const playlist = useMusicPlaylist();

    await playlist.load();
    expect(playlist.markCurrentVideoUnavailable()?.id).toBe(2);
    expect(playlist.markCurrentVideoUnavailable()).toBeNull();
  });
});
