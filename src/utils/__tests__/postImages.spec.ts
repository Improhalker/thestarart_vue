import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PostImage from "@/components/global/blog/PostImage.vue";
import { sanitizePostHtml } from "../sanitizePostHtml";
import { validatePostImage } from "../postImage";

describe("public and administrative images", () => {
  it("keeps original URLs, alt and dimensions while adding public lazy loading defensively", () => {
    const result = sanitizePostHtml('<p><img src="https://old.example.test/art.gif" alt="Art" width="640" height="480" onerror="alert(1)"></p><script>bad()</script><iframe src="https://evil.test/x"></iframe>', { lazyImages: true });
    const template = document.createElement("template"); template.innerHTML = result;
    const image = template.content.querySelector("img")!;
    expect(image.getAttribute("src")).toBe("https://old.example.test/art.gif");
    expect(image.getAttribute("alt")).toBe("Art");
    expect(image.getAttribute("width")).toBe("640");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(result).not.toMatch(/onerror|<script|evil.test/);
  });

  it("has one fallback and resets it for a replacement source", async () => {
    const wrapper = mount(PostImage, { props: { src: "https://cdn.test/art.png", alt: "Art", priority: true }, attrs: { class: "h-full" } });
    expect(wrapper.find("img").attributes("fetchpriority")).toBe("high");
    await wrapper.find("img").trigger("error");
    expect(wrapper.find("img").attributes("src")).toBe("/images/banner.webp");
    await wrapper.find("img").trigger("error");
    expect(wrapper.find("img").exists()).toBe(false);
    await wrapper.setProps({ src: "https://cdn.test/new.png", priority: false });
    expect(wrapper.find("img").attributes("src")).toBe("https://cdn.test/new.png");
    expect(wrapper.find("img").attributes("loading")).toBe("lazy");
    wrapper.unmount();
  });

  it("keeps upload limits and accepts GIF only for editorial content", () => {
    const gif = new File(["GIF"], "art.gif", { type: "image/gif" });
    expect(validatePostImage(gif, "content")).toBeNull();
    expect(validatePostImage(gif, "thumbnail")).toBe("admin.imageInvalidType");
    expect(validatePostImage(new File([new Uint8Array(1024 * 1024 + 1)], "art.png", { type: "image/png" }), "thumbnail")).toBe("admin.imageTooLarge");
  });
});
