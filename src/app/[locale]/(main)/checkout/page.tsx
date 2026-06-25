import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CheckoutClient } from "./_components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CheckoutPage");
  return { title: t("pageTitle") };
}

const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) => {
  const { slug } = await searchParams;
  return (
    <div className="w-full px-17.5 my-16 mx-auto xl:max-w-7xl max-w-5xl">
      <CheckoutClient productSlug={slug} />
    </div>
  );
};

export default CheckoutPage;
