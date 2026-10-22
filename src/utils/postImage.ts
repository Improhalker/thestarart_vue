export type PostImagePurpose = "thumbnail" | "content";

/** UX only: Laravel remains responsible for MIME, integrity and dimensions. */
export const validatePostImage = (file: File, purpose: PostImagePurpose): string | null => {
  const types = ["image/jpeg", "image/png", "image/webp", ...(purpose === "content" ? ["image/gif"] : [])];
  if (!types.includes(file.type)) return "admin.imageInvalidType";
  if (!file.size || file.size > (purpose === "thumbnail" ? 1024 : 2048) * 1024) return "admin.imageTooLarge";
  return null;
};

export const postImageFallback = "/images/banner.webp";

/** Handles v-html images without changing persisted HTML or installing listeners per image. */
export const handlePostContentImageError = (event: Event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.dataset.postFallback) {
    image.removeAttribute("src");
    return;
  }
  image.dataset.postFallback = "true";
  image.removeAttribute("srcset");
  image.src = postImageFallback;
};
