"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetTermsConditionsResponse } from "@/services/terms-conditions/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

const TermsConditionsClient = () => {
  const t = useTranslations("TermsConditions");
  const params = useParams<{ locale: string }>();
  const locale = clampLocale(params?.locale);

  const termsQuery = useApiQuery<GetTermsConditionsResponse>({
    key: ["terms-conditions", locale],
    endpoint: "/web/syarat-ketentuan",
    searchParams: { locale },
  });

  const data = termsQuery.data?.data ?? null;

  return (
    <main className="w-full bg-white">
      <section className="w-full px-4 pb-20 pt-10 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[840px]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-xs">
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-xs">
                <BreadcrumbPage>{t("breadcrumbLabel")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffcf02]">
              <FileText className="size-5 text-black" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              {termsQuery.isLoading ? t("heading") : (data?.judul ?? t("heading"))}
            </h1>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.05)] md:p-10">
            {termsQuery.isLoading ? (
              <div className="flex items-center justify-center py-14">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
              </div>
            ) : termsQuery.isError || !data?.konten ? (
              <p className="py-10 text-center text-sm text-gray-500">
                {t("loadError")}
              </p>
            ) : (
              <div
                className="prose prose-sm max-w-none text-[#3f3f3f] [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-black [&_h2]:first:mt-0 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-black [&_p]:mb-3 [&_p]:leading-relaxed [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_table]:mt-4 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-[#fef8ec] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2"
                dangerouslySetInnerHTML={{ __html: data.konten }}
              />
            )}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#fef8ec] px-6 py-8 text-center">
            <p className="text-base font-semibold text-black">
              {t("stillNeedHelp")}
            </p>
            <Link href="/contact-us">
              <Button className="bg-[#ffcf02] text-black hover:bg-[#f0c300]">
                {t("contactCta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsConditionsClient;
