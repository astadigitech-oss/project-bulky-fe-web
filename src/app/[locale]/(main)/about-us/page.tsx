import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { InfoSection } from "../(homepage)/_components/_sections/info";

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

  const newsList = [
    {
      title: t("section5.news.0.title"),
      excerpt: t("section5.news.0.excerpt"),
      date: t("section5.news.0.date"),
      image: "/assets/images/about-us/warehouse-vibe.svg",
    },
    {
      title: t("section5.news.1.title"),
      excerpt: t("section5.news.1.excerpt"),
      date: t("section5.news.1.date"),
      image: "/assets/images/about-us/people-in-warehouse.svg",
    },
    {
      title: t("section5.news.2.title"),
      excerpt: t("section5.news.2.excerpt"),
      date: t("section5.news.2.date"),
      image: "/assets/images/about-us/people-left.svg",
    },
    {
      title: t("section5.news.3.title"),
      excerpt: t("section5.news.3.excerpt"),
      date: t("section5.news.3.date"),
      image: "/assets/images/about-us/people-right.svg",
    },
  ];

  return (
    <main className="w-full overflow-hidden bg-white">
      {/* 1) Tentang Kami + 3 card */}
      <section className="relative w-full px-4 pb-16 pt-8 md:px-8 lg:px-12">
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-top.svg"
          alt="Bulky top watermark"
          width={780}
          height={260}
          className="pointer-events-none absolute left-1/2 top-20 hidden w-full max-w-[1100px] -translate-x-1/2 lg:block"
        />
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-bottom.svg"
          alt="Bulky bottom watermark"
          width={1288}
          height={308}
          className="pointer-events-none absolute bottom-0 left-1/2 hidden w-[calc(100vw-4rem)] -translate-x-1/2 lg:block"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <p className="mb-8 text-center text-[36px] font-light text-black">
            {t("section1.heading")}
          </p>

          <div className="grid items-start gap-6 pt-[80px] md:grid-cols-3">
            <article className="mx-auto w-full max-w-[380px] rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              <div className="relative h-[200px] overflow-visible rounded-t-[18px] bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-left.svg"
                  alt="Tentang kami kiri"
                  width={280}
                  height={309}
                  className="absolute bottom-0 left-1/2 h-auto max-h-[280px] w-auto -translate-x-1/2"
                />
              </div>
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  {t("section1.card1")}
                </p>
              </div>
            </article>

            <article className="mx-auto mt-6 w-full max-w-[380px] rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] md:mt-10">
              <div className="relative h-[200px] overflow-visible rounded-t-[18px] bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-center.svg"
                  alt="Tentang kami tengah"
                  width={811}
                  height={583}
                  className="absolute bottom-0 left-1/2 h-auto max-h-[280px] w-auto -translate-x-1/2"
                />
              </div>
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  {t.rich("section1.card2", { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
              </div>
            </article>

            <article className="mx-auto w-full max-w-[380px] rounded-[18px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              <div className="relative h-[200px] overflow-visible rounded-t-[18px] bg-[#ffcf02]">
                <Image
                  unoptimized
                  src="/assets/images/about-us/people-right.svg"
                  alt="Tentang kami kanan"
                  width={220}
                  height={311}
                  className="absolute bottom-0 left-1/2 h-auto max-h-[280px] w-auto -translate-x-1/2"
                />
              </div>
              <div className="px-5 py-4">
                <p className="text-[18px] leading-8 text-[#1f1f1f]">
                  {t("section1.card3")}
                </p>
              </div>
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
        <div className="overflow-hidden rounded-3xl shadow-sm">
          <Image
            unoptimized
            src="/assets/images/about-us/people-meeting.svg"
            alt={t("section2.heading")}
            width={1240}
            height={479}
            className="h-auto w-full object-cover"
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
              src="/assets/images/about-us/people-in-warehouse.svg"
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
        <div className="relative w-full overflow-hidden bg-[#ffcf02] md:min-h-[480px] lg:min-h-[520px]">
          <Image
            unoptimized
            src="/assets/images/Looper-kiri.svg"
            alt=""
            width={976}
            height={703}
            className="pointer-events-none absolute -left-[210px] -top-[120px] hidden h-auto w-[48%] opacity-80 lg:block"
          />

          <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-[#ffec9a]" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-6 px-4 pt-10 pb-10 md:px-8 lg:grid-cols-2 lg:px-12 lg:pb-16">
            <div className="relative z-20 overflow-hidden rounded-[18px] shadow-sm">
              <Image
                unoptimized
                src="/assets/images/about-us/warehouse-vibe.svg"
                alt={t("section4.heading")}
                width={564}
                height={471}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="relative z-20 pr-2 lg:pr-6">
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

          <div className="pointer-events-none absolute bottom-0 right-0 z-30 hidden lg:block">
            <Image
              unoptimized
              src="/assets/images/about-us/girl-with-boxes.svg"
              alt="Girl with boxes"
              width={475}
              height={415}
              className="h-auto w-[520px]"
            />
          </div>
        </div>
      </section>

      {/* 5) Berita */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8 lg:px-12">
        <h3 className="mb-6 text-4xl font-bold text-black">{t("section5.heading")}</h3>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <article>
            <div className="overflow-hidden rounded-3xl">
              <Image
                unoptimized
                src="/assets/images/about-us/people-meeting.svg"
                alt={t("section5.featuredTitle")}
                width={1240}
                height={479}
                className="h-auto w-full object-cover"
              />
            </div>
            <h4 className="mt-4 text-3xl font-semibold leading-tight text-black">
              {t("section5.featuredTitle")}
            </h4>
            <p className="mt-3 text-sm text-[#8a8a8a]">{t("section5.featuredDate")}</p>
          </article>

          <div className="space-y-4">
            {newsList.map((item, idx) => (
              <article
                key={idx}
                className="grid grid-cols-[140px_1fr] gap-3 rounded-2xl"
              >
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    unoptimized
                    src={item.image}
                    alt={item.title}
                    width={280}
                    height={200}
                    className="h-[95px] w-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="line-clamp-1 text-base font-semibold text-black">
                    {item.title}
                  </h5>
                  <p className="line-clamp-2 text-sm text-[#5f5f5f]">
                    {item.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-[#9a9a9a]">{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 border-b border-[#d9d9d9]" />
      </section>

      {/* 6) Di Bulky */}
      <section className="relative w-full bg-white px-4 pt-15 pb-0 md:px-8 lg:px-0">
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-top.svg"
          alt=""
          width={780}
          height={260}
          className="pointer-events-none absolute left-1/2 top-[-36px] hidden w-full max-w-[900px] -translate-x-1/2 lg:block"
        />
        <Image
          unoptimized
          src="/assets/images/about-us/bulky-logo-background-bottom.svg"
          alt=""
          width={1288}
          height={308}
          className="pointer-events-none absolute bottom-0 left-1/2 hidden w-[calc(100vw-14rem)] -translate-x-1/2 lg:block"
        />

        <div className="relative mx-auto w-full max-w-[1280px] pb-0 pt-2">
          <div className="relative z-10 px-0 pb-10 lg:px-8">
            <div className="relative rounded-[18px] bg-[#ffcf02] shadow-[0_4px_8px_rgba(0,0,0,0.2)] lg:ml-[190px]">
              <div className="px-4 pb-6 pt-6 md:px-6 lg:pr-8 lg:pl-0 lg:-ml-10 lg:pb-8">
                <div className="text-center lg:text-left">
                  <h3 className="mx-auto mb-3 max-w-[40ch] text-3xl font-bold leading-tight text-black md:text-4xl lg:ml-[178px]">
                    {t("section6.heading")}
                  </h3>
                  <p className="mx-auto mb-5 max-w-[58ch] text-xl leading-relaxed text-[#1f1f1f] lg:ml-[260px]">
                    {t.rich("section6.p", { b: (chunks) => <strong>{chunks}</strong> })}
                  </p>

                  <div className="mx-auto grid max-w-[760px] gap-3 sm:grid-cols-3 lg:ml-[358px] lg:max-w-none">
                    <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xl text-[#333]">
                      <Image
                        unoptimized
                        src="/assets/images/about-us/icons/checklist-icon.svg"
                        alt={t("section6.badge1")}
                        width={27}
                        height={27}
                        className="h-6 w-6"
                      />
                      <span>{t("section6.badge1")}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xl text-[#333]">
                      <Image
                        unoptimized
                        src="/assets/images/about-us/icons/truck-fast-icon.svg"
                        alt={t("section6.badge2")}
                        width={37}
                        height={25}
                        className="h-6 w-auto"
                      />
                      <span>{t("section6.badge2")}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xl text-[#333]">
                      <Image
                        unoptimized
                        src="/assets/images/about-us/icons/headphone-support-icon.svg"
                        alt={t("section6.badge3")}
                        width={25}
                        height={28}
                        className="h-6 w-auto"
                      />
                      <span>{t("section6.badge3")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-7 rounded-b-[18px] bg-[#ffec9a]" />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 hidden w-[700px] lg:-left-16 lg:block">
              <Image
                unoptimized
                src="/assets/images/about-us/people-wrapping-box.svg"
                alt="Di Bulky"
                width={811}
                height={583}
                className="h-auto w-full"
              />
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
