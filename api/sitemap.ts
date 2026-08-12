import type { IncomingMessage, ServerResponse } from "node:http";

type PublicPost = {
  slug: string;
  published_at: string | null;
};

type PublicPostResponse = {
  data: PublicPost[];
  meta: {
    current_page: number;
    last_page: number;
  };
};

const fallbackSiteUrl = "https://thestarart-vue.vercel.app";
const languages = ["pt", "en", "es"];
const staticRoutes = ["/", "/about", "/blog", "/changelog", "/diary", "/star-station"];

const withoutTrailingSlash = (value: string) => value.replace(/\/$/, "");
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
}[character] as string));

const siteUrl = () => withoutTrailingSlash(
  process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : fallbackSiteUrl),
);

const apiUrl = () => withoutTrailingSlash(process.env.LARAVEL_API_ORIGIN || "");

const publicPosts = async (): Promise<PublicPost[]> => {
  const origin = apiUrl();
  if (!origin) throw new Error("LARAVEL_API_ORIGIN is not configured.");

  const posts: PublicPost[] = [];

  for (const lang of languages) {
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
      const response = await fetch(`${origin}/public/posts?lang=${lang}&per_page=100&page=${page}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Public posts request failed with ${response.status}.`);

      const payload = await response.json() as PublicPostResponse;
      posts.push(...payload.data);
      lastPage = payload.meta.last_page;
      page += 1;
    }
  }

  return posts;
};

export default async function handler(_request: IncomingMessage, response: ServerResponse) {
  try {
    const origin = siteUrl();
    const posts = await publicPosts();
    const urls = [
      ...staticRoutes.map((route) => ({ loc: `${origin}${route === "/" ? "/" : route}`, lastmod: null })),
      ...posts.map((post) => ({
        loc: `${origin}/post/${encodeURIComponent(post.slug)}`,
        lastmod: post.published_at,
      })),
    ];

    const entries = urls.map(({ loc, lastmod }) => [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : null,
      "  </url>",
    ].filter(Boolean).join("\n")).join("\n");

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    response.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
  } catch (error) {
    response.statusCode = 503;
    response.setHeader("Cache-Control", "no-store");
    response.end("Sitemap temporarily unavailable.");
  }
}
