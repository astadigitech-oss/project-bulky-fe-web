"use client";

import Image from "next/image";
import { PackageOpen, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { useApiQuery } from "@/lib/query/use-query";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import type { AuctionBanner, AuctionListResponse } from "@/services/auctions/types";

export function AuctionListClient() {
  const locale = useLocale();
  const t = useTranslations("Auction");
  const [page, setPage] = useState(1);
  const list = useApiQuery<AuctionListResponse>({
    key: ["auction-list", locale, page],
    endpoint: "/web/auctions",
    searchParams: { locale, page, per_page: 9 },
  });
  const banners = useApiQuery<{ success: boolean; data: AuctionBanner[] }>({
    key: ["auction-banners", locale],
    endpoint: "/web/auctions/banners",
    searchParams: { locale },
  });
  const data = list.data?.data ?? [];
  const meta = list.data?.meta;
  const bannerItems = useMemo(() => banners.data?.data ?? [], [banners.data]);

  return (
    <main className="min-h-screen bg-[#f6f6f4] py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {banners.isLoading ? <AuctionBannerSkeleton /> : null}
        {!banners.isLoading && bannerItems.length > 0 ? <AuctionBannerCarousel banners={bannerItems} /> : null}

        <section className="mb-7">
          <div>
            <p className="w-fit rounded-md bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-black">{t("eyebrow")}</p>
            <h1 className="mt-3 text-3xl font-bold text-[#1c1c1a]">{t("title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c5c57]">{t("description")}</p>
          </div>
        </section>

        {list.isLoading ? <AuctionGridSkeleton /> : null}
        {list.isError ? <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t("loadError")}</p> : null}
        {!list.isLoading && !list.isError && data.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-[#c9c9c2] bg-white px-5 text-center">
            <PackageOpen className="mb-3 size-9 text-[#8a8a82]" />
            <h2 className="font-semibold text-[#272724]">{t("empty")}</h2>
          </div>
        ) : null}
        {data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.map((item, index) => <AuctionCard key={item.id} item={item} preloadImage={index === 0} />)}
          </div>
        ) : null}
        {data.length > 0 ? (
          <AuctionPagination meta={meta} onPageChange={setPage} />
        ) : null}
      </div>
    </main>
  );
}

function AuctionCard({ item, preloadImage }: { item: AuctionListResponse["data"][number]; preloadImage: boolean }) {
  const t = useTranslations("Auction");
  return (
    <Link href={`/auctions/${item.slug}`} className="group block">
      <article className="w-full overflow-hidden rounded-3xl border border-gray-300 bg-white transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square w-full bg-[#e9e9e9]">
          {item.thumbnail_url ? <Image src={item.thumbnail_url} alt={item.name} fill loading={preloadImage ? "eager" : "lazy"} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" /> : <PackageOpen className="absolute inset-0 m-auto size-11 text-[#9a9a92]" />}
        </div>
        <div className="flex w-full flex-col gap-2 px-3 py-2.5">
          <h2 className="line-clamp-1 text-sm font-medium leading-tight text-gray-900">{item.name}</h2>
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] leading-none text-gray-400">{t("batchValue")}</p>
            <p className="whitespace-nowrap text-xl font-bold leading-tight text-orange-500">{formatRupiah(item.grand_total)}</p>
          </div>
          <p className="line-clamp-1 text-[11px] leading-none text-gray-400">
            {t("items", { count: String(item.total_quantity) })} <span className="mx-1">/</span>{t("minimumBid")} {formatRupiah(item.min_bid_amount)}
          </p>
        </div>
      </article>
    </Link>
  );
}

function AuctionGridSkeleton() {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-3/4 animate-pulse rounded-3xl bg-[#e8e8e2]" />)}</div>;
}

function AuctionPagination({ meta, onPageChange }: { meta?: AuctionListResponse["meta"]; onPageChange: (page: number) => void }) {
  const t = useTranslations("Auction");
  if (!meta || meta.last_page <= 1) return null;
  const middlePages = Array.from(
    { length: Math.min(3, Math.max(0, meta.last_page - 2)) },
    (_, index) => index + 2,
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label={t("title")}>
      <Button size="icon" variant="ghost" disabled={meta.current_page <= 1} onClick={() => onPageChange(meta.current_page - 1)}>
        <ChevronLeft />
        <span className="sr-only">{t("previousPage")}</span>
      </Button>
      <Button size="icon" variant={meta.current_page === 1 ? "default" : "ghost"} className={meta.current_page === 1 ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""} onClick={() => onPageChange(1)}>1</Button>
      {meta.last_page > 5 ? <Button size="icon" variant="ghost" disabled><MoreHorizontal /><span className="sr-only">...</span></Button> : null}
      {middlePages.map((itemPage) => (
        <Button key={itemPage} size="icon" variant={meta.current_page === itemPage ? "default" : "ghost"} className={meta.current_page === itemPage ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""} onClick={() => onPageChange(itemPage)}>{itemPage}</Button>
      ))}
      {meta.last_page > 4 ? <Button size="icon" variant={meta.current_page === meta.last_page ? "default" : "ghost"} className={meta.current_page === meta.last_page ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""} onClick={() => onPageChange(meta.last_page)}>{meta.last_page}</Button> : null}
      <Button size="icon" variant="ghost" disabled={meta.current_page >= meta.last_page} onClick={() => onPageChange(meta.current_page + 1)}>
        <ChevronRight />
        <span className="sr-only">{t("nextPage")}</span>
      </Button>
    </nav>
  );
}

function AuctionBannerSkeleton() {
  return (
    <section className="mb-10 overflow-hidden rounded-lg border border-black/10 bg-white" aria-label={useTranslations("Auction")("loadingEducationBanner")} aria-busy="true">
      <div className="aspect-[1920/642] animate-pulse bg-[#e8e8e2]" />
    </section>
  );
}

function AuctionBannerCarousel({ banners }: { banners: AuctionBanner[] }) {
  const t = useTranslations("Auction");
  const autoplay = useMemo(
    () => Autoplay({ delay: 10_000, stopOnInteraction: true, stopOnMouseEnter: true }),
    [],
  );
  const hasMultiple = banners.length > 1;
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const delayRef = useRef(10_000);
  const stopAutoplay = () => api?.plugins().autoplay?.stop();
  const startAutoplay = () => api?.plugins().autoplay?.play();
  const activeBanner = banners[selectedIndex];
  const activeRatio = imageRatios[activeBanner?.banner_url] ?? 1920 / 642;

  useEffect(() => {
    if (!api) return;
    const updateSelectedIndex = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelectedIndex();
    api.on("select", updateSelectedIndex);
    api.on("reInit", updateSelectedIndex);
    return () => {
      api.off("select", updateSelectedIndex);
      api.off("reInit", updateSelectedIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !hasMultiple) return;
    const autoplayPlugin = api.plugins().autoplay;
    if (!autoplayPlugin) return;
    delayRef.current = (autoplayPlugin.options.delay as number) ?? 10_000;

    const updateProgress = () => {
      if (startTimeRef.current === null) return;
      setProgress(Math.min(((performance.now() - startTimeRef.current) / delayRef.current) * 100, 100));
      rafRef.current = requestAnimationFrame(updateProgress);
    };
    const onTimerSet = () => {
      startTimeRef.current = performance.now();
      setProgress(0);
      setShowProgress(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };
    const onTimerStopped = () => {
      startTimeRef.current = null;
      setProgress(0);
      setShowProgress(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    api.on("autoplay:timerset", onTimerSet);
    api.on("autoplay:timerstopped", onTimerStopped);
    autoplayPlugin.play();
    return () => {
      api.off("autoplay:timerset", onTimerSet);
      api.off("autoplay:timerstopped", onTimerStopped);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [api, hasMultiple]);

  return (
    <section className="mb-10" aria-label={t("auctionEducationBanner")}>
      <Carousel
        plugins={[autoplay]}
        opts={{ loop: hasMultiple }}
        setApi={setApi}
        onMouseEnter={() => hasMultiple && stopAutoplay()}
        onMouseLeave={() => hasMultiple && startAutoplay()}
        onFocusCapture={() => hasMultiple && stopAutoplay()}
        onBlurCapture={() => hasMultiple && startAutoplay()}
      >
        <div className="relative overflow-hidden rounded-xl border border-black/10 bg-[#f4f4ef] shadow-lg transition-[aspect-ratio] duration-300" style={{ aspectRatio: activeRatio }}>
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={banner.banner_url}>
                <div
                  className="relative w-full bg-[#f4f4ef]"
                  style={{ aspectRatio: imageRatios[banner.banner_url] ?? 1920 / 642 }}
                >
                  <Image
                    src={banner.banner_url}
                    alt={banner.nama}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain"
                    onLoad={(event) => {
                      const { naturalHeight, naturalWidth } = event.currentTarget;
                      if (naturalWidth > 0 && naturalHeight > 0) {
                        setImageRatios((current) => ({ ...current, [banner.banner_url]: naturalWidth / naturalHeight }));
                      }
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div data-show={showProgress} className="absolute bottom-2 left-0 z-10 w-full transition-all duration-500 data-[show=false]:-bottom-5 data-[show=false]:scale-80">
            <div className="mx-auto w-1/5 rounded-full bg-white p-0.5 shadow-md">
              <Progress value={Math.round(progress)} aria-label={t("auctionSlideProgress")} classIndicator="rounded-r-full bg-yellow-700" classTrack="h-1.5 rounded-full bg-yellow-400" className="rounded-full" />
            </div>
          </div>
        </div>
        {hasMultiple ? <><CarouselPrevious className="size-10 -left-5 border-none bg-white shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:bg-yellow-200 hover:text-yellow-800" /><CarouselNext className="size-10 -right-5 border-none bg-white shadow-lg text-yellow-500 [&_svg]:size-4! [&_svg]:stroke-3! hover:bg-yellow-200 hover:text-yellow-800" /></> : null}
      </Carousel>
    </section>
  );
}
