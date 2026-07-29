import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveApiBaseUrl, resolveCsrfUrl, useApi } from "../useApi";

describe("useApi deployment topology", () => {
  it("uses the Vercel same-origin proxy in production", () => {
    expect(resolveApiBaseUrl(false, "https://api.example.test/api")).toBe("/api");
    expect(resolveCsrfUrl("/api", "https://frontend.vercel.app")).toBe(
      "https://frontend.vercel.app/sanctum/csrf-cookie",
    );
  });

  it("keeps the configurable Laravel URL for local development", () => {
    expect(resolveApiBaseUrl(true, "http://localhost:8000/api/")).toBe(
      "http://localhost:8000/api",
    );
  });

  it("does not add a CORS-preflight header to public GET requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await useApi().client("/musics", { method: "GET" });

    const options = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(options.headers).has("X-Requested-With")).toBe(false);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
