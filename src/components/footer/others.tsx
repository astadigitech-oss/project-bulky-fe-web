import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export const Others = () => {
  const t = useTranslations("Footer.others");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <ul className="flex flex-col gap-2">
        <Link href={"/products"}>
          <li className="hover:underline underline-offset-2">
            {t("products")}
          </li>
        </Link>
        <Link href={"/news"}>
          <li className="hover:underline underline-offset-2">{t("news")}</li>
        </Link>
        <Link href={"/bulky-live"}>
          <li className="hover:underline underline-offset-2">
            {t("bulkyLive")}
          </li>
        </Link>
      </ul>
    </div>
  );
};
