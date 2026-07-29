import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Background flow lines.
 *
 * Every line in a family is the SAME master curve pushed down by `o` and fanned
 * out slightly toward the right (the `o * 1.0x` factors). That is what makes
 * them read as one continuous flow, the way contour lines on a map do, instead
 * of a stack of unrelated waves. Gaps between offsets are deliberately uneven so
 * the lines clump into bundles rather than sitting on a fixed rhythm.
 */
const topCurve = (o: number) =>
  `M -80,${150 + o} C 180,${58 + o * 1.05} 460,${8 + o * 1.11} 740,${32 + o * 1.16} C 1010,${55 + o * 1.22} 1310,${18 + o * 1.28} 1680,${-72 + o * 1.34}`;

const sweepCurve = (o: number) =>
  `M -80,${298 + o} C 140,${410 + o * 1.03} 380,${488 + o * 1.07} 620,${480 + o * 1.1} C 880,${472 + o * 1.14} 1080,${390 + o * 1.2} 1290,${344 + o * 1.25} C 1440,${310 + o * 1.29} 1560,${298 + o * 1.32} 1680,${294 + o * 1.35}`;

/* lighter than the yellow, sits above the headline. Values are tuned against
   the sheen gradient below, which dims each line to ~0.4x in its trough. */
const TOP_LINES = [
  { o: 0, opacity: 0.58 },
  { o: 19, opacity: 0.44 },
  { o: 33, opacity: 0.55 },
  { o: 62, opacity: 0.36 },
  { o: 75, opacity: 0.46 },
];

/* deeper amber, the wide sweep across the lower half */
const SWEEP_LINES = [
  { o: 0, opacity: 0.32 },
  { o: 23, opacity: 0.48 },
  { o: 38, opacity: 0.38 },
  { o: 71, opacity: 0.42 },
  { o: 88, opacity: 0.3 },
  { o: 125, opacity: 0.46 },
  { o: 140, opacity: 0.34 },
  { o: 176, opacity: 0.26 },
];

export const InfoSection = () => {
  const t = useTranslations("Homepage.infoBanner");
  return (
    <section className="relative w-full overflow-hidden bg-[#ffcf02] py-10 md:py-14">
      <svg
        aria-hidden
        viewBox="0 0 1600 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Gloss. A flat stroke reads matte, so each line carries a gradient
              along its own length: it catches the light in two stretches and
              dies back in between. The two families peak at different offsets
              so their highlights do not line up in a band. */}
          <linearGradient
            id="info-flow-sheen-top"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="0.16" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="0.3" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="0.72" stopColor="#fff8e0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="info-flow-sheen-sweep"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0" stopColor="#c98600" stopOpacity="0.55" />
            <stop offset="0.22" stopColor="#e8a200" stopOpacity="0.35" />
            <stop offset="0.44" stopColor="#b87c00" stopOpacity="1" />
            <stop offset="0.62" stopColor="#e8a200" stopOpacity="0.45" />
            <stop offset="0.85" stopColor="#c98600" stopOpacity="0.9" />
            <stop offset="1" stopColor="#c98600" stopOpacity="0.3" />
          </linearGradient>

          {/* the truck sits on the right, so the field thins out before it */}
          <linearGradient
            id="info-flow-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
          <mask id="info-flow-mask">
            <rect x="-200" y="-200" width="2000" height="1000" fill="url(#info-flow-fade)" />
          </mask>

          {/* lit surface behind everything, so the yellow is not a flat fill */}
          <radialGradient
            id="info-flow-gloss"
            gradientUnits="userSpaceOnUse"
            cx="520"
            cy="120"
            r="1150"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#c98600" stopOpacity="0.13" />
          </radialGradient>
        </defs>

        <rect x="-200" y="-200" width="2000" height="1000" fill="url(#info-flow-gloss)" />

        <g mask="url(#info-flow-mask)" fill="none" strokeLinecap="round">
          {TOP_LINES.map((line) => (
            <path
              key={`top-${line.o}`}
              d={topCurve(line.o)}
              stroke="url(#info-flow-sheen-top)"
              strokeOpacity={line.opacity}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {SWEEP_LINES.map((line) => (
            <path
              key={`sweep-${line.o}`}
              d={sweepCurve(line.o)}
              stroke="url(#info-flow-sheen-sweep)"
              strokeOpacity={line.opacity}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-6 lg:px-12">
        <div>
          <h2 className="text-4xl font-bold leading-tight text-black md:text-5xl xl:text-6xl">
            {t("titleLine1")}
            <br />
            {t.rich("titleLine2", {
              accent: (chunks) => <span className="text-white">{chunks}</span>,
            })}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-black/80 md:text-lg">
            {t("description")}
          </p>

          <Button className="mt-7 h-auto gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-black shadow-none hover:bg-white/90">
            {t("getNow")}
            <ArrowRight className="size-4" />
          </Button>

          <div className="mt-6 flex items-center gap-3">
            <AvatarGroup className="*:data-[slot=avatar]:ring-[#ffcf02]">
              <Avatar size="lg">
                <AvatarFallback className="bg-gray-300">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback className="bg-black">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback className="bg-black">
                  <User className="size-5 text-white" />
                </AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <p className="text-base text-black md:text-lg [&_b]:font-bold">
              {t.rich("satisfied", { b: (chunks) => <b>{chunks}</b> })}
            </p>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden lg:max-w-[760px] lg:justify-self-end">
          <Image
            unoptimized
            src="/assets/images/about-us/delivery-illustration.png"
            alt={t("title")}
            fill
            sizes="(max-width: 1024px) 90vw, 760px"
            className="object-cover object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
};
