const laravelApiOrigin = process.env.LARAVEL_API_ORIGIN?.replace(/\/+$/, "");

if (!laravelApiOrigin?.startsWith("https://")) {
  throw new Error("LARAVEL_API_ORIGIN must be an HTTPS origin without the /api suffix.");
}

export const config = {
  rewrites: [
    {
      source: "/api/:path*",
      destination: `${laravelApiOrigin}/api/:path*`,
    },
    {
      source: "/sanctum/:path*",
      destination: `${laravelApiOrigin}/sanctum/:path*`,
    },
    {
      source: "/:path*",
      destination: "/index.html",
    },
  ],
  headers: [
    {
      source: "/api/:path*",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
    {
      source: "/sanctum/:path*",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
  ],
};
