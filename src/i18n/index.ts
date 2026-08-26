import { createI18n } from "vue-i18n";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { ptBR } from "./locales/pt-BR";

export const localeStorageKey = "thestarart:locale";
export const supportedLocales = ["pt-BR", "en", "es"] as const;
export type SupportedLocale = typeof supportedLocales[number];

const legacyLocaleMap: Record<string, SupportedLocale> = { pt: "pt-BR", "pt-BR": "pt-BR", en: "en", es: "es" };

export const initialLocale = (): SupportedLocale => {
  try {
    const saved = window.localStorage.getItem(localeStorageKey) || window.localStorage.getItem("lang");
    const mappedLocale = saved ? legacyLocaleMap[saved] : undefined;
    return mappedLocale ?? "pt-BR";
  } catch {
    return "pt-BR";
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: "pt-BR",
  messages: { "pt-BR": ptBR, en, es },
});

export const setLocale = (locale: SupportedLocale): void => {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  try {
    window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // A interface continua funcional quando o navegador bloqueia o storage.
  }
};

export const hasSelectedLocale = (): boolean => {
  try {
    return window.localStorage.getItem(localeStorageKey) !== null || window.localStorage.getItem("lang") !== null;
  } catch {
    return false;
  }
};
