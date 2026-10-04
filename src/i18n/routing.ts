import { defineRouting, type Pathnames } from "next-intl/routing";

const locales = ["en", "id"] as const;

const pathnames: Pathnames<typeof locales> = {
  "/terms-conditions": {
    en: "/terms-and-conditions",
    id: "/syarat-dan-ketentuan",
  },
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  localeDetection: true,
  localePrefix: "always",
  defaultLocale: "id",
  pathnames,
});
