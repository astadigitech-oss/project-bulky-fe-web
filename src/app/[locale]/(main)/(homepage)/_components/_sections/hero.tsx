import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

type HeroSectionProps = {
  heroUrl?: string;
};

/**
 * Background flow lines, same technique as the other homepage sections: ONE
 * master curve fanned out by `o`, so the family reads as a single continuous
 * flow the way contour lines on a map do, rather than a stack of unrelated
 * waves.
 *
 * The `o` factors SHRINK left to right (1.0 at the head, 0.36 at the tail): the
 * bundle spreads wide over the headline column and pinches toward a focal point
 * off-canvas past the right edge. Equal factors would give flat parallel waves
 * with no fan, and a 0 tail would collapse the bundle into a visible point and
 * read as a light-ray diagram.
 *
 * The two cubic segments join at (860, 318 + 0.66o). The first control point of
 * the second segment MUST stay the mirror of the last control point of the
 * first (520, 300 + 0.78o) -> (1200, 336 + 0.54o), otherwise the join loses
 * tangent continuity and a crease runs down the middle of the banner.
 */
const flowCurve = (o: number) =>
  `M -80,${420 + o} C 260,${350 + o * 0.9} 520,${300 + o * 0.78} 860,${318 + o * 0.66} C 1200,${336 + o * 0.54} 1420,${404 + o * 0.44} 1720,${470 + o * 0.36}`;

/* Uneven gaps on purpose: even spacing reads as a printed pattern, clumps read
   as a flow. Negative offsets ride above the focal line and catch the white
   sheen; positive ones fall below it into the warmer amber under the CTA. */
const FLOW_LINES = [
  -760, -728, -690, -652, -634, -588, -552, -534, -488, -444, -428, -382, -346,
  -330, -284, -246, -228, -184, -148, -132, -86, -48, -32, 14, 52, 68, 114, 152,
  168, 214, 252, 268, 314,
];

/* Each stroke is dimmed to roughly 0.4x in the trough of its sheen gradient, so
   these sit higher than they look. The sine keeps neighbours from matching. */
const lineOpacity = (o: number) =>
  Number((0.3 + 0.34 * Math.abs(Math.sin(o * 0.031))).toFixed(2));

function HeroFlowField() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 620"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    >
      <defs>
        {/* Gloss. A flat stroke reads matte, so every line carries a gradient
            along its own length: it catches the light over one stretch and dies
            back either side. The two families peak at different offsets so
            their highlights never line up into a band. */}
        <linearGradient
          id="hero-flow-sheen-pale"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff8e0" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient
          id="hero-flow-sheen-amber"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#c98600" stopOpacity="0.2" />
          <stop offset="0.34" stopColor="#c98600" stopOpacity="0.55" />
          <stop offset="0.66" stopColor="#b87c00" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e8a200" stopOpacity="0.5" />
        </linearGradient>

        {/* Thins out at both edges so the lines never cut across the headline
            counters on the left or the cut-out figures on the right. */}
        <linearGradient
          id="hero-flow-fade"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
        <mask id="hero-flow-mask">
          <rect
            x="-200"
            y="-200"
            width="2000"
            height="1020"
            fill="url(#hero-flow-fade)"
          />
        </mask>

        {/* Halftone corner. Density is carried entirely by the radial falloff,
            not by varying the dot radius, so the grid stays on a single pitch
            and reads as printed screen rather than as scattered confetti. */}
        <pattern
          id="hero-halftone"
          width="19"
          height="19"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="9.5" cy="9.5" r="2.3" fill="#ffffff" />
        </pattern>
        <radialGradient
          id="hero-halftone-falloff"
          gradientUnits="userSpaceOnUse"
          cx="1585"
          cy="-10"
          r="420"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-halftone-mask">
          <rect
            x="1140"
            y="-200"
            width="660"
            height="640"
            fill="url(#hero-halftone-falloff)"
          />
        </mask>

        {/* Lit surface behind everything, so the yellow is not a flat fill */}
        <radialGradient
          id="hero-flow-gloss"
          gradientUnits="userSpaceOnUse"
          cx="420"
          cy="80"
          r="1250"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#c98600" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      <rect
        x="-200"
        y="-200"
        width="2000"
        height="1020"
        fill="url(#hero-flow-gloss)"
      />

      <rect
        x="1140"
        y="-200"
        width="660"
        height="640"
        fill="url(#hero-halftone)"
        mask="url(#hero-halftone-mask)"
        opacity="0.6"
      />

      <g mask="url(#hero-flow-mask)" fill="none" strokeLinecap="round">
        {FLOW_LINES.map((o) => (
          <path
            key={o}
            d={flowCurve(o)}
            stroke={
              o < -20
                ? "url(#hero-flow-sheen-pale)"
                : "url(#hero-flow-sheen-amber)"
            }
            strokeOpacity={lineOpacity(o)}
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}

export const HeroSection = ({ heroUrl }: HeroSectionProps) => {
  const t = useTranslations("Homepage.hero");

  if (!heroUrl) {
    return (
      <section className="relative w-full overflow-hidden bg-[#ffcf02]">
        <HeroFlowField />

        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-8 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-12">
          <div>
            <h2 className="text-[2.25rem] leading-[1.05] font-extrabold tracking-tight text-black md:text-5xl xl:text-6xl">
              {t("titleLine1")}
              <br />
              {t.rich("titleLine2", {
                accent: (chunks) => <span className="text-white">{chunks}</span>,
              })}
            </h2>

            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-black/80 md:text-lg">
              {t("description")}
            </p>

            <Button className="group/cta mt-8 h-auto gap-4 rounded-full bg-black py-2 pr-2 pl-7 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-none hover:bg-black/85 active:scale-[0.98] md:pl-8 md:text-base">
              {t("startNow")}
              <span className="flex size-9 items-center justify-center rounded-full bg-[#ffcf02] transition-transform duration-300 group-hover/cta:translate-x-1">
                <ArrowRight
                  aria-hidden
                  className="size-4 stroke-[2.5] text-black"
                />
              </span>
            </Button>
          </div>

          {/* The source PNG is square but its artwork only occupies y 190..872
              of 1080, so `object-contain` would letterbox roughly 19% dead
              yellow under the badge. This frame crops that padding instead:
              the 1080/820 box plus a 35% vertical origin keeps the whole
              cluster with air above it and the badge close to the lower edge,
              the way the mockup sits. */}
          <div className="relative mx-auto aspect-[1080/820] w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] lg:justify-self-end">
            <Image
              src="/assets/images/hero-beranda.png"
              alt={t("title")}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 520px, 620px"
              className="object-cover object-[center_35%]"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-19/9">
      <Image
        src={heroUrl}
        alt="banner_hero"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover pointer-events-none"
      />
    </section>
  );
};
