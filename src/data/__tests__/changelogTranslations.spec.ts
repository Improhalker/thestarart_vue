import { describe, expect, it } from "vitest";
import changelogData from "../changelog.json";
import { getLocalizedChangelog } from "../changelogTranslations";

describe("getLocalizedChangelog", () => {
  it("preserva integralmente o changelog PT-BR", () => {
    expect(getLocalizedChangelog("pt-BR")).toEqual(changelogData);
  });

  it("usa a tradução da versão quando ela existe", () => {
    const english = getLocalizedChangelog("en");

    expect(english[0]?.changes[0]).toBe("VERSION 0.8.3");
  });

  it("mantém a ordem e a quantidade de mudanças nas versões 0.7 traduzidas", () => {
    const ptBr = changelogData.filter((entry) => entry.version.startsWith("0.7"));

    for (const locale of ["en", "es"] as const) {
      const translated = getLocalizedChangelog(locale).filter((entry) => entry.version.startsWith("0.7"));

      expect(translated.map((entry) => entry.version)).toEqual(ptBr.map((entry) => entry.version));
      expect(translated.map((entry) => entry.changes.length)).toEqual(ptBr.map((entry) => entry.changes.length));
    }
  });

  it("faz fallback para PT-BR em versões históricas ainda sem tradução", () => {
    const spanish = getLocalizedChangelog("es");
    const legacy = spanish.find((entry) => entry.version === "0.0.1");
    const ptBrLegacy = changelogData.find((entry) => entry.version === "0.0.1");

    expect(legacy?.changes).toEqual(ptBrLegacy?.changes);
  });
});
