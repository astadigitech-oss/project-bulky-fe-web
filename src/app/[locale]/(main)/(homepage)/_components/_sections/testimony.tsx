import { AnimatedTestimonials } from "@/components/ui/testimoni";
import { useTranslations } from "next-intl";
import React from "react";

type TestimoniItem = {
  buyer: {
    nama: string;
    image: string;
  };
  nama_produk: string;
  rating: number;
  deskripsi: string;
  image: string[];
  tanggal: string;
};

type TestimonySectionProps = {
  testimonials?: TestimoniItem[];
};

/**
 * One master curve fanned out to the right. The `o * 1.0x` factors widen the
 * gaps as the lines travel, so the family reads as a single sweep catching the
 * light rather than a stack of parallel waves.
 */
const waveCurve = (o: number) =>
  `M ${520 + o},-60 C ${700 + o * 1.06},110 ${880 + o * 1.12},250 ${1080 + o * 1.18},350 C ${1250 + o * 1.24},436 ${1400 + o * 1.3},486 ${1560 + o * 1.36},516`;

/* uneven offsets so the lines clump into bundles instead of a fixed rhythm */
const WAVE_LINES = [
  { o: 0, opacity: 0.34 },
  { o: 26, opacity: 0.5 },
  { o: 44, opacity: 0.3 },
  { o: 78, opacity: 0.46 },
  { o: 96, opacity: 0.36 },
  { o: 138, opacity: 0.52 },
  { o: 158, opacity: 0.32 },
  { o: 205, opacity: 0.44 },
  { o: 228, opacity: 0.28 },
  { o: 276, opacity: 0.4 },
  { o: 322, opacity: 0.26 },
];

/* Placeholder entries. Only rendered when the API returns no testimonials. */
const fallbackData = [
  {
    date: "10 Januari 2026",
    description:
      "Barang sesuai deskripsi dan kualitas sangat baik. Pengemasan rapi, pengiriman cepat, dan tim Bulky sangat responsif.",
    images: [] as string[],
    name: "Rizky Maulana",
    productName: "Paket Elektronik",
    rating: 5,
    src: "/assets/images/avatar_img.svg",
  },
  {
    date: "23 Januari 2026",
    description:
      "Sudah tiga kali order palet pakaian dan hasilnya konsisten. Isi paletnya masih layak jual dan margin resellernya masuk.",
    images: [] as string[],
    name: "Ayu Pratiwi",
    productName: "Palet Pakaian",
    rating: 5,
    src: "/assets/images/avatar_img.svg",
  },
  {
    date: "4 Februari 2026",
    description:
      "Proses checkout gampang dan status pengiriman jelas. Ada beberapa item yang perlu disortir ulang, sisanya bagus.",
    images: [] as string[],
    name: "Dimas Saputra",
    productName: "Paket Perlengkapan Rumah",
    rating: 4,
    src: "/assets/images/avatar_img.svg",
  },
];

export const TestimonySection = ({ testimonials }: TestimonySectionProps) => {
  const t = useTranslations("Homepage.testimony");

  const data = testimonials?.length
    ? testimonials.map((item) => ({
        name: item.buyer.nama,
        productName: item.nama_produk,
        src: item.buyer.image || "/assets/images/avatar_img.svg",
        rating: item.rating,
        description: item.deskripsi,
        images: item.image,
        date: item.tanggal,
      }))
    : fallbackData;

  return (
    <section className="relative w-full overflow-hidden bg-[#ffcf02] py-14 md:py-20">
      {/* halftone field on the left, fading before it reaches the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 max-w-[420px]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.55) 1.6px, transparent 1.6px)",
          backgroundSize: "16px 16px",
          WebkitMaskImage: "linear-gradient(to right, black, transparent)",
          maskImage: "linear-gradient(to right, black, transparent)",
        }}
      />

      <svg
        aria-hidden
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          {/* a flat stroke reads matte, so each line catches the light along its
              own length and dies back before the right edge */}
          <linearGradient
            id="testimony-wave-sheen"
            gradientUnits="userSpaceOnUse"
            x1="400"
            y1="0"
            x2="1560"
            y2="0"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="0.28" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.58" stopColor="#fff6d0" stopOpacity="0.55" />
            <stop offset="0.82" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>

          {/* the card sits in the middle, so the field thins out behind it */}
          <linearGradient
            id="testimony-wave-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <mask id="testimony-wave-mask">
            <rect
              x="-200"
              y="-200"
              width="1840"
              height="1020"
              fill="url(#testimony-wave-fade)"
            />
          </mask>

          {/* lit surface behind everything, so the yellow is not a flat fill */}
          <radialGradient
            id="testimony-gloss"
            gradientUnits="userSpaceOnUse"
            cx="1080"
            cy="80"
            r="1080"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#c98600" stopOpacity="0.12" />
          </radialGradient>
        </defs>

        <rect
          x="-200"
          y="-200"
          width="1840"
          height="1020"
          fill="url(#testimony-gloss)"
        />

        <g mask="url(#testimony-wave-mask)" fill="none" strokeLinecap="round">
          {WAVE_LINES.map((line) => (
            <path
              key={line.o}
              d={waveCurve(line.o)}
              stroke="url(#testimony-wave-sheen)"
              strokeOpacity={line.opacity}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-black text-neutral-900 md:text-5xl">
            {t("title")}
          </h2>
          <span
            aria-hidden
            className="mt-3 block h-0.5 w-16 rounded-full bg-white/80"
          />
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-neutral-900/80 md:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-9 md:mt-12">
          <AnimatedTestimonials testimonials={data} autoplay />
        </div>
      </div>
    </section>
  );
};
