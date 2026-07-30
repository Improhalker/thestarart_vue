import { describe, expect, it } from "vitest";
import { starStationArtworks } from "../artworks";

describe("starStationArtworks", () => {
  it("keeps a unique, public path for every configured drawing", () => {
    const ids = starStationArtworks.map((artwork) => artwork.id);

    expect(new Set(ids).size).toBe(starStationArtworks.length);
    expect(starStationArtworks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/images/desenhos/azurlane.png" }),
        expect.objectContaining({ src: "/images/desenhos/makima.webp" }),
      ]),
    );
  });

  it("derives readable labels and alternative text", () => {
    const eyeBlue = starStationArtworks.find((artwork) => artwork.id === "eye_blue");

    expect(eyeBlue).toMatchObject({
      title: "Eye Blue",
      alt: "Ilustração digital Eye Blue de TheStarArt_.",
    });
  });
});
