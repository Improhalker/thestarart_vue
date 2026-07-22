import DOMPurify from "dompurify";

const youtubeEmbedPattern = /^https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com)\/embed\/[A-Za-z0-9_-]{11}(?:\?[^\s]*)?$/;

export const sanitizePostHtml = (html: string) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u", "s",
      "ul", "ol", "li", "blockquote", "pre", "code", "hr", "a", "img", "iframe", "div",
    ],
    ALLOWED_ATTR: [
      "href", "title", "target", "rel", "src", "alt", "width", "height", "frameborder", "allowfullscreen",
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?):|#)/i,
  });

  const template = document.createElement("template");
  template.innerHTML = sanitized;

  template.content.querySelectorAll("iframe").forEach((iframe) => {
    if (!youtubeEmbedPattern.test(iframe.getAttribute("src") || "")) iframe.remove();
  });

  template.content.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  return template.innerHTML;
};
