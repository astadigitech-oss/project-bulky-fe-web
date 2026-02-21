import { Link } from "@i18n/navigation";
import React from "react";
import { Button } from "@ui/button";
import { useTranslations } from "next-intl";

export const Navigation = () => {
  const t = useTranslations("Header.navigation");
  const navData = [
    { label: t("home"), href: "/" },
    { label: t("products"), href: "/products" },
    { label: t("about"), href: "/about-us" },
  ];
  return (
    <ul className="flex items-center gap-2 text-sm font-medium">
      {navData.map((nav) => (
        <li key={nav.href}>
          <Link href={nav.href}>
            <Button size={"sm"} variant={"ghost"}>
              {nav.label}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
};
