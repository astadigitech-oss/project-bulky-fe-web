import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export const Payment = () => {
  const t = useTranslations("Footer.payment");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <Button className="h-10 p-0 aspect-10/3 relative w-fit bg-transparent">
        <Image
          src={"/assets/images/xendit.png"}
          fill
          alt={t("altXendit")}
          className="bg-contain"
          sizes="20vw"
        />
      </Button>
    </div>
  );
};
