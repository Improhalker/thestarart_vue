// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const loadConfig = async (origin: string | undefined, legacy: string | undefined) => {
  vi.resetModules();
  vi.stubEnv("LARAVEL_API_ORIGIN", origin);
  vi.stubEnv("VITE_API_URL", legacy);
  return import("../../../vercel");
};

describe("Vercel API proxy configuration", () => {
  it("uses the build-only setting and keeps API and Sanctum rewrites", async () => {
    const { config } = await loadConfig("https://api.example.test/", "https://legacy.example.test");
    expect(config.rewrites).toContainEqual(expect.objectContaining({ source: "/api/(.*)", destination: "https://api.example.test/api/$1" }));
    expect(config.rewrites).toContainEqual(expect.objectContaining({ source: "/sanctum/(.*)", destination: "https://api.example.test/sanctum/$1" }));
    expect(config.rewrites?.at(-1)).toEqual(expect.objectContaining({ destination: "/index.html" }));
    expect(config.headers?.every((entry) => Array.isArray(entry.headers))).toBe(true);
  });

  it("accepts the existing production setting during migration", async () => {
    const { config } = await loadConfig(undefined, " https://legacy.example.test/ ");
    expect(config.rewrites).toContainEqual(expect.objectContaining({ destination: "https://legacy.example.test/api/$1" }));
  });

  it.each([undefined, "", "not-a-url", "http://api.example.test", "https://api.example.test/api", "https://user:secret@api.example.test", "https://api.example.test/?q=private", "https://api.example.test/#fragment"])("rejects invalid origins without disclosing their values (%s)", async (origin) => {
    await expect(loadConfig(origin, undefined)).rejects.toThrow("Set LARAVEL_API_ORIGIN");
  });

  it("does not hide an invalid new setting behind a valid legacy one", async () => {
    await expect(loadConfig("http://invalid.example.test", "https://legacy.example.test")).rejects.toThrow("Set LARAVEL_API_ORIGIN");
  });
});
