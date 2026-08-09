import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SplitPaymentClient } from "./_components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SplitPaymentPage");
  return { title: t("pageTitle") };
}

const SplitPaymentPage = async ({
  params,
}: {
  params: Promise<{ kode: string }>;
}) => {
  const { kode } = await params;
  return (
    <div className="w-full px-17.5 my-16 mx-auto xl:max-w-7xl max-w-3xl">
      <SplitPaymentClient kode={kode} />
    </div>
  );
};

export default SplitPaymentPage;
