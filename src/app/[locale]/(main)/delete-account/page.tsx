import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  CheckCircle2,
  CircleUserRound,
  KeyRound,
  LogIn,
  Send,
  Smartphone,
  Trash2,
} from "lucide-react";

type DeleteAccountPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: DeleteAccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as "en" | "id",
    namespace: "DeleteAccount",
  });

  return { title: t("pageTitle") };
}

export default async function DeleteAccountPage() {
  const t = await getTranslations("DeleteAccount");
  const steps = [
    {
      icon: Smartphone,
      title: t("steps.openApp.title"),
      description: t("steps.openApp.description"),
    },
    {
      icon: CircleUserRound,
      title: t("steps.openProfile.title"),
      description: t("steps.openProfile.description"),
    },
    {
      icon: Trash2,
      title: t("steps.selectDelete.title"),
      description: t("steps.selectDelete.description"),
    },
    {
      icon: KeyRound,
      title: t("steps.enterPassword.title"),
      description: t("steps.enterPassword.description"),
    },
    {
      icon: Send,
      title: t("steps.confirm.title"),
      description: t("steps.confirm.description"),
    },
    {
      icon: LogIn,
      title: t("steps.complete.title"),
      description: t("steps.complete.description"),
    },
  ];

  return (
    <main className="min-h-[100dvh] bg-[#f7f7f7] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <section className="overflow-hidden rounded-2xl bg-[#ffcf02] p-6 text-black sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-xl bg-black text-[#ffcf02]">
            <Trash2 className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("heading")}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-black/75 sm:text-lg">
            {t("intro")}
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-[#e2e2e2] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:mt-6 sm:p-8">
          <h2 className="text-xl font-bold text-black sm:text-2xl">
            {t("stepsHeading")}
          </h2>
          <ol className="mt-6 space-y-4">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="flex gap-4 rounded-xl bg-[#f8f8f8] p-4 sm:p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-[#ffcf02]">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 text-black">
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <h3 className="font-semibold">{title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-[#5a5a5a]">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-5 rounded-2xl border border-[#eedda0] bg-[#fff9e5] p-5 sm:mt-6 sm:p-6">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-black" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-black">{t("important.title")}</h2>
              <p className="mt-1.5 text-sm leading-6 text-[#494949]">
                {t("important.description")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
