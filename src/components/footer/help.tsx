import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export const Help = () => {
  const t = useTranslations("Footer.helps");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <ul className="flex flex-col gap-2">
        <Link href={"/about-us"}>
          <li className="hover:underline underline-offset-2">{t("aboutUs")}</li>
        </Link>
        <Link href={"/how-to-buy"}>
          <li className="hover:underline underline-offset-2">
            {t("howToBuy")}
          </li>
        </Link>
        <Link href={"/payment-information"}>
          <li className="hover:underline underline-offset-2">
            {t("aboutPayment")}
          </li>
        </Link>
        <Link href={"/faq"}>
          <li className="hover:underline underline-offset-2">{t("faq")}</li>
        </Link>
        <Link href={"/terms-conditions"}>
          <li className="hover:underline underline-offset-2">
            {t("termsCondition")}
          </li>
        </Link>
        <Link href={"/privacy-policy"}>
          <li className="hover:underline underline-offset-2">
            {t("privacyPolicy")}
          </li>
        </Link>
      </ul>
    </div>
  );
};
