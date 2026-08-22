"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { BoxMyIcon } from "@/components/svgs/box-icon";
import { HeadsetMyIcon } from "@/components/svgs/cs-icon";
import { CreditCartMyIcon } from "@/components/svgs/cc-icon";
import { useTranslations } from "next-intl";

// ============================================================================
// ASSET PATHS
// ============================================================================
const IMG_LOOPER_LEFT  = "/assets/images/Looper-kiri.svg";
const IMG_LOOPER_RIGHT = "/assets/images/Looper-kanan.svg";
const IMG_HERO_AGENT   = "/assets/images/contact-us/7A (Hubungi Kami) (1).webp";


const ICON_IG     = "/assets/images/contact-us/logo-instagram.svg";
const ICON_FB     = "/assets/images/contact-us/logo-facebook.svg";
const ICON_TIKTOK = "/assets/images/contact-us/logo-tiktok.svg";

// ============================================================================
// MAP CONFIG
// ============================================================================
const BULKY_LOCATION = {
  name: "BULKY",
  address:
    "Jl. Raya Mayor Oking Jaya Atmaja No.62a, Cirimekar, Cibinong, Kab. Bogor, Jawa Barat 16918",
  lat: -6.4697743,
  lng: 106.859898,
  placeId: "ChIJ_RZusTzraS4RCOPgmzLbt6s",
};

const MAP_EMBED_URL = `https://maps.google.com/maps?q=${BULKY_LOCATION.lat},${BULKY_LOCATION.lng}&z=16&output=embed&t=m`;
const MAP_OPEN_URL  = `https://www.google.com/maps/place/?q=place_id:${BULKY_LOCATION.placeId}`;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  prefix?: string;
}

function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  prefix,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[18px] font-medium text-black">
        {label}
        {required && <span className="ml-[2px] text-red-500">*</span>}
      </label>

      <div className="flex h-[54px] overflow-hidden rounded-[8px] border-[0.5px] border-[#727272]/80 bg-white transition-colors focus-within:border-[#f90] focus-within:ring-1 focus-within:ring-[#f90]">
        {prefix && (
          <span className="flex items-center justify-center border-r-[0.5px] border-[#727272]/40 bg-white px-[14px] text-[16px] font-semibold text-black">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-full flex-1 bg-transparent px-5 text-[16px] text-black placeholder:text-[#727272] focus:outline-none"
        />
      </div>
    </div>
  );
}

/**
 * Hero backdrop.
 *
 * The yellow field is drawn inline instead of being shipped as a raster/heavy
 * SVG backdrop (the old hero-right.svg was 3.8 MB). Three motifs carry it, and
 * they are deliberately NOT the same weight:
 *
 *   - a tight halftone wedge pinned to the top-left corner, only a shade off
 *     the yellow, so it reads as texture rather than as a graphic;
 *   - a thin, light ring family behind the agent, acting as a halo;
 *   - a heavy warm-gold ring family running off the right edge. These are the
 *     loud ones. They are cropped by the card so they read as one big arc
 *     passing behind it, not as a decoration parked in the corner.
 *
 * Each family carries its own mask that dies out before the copy column, so
 * nothing competes with the headline for contrast.
 */
const RINGS_LEFT  = [150, 178, 207, 243, 288];
const RINGS_RIGHT = [92, 134, 182, 236, 296];

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
      <svg
        aria-hidden
        viewBox="0 0 1200 340"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* Halftone. The fill is only a step down from #ffcf02 on purpose:
              at full contrast the corner turns into a second focal point and
              starts fighting the agent. */}
          <pattern id="cu-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.5" fill="#eeb200" />
          </pattern>
          <radialGradient id="cu-dot-fade" gradientUnits="userSpaceOnUse" cx="0" cy="6" r="215">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <mask id="cu-dot-mask">
            <rect x="-30" y="-30" width="290" height="290" fill="url(#cu-dot-fade)" />
          </mask>

          {/* Left halo: white, thin, fades before it reaches the headline. */}
          <linearGradient id="cu-halo-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="0.2" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="0.46" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <mask id="cu-halo-mask">
            <rect x="-300" y="-300" width="1800" height="940" fill="url(#cu-halo-fade)" />
          </mask>

          {/* Right arcs: heavy, warm, and confined to the right third. */}
          <linearGradient id="cu-arc-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.58" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.72" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.86" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <mask id="cu-arc-mask">
            <rect x="-300" y="-300" width="1800" height="940" fill="url(#cu-arc-fade)" />
          </mask>

          {/* lit surface, so the yellow is not a flat fill */}
          <radialGradient id="cu-gloss" gradientUnits="userSpaceOnUse" cx="330" cy="40" r="1000">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="1" stopColor="#c98600" stopOpacity="0.12" />
          </radialGradient>
        </defs>

        <rect x="-200" y="-200" width="1600" height="740" fill="url(#cu-gloss)" />
        <rect
          x="-30"
          y="-30"
          width="290"
          height="290"
          fill="url(#cu-dots)"
          mask="url(#cu-dot-mask)"
        />

        {/* halo behind the agent */}
        <g mask="url(#cu-halo-mask)" fill="none" stroke="#ffffff">
          {RINGS_LEFT.map((r, i) => (
            <circle
              key={`halo-${r}`}
              cx="248"
              cy="262"
              r={r}
              strokeOpacity={i % 2 === 0 ? 0.5 : 0.32}
              strokeWidth={i % 2 === 0 ? 3 : 2}
            />
          ))}
        </g>

        {/* the big arc sweeping off the right edge */}
        <g mask="url(#cu-arc-mask)" fill="none" stroke="#efb100">
          {RINGS_RIGHT.map((r, i) => (
            <circle
              key={`arc-${r}`}
              cx="1128"
              cy="158"
              r={r}
              strokeOpacity={i % 2 === 0 ? 0.62 : 0.4}
              strokeWidth={i % 2 === 0 ? 11 : 6}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <Icon size={28} className="mt-[2px] shrink-0 text-black" aria-hidden />
      <div className="flex-1">
        <p className="mb-2 text-[16px] font-medium text-black">{title}</p>
        <div className="text-[15px] font-normal leading-6 text-black">{children}</div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================

export default function ContactUsClient() {
  const t = useTranslations("ContactUs");
  const [namaDepan, setNamaDepan]         = useState("");
  const [namaBelakang, setNamaBelakang]   = useState("");
  const [email, setEmail]                 = useState("");
  const [telepon, setTelepon]             = useState("");
  const [pesan, setPesan]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [submitted, setSubmitted]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: POST /api/contact ke backend
      console.log("Kirim pesan:", {
        nama_depan: namaDepan,
        nama_belakang: namaBelakang,
        email,
        telepon: `+62${telepon}`,
        pesan,
      });
      setSubmitted(true);
      setNamaDepan("");
      setNamaBelakang("");
      setEmail("");
      setTelepon("");
      setPesan("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full">

      {/* ═══════════════════ SECTION 1 — Hero ═══════════════════════════ */}
      {/* pt clears the agent, who breaks ~44px above the card's top edge */}
      <section className="w-full bg-white pb-12 pt-14 md:pb-16 md:pt-16">
        <div className="mx-auto max-w-[1232px] px-5">
          {/* No overflow-hidden here: the agent is meant to break the top edge.
              The decoration clips itself instead. */}
          <div className="relative rounded-[20px] bg-[#ffcf02] md:min-h-[320px]">
            <HeroBackdrop />

            {/* Agent. Stacked above the copy on mobile, anchored to the bottom
                left corner from md up. */}
            <div className="relative mx-auto -mt-10 h-[220px] w-[170px] md:absolute md:bottom-0 md:left-6 md:mx-0 md:mt-0 md:h-[calc(100%+2.75rem)] md:w-[250px] lg:left-10 lg:w-[280px]">
              <Image
                src={IMG_HERO_AGENT}
                alt=""
                aria-hidden
                unoptimized
                priority
                fetchPriority="high"
                fill
                sizes="(max-width: 768px) 150px, 280px"
                className="object-contain object-bottom"
              />
            </div>

            <div className="relative px-6 pb-9 pt-5 md:py-12 md:pl-[300px] md:pr-10 lg:pl-[380px] lg:pr-16">
              <h1 className="text-[32px] font-black leading-[1.05] tracking-tight text-black md:text-[44px] xl:text-[52px]">
                {t("hero.heading")}
              </h1>

              {/* runs to roughly the width of the headline, not the column */}
              <div className="mt-5 h-[2px] w-full max-w-[300px] rounded-full bg-white/85 md:max-w-[400px]" />

              <p className="mt-4 text-[15px] font-semibold text-black md:text-base">
                {t("hero.subheading")}
              </p>
              <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-black/80 md:text-[15px]">
                {t("hero.description")}
              </p>

              <a
                href="https://wa.me/62811833164"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-[16px] font-bold text-black shadow-sm transition-colors hover:bg-white/90 active:scale-[0.98] md:gap-5 md:text-[18px]"
              >
                {t("hero.cta")}
                {/* decorative: the label carries the meaning and the contrast */}
                <ArrowRight
                  aria-hidden
                  className="size-5 stroke-[2.5] text-[#f0a800] transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 2 — Form + Sidebar ═════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#ffcf02] py-[42px]">
        <Image
          src={IMG_LOOPER_LEFT}
          alt=""
          aria-hidden
          unoptimized
          width={976}
          height={703}
          className="pointer-events-none absolute -left-[161px] -top-[82px] h-auto w-[976px] select-none opacity-90"
        />
        <Image
          src={IMG_LOOPER_RIGHT}
          alt=""
          aria-hidden
          unoptimized
          width={976}
          height={703}
          className="pointer-events-none absolute -bottom-[200px] -right-[200px] h-auto w-[976px] rotate-180 select-none opacity-90"
        />

        <div className="relative z-10 mx-auto flex max-w-[1232px] items-start gap-7 px-5">

          {/* ── FORM ───────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex-1 p-7" noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextField
                id="nama-depan"
                label={t("form.firstName")}
                placeholder={t("form.firstNamePlaceholder")}
                value={namaDepan}
                onChange={setNamaDepan}
                required
              />
              <TextField
                id="nama-belakang"
                label={t("form.lastName")}
                placeholder={t("form.lastNamePlaceholder")}
                value={namaBelakang}
                onChange={setNamaBelakang}
              />
              <TextField
                id="email"
                label={t("form.email")}
                placeholder={t("form.emailPlaceholder")}
                value={email}
                onChange={setEmail}
                type="email"
                required
              />
              <TextField
                id="telepon"
                label={t("form.phone")}
                placeholder={t("form.phonePlaceholder")}
                value={telepon}
                onChange={(v) => setTelepon(v.replace(/\D/g, ""))}
                type="tel"
                prefix="+62"
                required
              />
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label htmlFor="pesan" className="text-[18px] font-medium text-black">
                {t("form.message")}<span className="ml-[2px] text-red-500">*</span>
              </label>
              <textarea
                id="pesan"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder={t("form.messagePlaceholder")}
                rows={6}
                required
                className="resize-none rounded-[8px] border-[0.5px] border-[#727272]/80 bg-white px-5 py-4 text-[16px] text-black placeholder:text-[#727272] transition-colors focus:border-[#f90] focus:outline-none focus:ring-1 focus:ring-[#f90]"
              />
            </div>

            {submitted && (
              <p className="mt-4 rounded-[8px] border border-green-200 bg-green-50 px-3 py-[10px] text-[14px] font-semibold text-green-700">
                {t("form.successMessage")}
              </p>
            )}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black px-[60px] py-[14px] text-[20px] font-bold text-white transition-colors hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? t("form.sending") : t("form.submit")}
              </button>
            </div>
          </form>

          {/* ── SIDEBAR ────────────────────────────────────────────────── */}
          <aside className="flex w-[388px] shrink-0 flex-col gap-5 rounded-[20px] bg-white p-7">
            <p className="text-[16px] font-bold leading-6 text-black">
              {t("sidebar.greeting")}
            </p>

            <InfoBlock icon={Phone} title={t("sidebar.contact")}>
              <div className="grid grid-cols-[120px_1fr] gap-y-1">
                <span className="font-medium">{t("sidebar.smsWa")}</span>
                <a
                  href="https://wa.me/62811833164"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#f90]"
                >
                  +62 811-833-164
                </a>
                {/* <span className="font-medium">{t("sidebar.phone")}</span>
                <a href="tel:+62811833164" className="transition-colors hover:text-[#f90]">
                  +62 811-833-164
                </a> */}
                <span className="font-medium">{t("sidebar.email")}</span>
                <a href="mailto:admin@bulky.id" className="transition-colors hover:text-[#f90]">
                  admin@bulky.id
                </a>
              </div>
            </InfoBlock>

            <div className="border-t border-[#d9d9d9]" />

            <InfoBlock icon={MapPin} title={t("sidebar.address")}>
              <p>{BULKY_LOCATION.address}</p>
            </InfoBlock>

            <div className="border-t border-[#d9d9d9]" />

            <InfoBlock icon={Clock} title={t("sidebar.officeHours")}>
              <div className="grid grid-cols-[130px_1fr] gap-y-1">
                <span className="font-medium">{t("sidebar.monFri")}</span>
                <span>08:00–16:00 WIB</span>
                <span className="font-medium">{t("sidebar.satSun")}</span>
                <span>09:00–16:00 WIB</span>
              </div>
            </InfoBlock>

            <div className="border-t border-[#d9d9d9]" />

            <div>
              <p className="mb-3 text-[16px] font-medium text-black">{t("sidebar.socialMedia")}</p>
              <div className="flex gap-3">
                {[
                  { src: ICON_IG,     alt: "Instagram", href: "https://instagram.com/bulky.id" },
                  { src: ICON_FB,     alt: "Facebook",  href: "https://facebook.com/bulky.id" },
                  { src: ICON_TIKTOK, alt: "TikTok",    href: "https://tiktok.com/@bulky.id" },
                ].map((s) => (
                  <a
                    key={s.alt}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.alt}
                    className="transition-opacity hover:opacity-80"
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      width={35}
                      height={35}
                      unoptimized
                      className="h-[35px] w-[35px] object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3 — Google Maps ════════════════════ */}
      <section className="w-full bg-white">
        <div className="relative h-[442px] w-full overflow-hidden">
          <iframe
            title={`Lokasi ${BULKY_LOCATION.name}`}
            src={MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute left-5 top-5 max-w-[340px] rounded-[12px] bg-white px-5 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.15)] md:left-20">
            <p className="mb-1 text-[14px] font-bold text-black">
              📍 {BULKY_LOCATION.name}
            </p>
            <p className="mb-2 text-[12px] leading-[18px] text-[#727272]">
              {BULKY_LOCATION.address}
            </p>
            <a
              href={MAP_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-bold text-[#f90] hover:underline"
            >
              {t("map.openMaps")}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4 — 3 Poin ════════════════════════ */}
      <section className="w-full bg-[#ffcf02] py-8">
        <div className="mx-auto grid max-w-[1232px] grid-cols-1 gap-4 px-5 md:grid-cols-3">
          {[
            {
              icon: <BoxMyIcon className="h-12 w-auto flex-none" />,
              text: t("points.shipping"),
            },
            {
              icon: <CreditCartMyIcon className="h-12 w-auto flex-none" />,
              text: t("points.payment"),
            },
            {
              icon: <HeadsetMyIcon className="h-12 w-auto flex-none" />,
              text: t("points.support"),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-5"
            >
              {item.icon}
              <p className="text-base leading-tight text-black xl:text-lg font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
