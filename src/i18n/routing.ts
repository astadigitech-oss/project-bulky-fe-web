import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "id"],

  // Used when no locale matches
  localeDetection: true,
  localePrefix: "always",
  defaultLocale: "id",
});
