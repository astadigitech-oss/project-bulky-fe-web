"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CircleQuestionMark } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useApiQuery } from "@/lib/query/use-query";
import type { GetFaqResponse } from "@/services/faq/types";

type Locale = "id" | "en";

const clampLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

const FaqClient = () => {
  const t = useTranslations("Faq");
  const params = useParams<{ locale: string }>();
  const locale = clampLocale(params?.locale);

  const faqQuery = useApiQuery<GetFaqResponse>({
    key: ["faq", locale],
    endpoint: "/web/faq",
    searchParams: { locale },
  });

  const faqItems = faqQuery.data?.data ?? [];

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
              <CircleQuestionMark className="size-5 text-black" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black md:text-3xl">
                {t("heading")}
              </h1>
              <p className="mt-1 text-sm text-[#6b6b6b] md:text-base">
                {t("subheading")}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-5 py-2 shadow-[0_4px_8px_rgba(0,0,0,0.05)] md:px-8">
            {faqQuery.isLoading ? (
              <div className="flex items-center justify-center py-14">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffcf02] border-t-black" />
              </div>
            ) : faqQuery.isError ? (
              <p className="py-10 text-center text-sm text-gray-500">
                {t("loadError")}
              </p>
            ) : faqItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">
                {t("empty")}
              </p>
            ) : (
              <Accordion>
                {faqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-base font-semibold text-black">
                      {item.pertanyaan}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed text-[#6b6b6b]">
                        {item.jawaban}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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

export default FaqClient;
