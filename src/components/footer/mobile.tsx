import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export const Mobile = () => {
  const locale = useLocale();
  const t = useTranslations("Footer.getItOn");
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">{t("title")}</p>
      <div className="flex items-center gap-1">
        <Button className={"h-10 p-0 aspect-3/1 relative w-fit bg-transparent"}>
          <Image
            src={
              locale == "id"
                ? "/assets/svgs/as_id.svg"
                : "/assets/svgs/as_en.svg"
            }
            fill
            alt={t("altAppleStore")}
            className="bg-contain"
            sizes="20vw"
          />
          <span className="sr-only">{t("srAppleStore")}</span>
        </Button>
        <Button className={"h-10 p-0 aspect-27/8 relative bg-transparent"}>
          <Image
            src={
              locale == "id"
                ? "/assets/svgs/ps_id.svg"
                : "/assets/svgs/ps_en.svg"
            }
            fill
            alt={t("altPlayStore")}
            className="bg-contain"
            sizes="20vw"
          />
          <span className="sr-only">{t("srPlayStore")}</span>
        </Button>
      </div>
    </div>
  );
};
