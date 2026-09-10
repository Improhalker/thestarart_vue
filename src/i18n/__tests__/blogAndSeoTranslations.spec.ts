import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";

const originalLocale = i18n.global.locale.value;

afterEach(() => {
  i18n.global.locale.value = originalLocale;
});

describe("blog and SEO translations", () => {
  it.each([
    ["pt-BR", "Blog — TheStarArt_", "Comentários"],
    ["en", "Blog — TheStarArt_", "Comments"],
    ["es", "Blog — TheStarArt_", "Comentarios"],
  ])("provides blog interface and SEO text for %s", (locale, blogTitle, comments) => {
    i18n.global.locale.value = locale as "pt-BR" | "en" | "es";

    expect(i18n.global.t("seo.blogTitle")).toBe(blogTitle);
    expect(i18n.global.t("blog.comments")).toBe(comments);
    expect(i18n.global.t("common.pageOf", { current: 1, total: 2, count: 12 })).not.toContain("common.pageOf");
  });
});
