import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { PublicPost } from "@/composables/posts/types";

export type SeoDefinition = {
  title: string;
  description: string;
  robots?: "index, follow" | "noindex, nofollow";
};

type SeoOptions = SeoDefinition & {
  canonicalPath?: string;
  image?: string | null;
  type?: "website" | "article";
  language?: string;
  articlePublishedAt?: string | null;
};

const siteName = "TheStarArt_";
const fallbackImagePath = "/images/banner.webp";
const defaultSeo: SeoDefinition = {
  title: "TheStarArt_ | Arte, tecnologia, jogos e experiências",
  description: "Universo digital pessoal de TheStarArt_: arte, programação, jogos, pensamentos e cultura da internet.",
  robots: "index, follow",
};

const siteUrl = () => {
  const configuredUrl = import.meta.env.VITE_SITE_URL || "https://thestarart-vue.vercel.app";

  return configuredUrl.replace(/\/$/, "");
};

const absoluteUrl = (pathOrUrl: string) => new URL(pathOrUrl, `${siteUrl()}/`).toString();

const setMeta = (selector: string, attribute: "name" | "property", value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.content = content;
};

const setCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
};

const setArticleSchema = (post: PublicPost, image: string) => {
  const id = "the-star-art-article-schema";
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: post.published_at,
    inLanguage: post.lang,
    mainEntityOfPage: absoluteUrl(`/post/${encodeURIComponent(post.slug)}`),
    author: {
      "@type": "Person",
      name: "TheStarArt_",
    },
  });
};

const clearArticleSchema = () => document.getElementById("the-star-art-article-schema")?.remove();

export const setSeo = (options: SeoOptions) => {
  const canonical = absoluteUrl(options.canonicalPath || window.location.pathname);
  const image = absoluteUrl(options.image || fallbackImagePath);
  const type = options.type || "website";
  const robots = options.robots || "index, follow";

  document.title = options.title;
  document.documentElement.lang = options.language === "pt" ? "pt-BR" : options.language || "pt-BR";

  setMeta('meta[name="description"]', "name", "description", options.description);
  setMeta('meta[name="robots"]', "name", "robots", robots);
  setMeta('meta[property="og:title"]', "property", "og:title", options.title);
  setMeta('meta[property="og:description"]', "property", "og:description", options.description);
  setMeta('meta[property="og:type"]', "property", "og:type", type);
  setMeta('meta[property="og:url"]', "property", "og:url", canonical);
  setMeta('meta[property="og:site_name"]', "property", "og:site_name", siteName);
  setMeta('meta[property="og:image"]', "property", "og:image", image);
  setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", options.title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", options.description);
  setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

  if (options.articlePublishedAt) {
    setMeta('meta[property="article:published_time"]', "property", "article:published_time", options.articlePublishedAt);
  } else {
    document.head.querySelector('meta[property="article:published_time"]')?.remove();
  }

  setCanonical(canonical);
};

export const applyRouteSeo = (route: RouteLocationNormalizedLoaded) => {
  const definition = (route.meta.seo as SeoDefinition | undefined) || defaultSeo;
  const canonicalPath = route.name === "blog" && typeof route.query.page === "string"
    ? `${route.path}?page=${encodeURIComponent(route.query.page)}`
    : route.path;

  setSeo({ ...definition, canonicalPath });
  clearArticleSchema();
};

export const applyPostSeo = (post: PublicPost) => {
  const image = post.thumbnail || fallbackImagePath;

  setSeo({
    title: `${post.title} | ${siteName}`,
    description: post.excerpt || defaultSeo.description,
    canonicalPath: `/post/${encodeURIComponent(post.slug)}`,
    image,
    type: "article",
    language: post.lang,
    articlePublishedAt: post.published_at,
  });
  setArticleSchema(post, absoluteUrl(image));
};

export const trackPageView = (path: string) => {
  window.gtag?.("event", "page_view", {
    page_location: absoluteUrl(path),
    page_path: path,
    page_title: document.title,
  });
};
