const laravelApiOrigin = process.env.LARAVEL_API_ORIGIN?.replace(/\/+$/, "");

if (!laravelApiOrigin?.startsWith("https://")) {
  throw new Error("LARAVEL_API_ORIGIN must be an HTTPS origin without the /api suffix.");
}

const noStore = [{ key: "Cache-Control", value: "no-store" }];

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
    { source: "/api/:path*", headers: noStore },
    { source: "/sanctum/:path*", headers: noStore },
  ],
};
