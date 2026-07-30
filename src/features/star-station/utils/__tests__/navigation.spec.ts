import { describe, expect, it } from "vitest";
import { starStationNavigationPoints } from "../navigation";

describe("starStationNavigationPoints", () => {
  it("keeps the four MVP destinations available to the accessible navigation", () => {
    expect(starStationNavigationPoints.map((point) => point.id)).toEqual([
      "home",
      "about-project",
      "about-me",
      "gallery",
    ]);
  });

  it("gives every destination a readable visual label and an accessible description", () => {
    starStationNavigationPoints.forEach((point) => {
      expect(point.label).not.toHaveLength(0);
      expect(point.description).not.toHaveLength(0);
    });
  });
});
