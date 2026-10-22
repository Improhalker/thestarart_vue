import { routes, type VercelConfig } from "@vercel/config/v1";

// Compatibility during the migration to a non-VITE build-only setting.
// Never fall back in the browser: production requests still use /api.
const configuredOrigin = (process.env.LARAVEL_API_ORIGIN ?? process.env.VITE_API_URL)?.trim();
let apiUrl: URL | undefined;

try {
  apiUrl = configuredOrigin ? new URL(configuredOrigin) : undefined;
} catch {
  // Report the setting name, never its potentially sensitive value.
}

if (!apiUrl || apiUrl.protocol !== "https:" || apiUrl.username || apiUrl.password
  || apiUrl.pathname !== "/" || apiUrl.search || apiUrl.hash) {
  throw new Error("Set LARAVEL_API_ORIGIN (or legacy VITE_API_URL) to an HTTPS origin without credentials, path, query or fragment.");
}

const laravelApiOrigin = apiUrl.origin;

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/sitemap.xml", "/api/sitemap"),
    routes.rewrite("/api/(.*)", `${laravelApiOrigin}/api/$1`),
    routes.rewrite("/sanctum/(.*)", `${laravelApiOrigin}/sanctum/$1`),
    routes.rewrite("/:path*", "/index.html"),
  ],
  headers: [
    routes.header("/api/:path*", [{ key: "Cache-Control", value: "no-store" }]),
    routes.header("/sanctum/:path*", [{ key: "Cache-Control", value: "no-store" }]),
  ],
};
