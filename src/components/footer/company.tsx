import { Link } from "@/i18n/navigation";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { SiInstagram, SiTiktok } from "@icons-pack/react-simple-icons";
import { useTranslations } from "next-intl";

export const Company = () => {
  const t = useTranslations("Footer.company");
  return (
    <div className="flex flex-col gap-4">
      <Link href={"/"}>
        <Button className="p-1 h-auto" variant="ghost">
          <div className="relative h-7 aspect-19/4">
            <Image
              src={"/assets/images/logo-bulky.webp"}
              alt={t("altCompany")}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1280px"
            />
          </div>
          <span className="sr-only">{t("srCompany")}</span>
        </Button>
      </Link>
      <p className="ml-2 leading-relaxed">{t("description")}</p>
      <div className="flex items-center gap-1.5 ml-2">
        <Link href="https://instagram.com/bulky.id">
          <Button
            size={"icon"}
            className={
              "rounded-full bg-yellow-300 hover:bg-yellow-400 shadow text-yellow-800 hover:text-yellow-900"
            }
          >
            <SiInstagram className="size-3.5" />
            <span className="sr-only">{t("srInstagram")}</span>
          </Button>
        </Link>
        <Link href="https://tiktok.com/@bulky.id">
          <Button
            size={"icon"}
            className={
              "rounded-full bg-yellow-300 hover:bg-yellow-400 shadow text-yellow-800 hover:text-yellow-900"
            }
          >
            <SiTiktok className="size-3.5" />
            <span className="sr-only">{t("srTiktok")}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
