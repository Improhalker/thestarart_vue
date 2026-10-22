import { describe, expect, it } from "vitest";
import { toFormData } from "../toFormData";

describe("multipart post contract", () => {
  it("distinguishes an explicitly empty array from an omitted field", () => {
    const data = toFormData({ tags: [], title: "Arte", thumbnail: null, slug_manually_edited: false });
    expect(data.has("tags")).toBe(true);
    expect(data.get("tags")).toBe("");
    expect(data.has("thumbnail")).toBe(false);
    expect(data.get("slug_manually_edited")).toBe("0");
  });

  it("keeps file bytes and array bracket notation", () => {
    const image = new File(["image"], "drawing.png", { type: "image/png" });
    const data = toFormData({ thumbnail: image, tags: ["art", "code"] });
    expect(data.getAll("tags[]")).toEqual(["art", "code"]);
    expect(data.get("thumbnail")).toBe(image);
  });
});
