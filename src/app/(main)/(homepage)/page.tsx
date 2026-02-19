import { Metadata } from "next";
import { HompageClient } from "./_components/client";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Header.navigation");
  return { title: t("home") };
};

const HomePage = () => {
  return <HompageClient />;
};

export default HomePage;
