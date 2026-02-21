import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export const Service = () => {
  const t = useTranslations("Footer.service");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <ul className="flex flex-col gap-2">
        <Link href={"#"}>
          <li className="hover:underline underline-offset-2">
            {t("otherProducts")}
          </li>
        </Link>
        <Link href={"#"}>
          <li className="hover:underline underline-offset-2">{t("order")}</li>
        </Link>
        <Link href={"#"}>
          <li className="hover:underline underline-offset-2">
            {t("userProfile")}
          </li>
        </Link>
      </ul>
    </div>
  );
};
