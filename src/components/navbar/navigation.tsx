import { Link, usePathname } from "@i18n/navigation";
import React from "react";
import { Button } from "@ui/button";
import { useTranslations } from "next-intl";

export const Navigation = () => {
  const t = useTranslations("Header.navigation");
  const pathname = usePathname();

  const navData = [
    { label: t("home"), href: "/" },
    { label: t("products"), href: "/products" },
    { label: t("about"), href: "/about-us" },
    { label: t("contact"), href: "/contact-us" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <ul className="flex items-center gap-1 text-sm font-medium">
      {navData.map((nav) => (
        <li key={nav.href}>
          <Link href={nav.href}>
            <Button
              size={"sm"}
              variant={isActive(nav.href) ? "secondary" : "ghost"}
              className={
                isActive(nav.href)
                  ? "bg-[#ffcf02] hover:bg-[#f5c800] text-black"
                  : "text-[#3d3d3d]"
              }
            >
              {nav.label}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
};
