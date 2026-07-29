import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl, resolveCsrfUrl } from "../useApi";

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
});
