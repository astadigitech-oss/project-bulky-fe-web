"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/lib/query/use-query";
import type {
  GetVideoListResponse,
  GetVideoDetailResponse,
  GetKategoriVideoResponse,
  VideoListItem,
} from "@/services/videos/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(count: number): string {
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

function VideoCard({
  video,
  isNewLabel,
  onClick,
}: {
  video: VideoListItem;
  isNewLabel: string;
  onClick: () => void;
}) {
  const isNew = () => {
    const now = new Date();
    const published = new Date(video.published_at);
    return now.getTime() - published.getTime() < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-400 transition-colors">
        {video.thumbnail_url && (
          <Image
            src={video.thumbnail_url}
            alt={video.judul}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-11 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <Play className="size-5 text-black ml-0.5" fill="black" />
          </div>
        </div>
        {isNew() && (
          <span className="absolute top-2 left-2 bg-orange-400 text-black text-xs font-semibold px-2 py-0.5 rounded">
            {isNewLabel}
          </span>
        )}
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.durasi_detik)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-10 pb-3 px-3">
          <p className="text-white text-xs font-medium leading-snug line-clamp-2">
            {video.judul}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Eye className="size-3.5" />
          {formatViews(video.view_count)}
        </span>
        <span className="size-1 rounded-full bg-gray-300" />
        <span className="text-xs text-gray-500">{video.kategori.nama}</span>
      </div>
    </div>
  );
}

function VideoModal({
  slug,
  locale,
  labels,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  slug: string;
  locale: string;
  labels: {
    description: string;
    relatedVideos: string;
    views: string;
    play: string;
    pause: string;
    close: string;
    prevVideo: string;
    nextVideo: string;
  };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (slug: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const { data, isLoading } = useApiQuery<GetVideoDetailResponse>({
    key: ["video-detail", slug, locale],
    endpoint: `/public/video/${slug}`,
    searchParams: { locale },
    enabled: !!slug,
  });

  const video = data?.data;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [slug]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-16 py-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label={labels.prevVideo}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label={labels.nextVideo}
      >
        <ChevronRight className="size-5" />
      </button>
      <div
        className="flex w-full max-w-[900px] bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: `${Math.round(360 * 16 / 9)}px` }}
      >
        {/* Video panel */}
        <div className="w-[360px] flex-shrink-0">
          <div className="h-full bg-black relative flex items-center justify-center">
            {video?.video_url && (
              <video
                ref={videoRef}
                src={video.video_url}
                className="absolute inset-0 w-full h-full object-contain"
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                playsInline
              />
            )}
            <button
              onClick={handlePlayPause}
              className={cn(
                "absolute size-14 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center shadow-lg transition-all z-10",
                isPlaying && "opacity-0 hover:opacity-100",
              )}
              aria-label={isPlaying ? labels.pause : labels.play}
            >
              {isPlaying ? (
                <Pause className="size-6 text-black" fill="black" />
              ) : (
                <Play className="size-6 text-black ml-0.5" fill="black" />
              )}
            </button>
            {video && (
              <span className="absolute top-3 right-3 bg-white/10 text-white text-xs px-1.5 py-0.5 rounded font-medium z-10">
                {formatDuration(Math.floor(currentTime))} / {formatDuration(video.durasi_detik)}
              </span>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 flex flex-col border-l border-gray-100 overflow-hidden min-w-0">
          {/* Header with close */}
          <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="size-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={labels.close}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              </div>
            ) : video ? (
              <>
                <div className="p-5">
                  <span className="inline-block text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full mb-3">
                    {video.kategori.nama}
                  </span>
                  <p className="text-gray-900 text-base font-semibold leading-snug mb-2">
                    {video.judul}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <Eye className="size-4" />
                    <span>{formatViews(video.view_count)} {labels.views}</span>
                  </div>
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase mb-2">
                    {labels.description}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {video.deskripsi}
                  </p>
                </div>

                {video.video_lainnya && video.video_lainnya.length > 0 && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase mb-3">
                      {labels.relatedVideos}
                    </p>
                    <div className="flex flex-col gap-3">
                      {video.video_lainnya.slice(0, 3).map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => onSelect(rel.slug)}
                          className="flex gap-3 items-center text-left group"
                        >
                          <div className="w-10 flex-shrink-0 aspect-[9/16] bg-gray-100 rounded border border-gray-200 overflow-hidden group-hover:border-yellow-400 transition-colors relative">
                            {rel.thumbnail_url && (
                              <Image
                                src={rel.thumbnail_url}
                                alt={rel.judul}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">{rel.kategori.nama}</p>
                            <p className="text-sm text-gray-700 line-clamp-2 leading-snug group-hover:text-gray-900 transition-colors">
                              {rel.judul}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatViews(rel.view_count)} {labels.views} · {formatDuration(rel.durasi_detik)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BulkyTVClient() {
  const t = useTranslations("BulkyTV");
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "en" ? "en" : "id";

  const [activeCategory, setActiveCategory] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const initialTitleRef = useRef<string>("");

  useEffect(() => {
    initialTitleRef.current = document.title;
  }, []);

  const kategoriesQuery = useApiQuery<GetKategoriVideoResponse>({
    key: ["video-kategoris", locale],
    endpoint: "/public/kategori-video",
    searchParams: { locale },
    staleTime: 5 * 60 * 1000,
  });

  const videosQuery = useApiQuery<GetVideoListResponse>({
    key: ["video-list", locale, activeCategory, page],
    endpoint: "/public/video",
    searchParams: {
      locale,
      halaman: String(page),
      per_halaman: "18",
      ...(activeCategory ? { kategori: activeCategory } : {}),
    },
    staleTime: 60_000,
  });

  const kategoris = kategoriesQuery.data?.data ?? [];
  const videos = videosQuery.data?.data ?? [];
  const meta = videosQuery.data?.meta;

  const currentIndex = selectedSlug
    ? videos.findIndex((v) => v.slug === selectedSlug)
    : -1;

  useEffect(() => {
    if (!selectedSlug) {
      if (initialTitleRef.current) document.title = initialTitleRef.current;
    }
  }, [selectedSlug]);

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedSlug(videos[currentIndex - 1].slug);
    else if (videos.length > 0) setSelectedSlug(videos[videos.length - 1].slug);
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) setSelectedSlug(videos[currentIndex + 1].slug);
    else if (videos.length > 0) setSelectedSlug(videos[0].slug);
  };

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Page header */}
      <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 pt-10 pb-6">
        <h1 className="font-black text-4xl">{t("pageTitle")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Category strip */}
      <div className="border-b border-gray-100">
        <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 py-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => handleCategoryChange("")}
            className={cn(
              "text-sm px-4 py-1.5 rounded-full whitespace-nowrap border transition-colors flex-shrink-0 font-medium",
              activeCategory === ""
                ? "bg-yellow-400 text-black border-yellow-400"
                : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700",
            )}
          >
            {t("categories.all")}
          </button>
          {kategoris.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "text-sm px-4 py-1.5 rounded-full whitespace-nowrap border transition-colors flex-shrink-0 font-medium",
                activeCategory === cat.slug
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700",
              )}
            >
              {cat.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="xl:max-w-7xl max-w-5xl mx-auto px-8 py-8">
        <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
          {t("latest")}
        </p>
        {videosQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[9/16] rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isNewLabel={t("isNew")}
                onClick={() => setSelectedSlug(video.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Image
              src="/assets/images/profile/empty-illustration.svg"
              alt="No videos"
              width={160}
              height={160}
              className="mb-6 h-auto w-auto opacity-80"
            />
            <p className="text-sm text-gray-500">{t("empty")}</p>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_halaman > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: meta.total_halaman }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg border transition-colors",
                  page === p
                    ? "bg-yellow-400 border-yellow-400 text-black font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-400",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.total_halaman, p + 1))}
              disabled={page >= meta.total_halaman}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="h-4 bg-white shadow-[inset_0_-8px_12px_-8px_rgba(0,0,0,0.08)]" />

      {/* Modal */}
      {selectedSlug && (
        <VideoModal
          slug={selectedSlug}
          locale={locale}
          labels={{
            description: t("description"),
            relatedVideos: t("relatedVideos"),
            views: t("views"),
            play: t("play"),
            pause: t("pause"),
            close: t("close"),
            prevVideo: t("prevVideo"),
            nextVideo: t("nextVideo"),
          }}
          onClose={() => setSelectedSlug(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={setSelectedSlug}
        />
      )}
    </main>
  );
}
