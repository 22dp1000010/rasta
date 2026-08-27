import en from "./locales/en.json";
import hi from "./locales/hi.json";

const catalogues = { en, hi };

export function useT(locale: "en" | "hi") {
  const catalogue = catalogues[locale];
  return (key: keyof typeof en) => catalogue[key] ?? en[key];
}
