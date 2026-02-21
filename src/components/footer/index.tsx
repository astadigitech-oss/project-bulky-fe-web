"use client";

import { Link } from "@i18n/navigation";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { Company } from "./company";
import { Contact } from "./contact";
import { Help } from "./help";
import { Service } from "./service";
import { Payment } from "./payment";
import { Mobile } from "./mobile";

const now = new Date();

export const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="w-full bg-white pt-25 pb-16">
      <div className="xl:max-w-7xl max-w-5xl w-full  mx-auto flex flex-col gap-6">
        <div className="gap-6 w-full grid grid-cols-5 text-xs xl:text-sm px-8">
          <Company />
          <Contact />
          <Help />
          <div className="col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Service />
              <Payment />
            </div>
            <Mobile />
          </div>
        </div>
        <Separator className={"bg-gray-500"} />
        <p className="text-sm ml-8">
          {t.rich("copyright", {
            date: `${now.getFullYear()}`,
            Link: (chunks) => (
              <Link href={"/"} className="hover:underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </footer>
  );
};
