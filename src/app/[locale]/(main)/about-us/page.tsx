import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Headset, Lightbulb, Package, ShieldCheck, Truck, Users, Warehouse } from "lucide-react";
import { InfoSection } from "../(homepage)/_components/_sections/info";
import { NewsSection } from "./_components/news-section";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About Us - Bulky.id" : "Tentang Kami - Bulky.id",
  };
};

const AboutPage = () => {
  const t = useTranslations("AboutUs");

  const commitmentBadges = [
    { title: t("section6.badge1"), desc: t("section6.badge1Desc"), Icon: ShieldCheck },
    { title: t("section6.badge2"), desc: t("section6.badge2Desc"), Icon: Truck },
    { title: t("section6.badge3"), desc: t("section6.badge3Desc"), Icon: Headset },
    { title: t("section6.badge4"), desc: t("section6.badge4Desc"), Icon: Package },
  ];

  const dotGrid = Array.from({ length: 8 * 6 }, (_, i) => ({
    cx: (i % 8) * 20 + 10,
    cy: Math.floor(i / 8) * 20 + 10,
  }));

  return (
    <main className="w-full overflow-hidden bg-white">
      {/* 1) Tentang Kami + 3 card */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FEF8EC] via-[#FFFCF6] to-white px-4 pb-20 pt-16 md:px-8 lg:px-12">
        {/* extra soft blob for depth, layered on top of the section gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#ffe6a0] opacity-70 blur-3xl"
        />
        {/* dotted grid, top-right, drawn as real SVG circles (no CSS mask-image reliance) */}
        <svg
          aria-hidden
          viewBox="0 0 160 120"
          className="pointer-events-none absolute right-8 top-8 hidden h-28 w-36 opacity-60 lg:block"
        >
          {dotGrid.map((dot) => (
            <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r={2} fill="#ffcf02" />
          ))}
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-black md:text-5xl">
              {t("section1.heading")}
            </h2>
            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#ffcf02]" />
            <p className="mt-4 text-base leading-relaxed text-[#6b6b6b] md:text-lg">
              {t("section1.subheading")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            <article className="rounded-[18px] bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_50%_100%,#ffe6a0_0%,#ffe6a0_38%,rgba(255,230,160,0.45)_62%,rgba(255,230,160,0)_85%)]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/6A (Tentang Kami kiri) (1).png"
                  alt={t("section1.card1Title")}
                  fill
                  sizes="(max-width: 768px) 90vw, 380px"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="relative -mt-6 ml-1 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffcf02] shadow-[0_4px_10px_rgba(255,207,2,0.45)]">
                <Users className="size-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-black">
                {t("section1.card1Title")}
              </h3>
              <div className="mt-1 h-[3px] w-8 rounded-full bg-[#ffcf02]" />
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                {t("section1.card1")}
              </p>
            </article>

            <article className="rounded-[18px] bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_50%_100%,#ffe6a0_0%,#ffe6a0_38%,rgba(255,230,160,0.45)_62%,rgba(255,230,160,0)_85%)]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/6B (Tentang Kami tengah) (1).png"
                  alt={t("section1.card2Title")}
                  fill
                  sizes="(max-width: 768px) 90vw, 380px"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="relative -mt-6 ml-1 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffcf02] shadow-[0_4px_10px_rgba(255,207,2,0.45)]">
                <Warehouse className="size-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-black">
                {t("section1.card2Title")}
              </h3>
              <div className="mt-1 h-[3px] w-8 rounded-full bg-[#ffcf02]" />
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                {t.rich("section1.card2", { b: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </article>

            <article className="rounded-[18px] bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_50%_100%,#ffe6a0_0%,#ffe6a0_38%,rgba(255,230,160,0.45)_62%,rgba(255,230,160,0)_85%)]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/6C (Tentang Kami kanan) (1).png"
                  alt={t("section1.card3Title")}
                  fill
                  sizes="(max-width: 768px) 90vw, 380px"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="relative -mt-6 ml-1 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffcf02] shadow-[0_4px_10px_rgba(255,207,2,0.45)]">
                <Lightbulb className="size-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-black">
                {t("section1.card3Title")}
              </h3>
              <div className="mt-1 h-[3px] w-8 rounded-full bg-[#ffcf02]" />
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                {t("section1.card3")}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 2) Solusi */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-8 lg:px-12 lg:py-14">
        <h2 className="mb-8 text-center text-4xl font-black leading-tight text-black md:text-5xl">
          {t("section2.heading")}
          <br />
          {t("section2.headingLine2")}
        </h2>
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-sm">
          <Image
            unoptimized
            src="/assets/images/about-us/5A (Solusi Bisnis Efisien).jpg"
            alt={t("section2.heading")}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 3) Dukung pelaku usaha */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-3xl font-semibold leading-tight text-black md:text-4xl">
              {t("section3.heading")}
            </h3>
            <p className="mb-4 text-lg leading-relaxed text-[#3e3e3e]">
              {t("section3.p1")}
            </p>
            <p className="text-lg leading-relaxed text-[#3e3e3e]">
              {t("section3.p2")}
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <Image
              unoptimized
              src="/assets/images/about-us/4A (Dukungan untuk Pelaku Usaha) (1).png"
              alt={t("section3.heading")}
              width={564}
              height={443}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4) Ekosistem */}
      <section className="mt-4 w-full">
        <div className="relative w-full overflow-hidden bg-[#ffcf02]">
          <Image
            unoptimized
            src="/assets/images/Looper-kiri.svg"
            alt=""
            width={976}
            height={703}
            className="pointer-events-none absolute -left-[210px] -top-[120px] hidden h-auto w-[48%] opacity-80 lg:block"
          />

          <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-[#ffec9a] lg:h-[66px]" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-start gap-8 px-4 pt-10 pb-16 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:pb-24 lg:pt-14">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm lg:-mb-10">
              <Image
                unoptimized
                src="/assets/images/about-us/3B (Ekosistem Bulky.id).jpg"
                alt={t("section4.heading")}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>

            <div className="relative z-20 pr-2 lg:pr-6 xl:pr-[120px]">
              <h3 className="mb-4 text-3xl font-bold leading-tight text-black md:text-4xl">
                {t("section4.heading")}
              </h3>
              <p className="mb-3 max-w-[62ch] text-lg leading-relaxed text-[#1f1f1f]">
                {t("section4.p1")}
              </p>
              <p className="max-w-[62ch] text-base leading-relaxed text-[#1f1f1f] md:text-lg">
                {t("section4.p2")}
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 z-30 hidden h-[360px] w-[360px] xl:block">
            <Image
              unoptimized
              src="/assets/images/about-us/3A (Ekosistem Bulky.id) (1).png"
              alt=""
              fill
              sizes="340px"
              className="object-contain object-bottom drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 5) Berita */}
      <NewsSection />

      {/* 6) Di Bulky */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFF6DC] via-[#FFFDF7] to-white lg:min-h-[720px] lg:max-h-[780px]">
        {/* solid fill circle behind the photo, bleeding off the bottom-left corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 hidden h-[600px] w-[600px] rounded-full bg-[#ffe6a0] lg:block"
        />
        {/* dot grid, 3 rows, tucked right above the photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-12 top-[13%] hidden h-12 w-40 opacity-70 [background-image:radial-gradient(#d98f00_1.5px,transparent_1.5px)] [background-size:16px_16px] lg:block"
        />
        {/* blurred circle, top-right corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#ffcf02]/50 blur-3xl"
        />

        {/* photo, breaks out to the section's bottom-left corner on desktop */}
        <div className="relative z-10 mx-auto w-full max-w-[300px] px-4 pt-10 lg:hidden">
          <Image
            unoptimized
            src="/assets/images/about-us/2A (Komitmen Pengemasan) (1).png"
            alt={t("section6.badge4")}
            width={1011}
            height={982}
            className="h-auto w-full object-contain drop-shadow-xl"
          />
        </div>
        {/* desktop: anchored to the bottom, taller than half the section so it sits behind the feature card */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-[94%] lg:block">
          <Image
            unoptimized
            src="/assets/images/about-us/2A (Komitmen Pengemasan) (1).png"
            alt={t("section6.badge4")}
            width={1011}
            height={982}
            className="h-full w-auto object-contain object-bottom drop-shadow-xl"
          />
        </div>

        <div className="relative z-20 mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-14 md:px-8 lg:h-full lg:max-h-[780px] lg:grid-cols-[0.68fr_1.32fr] lg:items-start lg:gap-10 lg:px-12 lg:py-16">
          <div aria-hidden className="hidden lg:block" />

          <div>
            <h3 className="text-3xl font-bold leading-tight text-black md:text-4xl">
              {t.rich("section6.heading", {
                brand: (chunks) => <span className="text-[#e0a500]">{chunks}</span>,
              })}
            </h3>
            <div className="mt-3 h-1 w-14 rounded-full bg-[#ffcf02]" />
            <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-[#6b6b6b] md:text-lg">
              {t.rich("section6.p", { b: (chunks) => <strong className="text-black">{chunks}</strong> })}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-black/10">
              {commitmentBadges.map((badge) => (
                <div key={badge.title} className="flex flex-col gap-1.5 sm:px-4 sm:first:pl-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffcf02]">
                    <badge.Icon className="size-5 text-black" strokeWidth={2} />
                  </span>
                  <h4 className="text-base font-bold text-black">{badge.title}</h4>
                  <p className="text-sm leading-relaxed text-[#8a8a8a]">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7) CTA Home */}
      <InfoSection />
    </main>
  );
};

export default AboutPage;
