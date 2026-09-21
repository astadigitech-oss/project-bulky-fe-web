import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";

export const Payment = () => {
  const t = useTranslations("Footer.payment");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <div className="relative h-10 aspect-10/3 w-fit">
        <Image
          src={"/assets/images/xendit.png"}
          fill
          alt={t("altXendit")}
          className="bg-contain"
          sizes="20vw"
        />
      </div>
    </div>
  );
};
