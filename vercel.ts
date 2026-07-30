import { routes, type VercelConfig } from "@vercel/config/v1";

const laravelApiOrigin = process.env.LARAVEL_API_ORIGIN?.replace(/\/+$/, "");

if (!laravelApiOrigin?.startsWith("https://")) {
  throw new Error("LARAVEL_API_ORIGIN must be an HTTPS origin without the /api suffix.");
}

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/:path*", `${laravelApiOrigin}/api/:path*`),
    routes.rewrite("/sanctum/:path*", `${laravelApiOrigin}/sanctum/:path*`),
    routes.rewrite("/:path*", "/index.html"),
  ],
  headers: [
    routes.header("/api/:path*", [{ key: "Cache-Control", value: "no-store" }]),
    routes.header("/sanctum/:path*", [{ key: "Cache-Control", value: "no-store" }]),
  ],
};
