import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export const Contact = () => {
  const t = useTranslations("Footer.contactUs");
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">{t("title")}</p>
      <ul className="flex flex-col gap-2">
        <li className="flex gap-2">
          <MapPin className="size-3.5 mt-1 flex-none" />
          <p className="leading-relaxed">
            Jl. Raya Mayor Oking Jaya Atmaja No.62a, Kel Cirimekar, Kec.
            Cibinong, Kabupaten Bogor, Jawa Barat 16918
          </p>
          <span className="sr-only">{t("address")}</span>
        </li>
        <li className="flex gap-2 items-center">
          <Phone className="size-3.5 flex-none" />
          <p className="leading-relaxed">0811-833-164</p>
          <span className="sr-only">{t("address")}</span>
        </li>
        <li className="flex gap-2 items-center">
          <Mail className="size-3.5 flex-none" />
          <Link href={"mailto:admin@bulky.id"}>
            <p className="leading-relaxed hover:underline underline-offset-2">
              admin@bulky.id
            </p>
            <span className="sr-only">{t("address")}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
