import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProfileShell } from "../_components/profile-shell";
import { ReviewList } from "./_components/review-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePages.review");
  return { title: t("pageTitle") };
}

export default function ReviewPage() {
  return (
    <ProfileShell activeTab="review">
      <ReviewList />
    </ProfileShell>
  );
}
