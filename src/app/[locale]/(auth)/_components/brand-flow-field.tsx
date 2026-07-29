/**
 * Background flow lines for the auth surfaces, same technique as the homepage
 * sections: ONE master curve fanned out by `o`, so the family reads as a single
 * continuous flow the way contour lines on a map do, rather than a stack of
 * unrelated waves.
 *
 * What makes this field look like the mockup is that the `o` factors SHRINK
 * left to right (1.55 at the head, 0.16 at the tail): the bundle spreads wide
 * over the brand column and pinches toward a focal point that sits off-canvas
 * past the right edge, behind the card. Two things this is deliberately not:
 *   - equal factors throughout would give parallel waves with no fan
 *   - a factor of 0 at the tail would collapse the lines into a visible point
 *     and the field would read as a light-ray diagram
 *
 * The two cubic segments join at (980, 414 + 0.86o). The first control point of
 * the second segment MUST stay the mirror of the last control point of the
 * first (600, 486 + 1.12o) -> (1360, 342 + 0.60o), otherwise the join loses
 * tangent continuity and a crease appears down the middle of the page.
 *
 * Replaces the Looper-kiri/Looper-kanan pair: those two overlapped across the
 * middle of wide viewports, and their high-opacity members are tight vertical
 * loops that never appear in the mockup.
 *
 * Renders one set of gradient ids, so mount it once per page.
 */
const flowCurve = (o: number) =>
  `M -160,${700 + o * 1.55} C 240,${596 + o * 1.34} 600,${486 + o * 1.12} 980,${414 + o * 0.86} C 1360,${342 + o * 0.6} 1560,${332 + o * 0.32} 1800,${330 + o * 0.16}`;

/* Uneven gaps on purpose: even spacing reads as a printed pattern, clumps read
   as a flow. Negative offsets ride above the focal line and catch the white
   sheen; positive ones fall below it into the warmer amber. */
const FLOW_LINES = [
  -690, -640, -612, -556, -518, -500, -452, -410, -392, -344, -300, -284, -238,
  -196, -180, -134, -96, -80, -34, 0, 18, 62, 104, 120, 166, 208, 224, 270, 312,
  328, 374, 416,
];

/* Each stroke is dimmed to roughly 0.4x in the trough of its sheen gradient, so
   these sit higher than they look. The sine keeps neighbours from matching. */
const lineOpacity = (o: number) =>
  Number((0.3 + 0.34 * Math.abs(Math.sin(o * 0.031))).toFixed(2));

export function BrandFlowField() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    >
      <defs>
        {/* Gloss. A flat stroke reads matte, so every line carries a gradient
            along its own length: it catches the light over one stretch and dies
            back either side. The two families peak at different offsets so
            their highlights never line up into a band. */}
        <linearGradient
          id="auth-sheen-amber"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#c98600" stopOpacity="0.15" />
          <stop offset="0.3" stopColor="#c98600" stopOpacity="0.5" />
          <stop offset="0.62" stopColor="#b87c00" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e8a200" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient
          id="auth-sheen-pale"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="0.66" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff8e0" stopOpacity="0.9" />
        </linearGradient>

        {/* The brand column sits on the left, so the field thins out before it
            and never competes with the white welcome type. */}
        <linearGradient
          id="auth-field-fade"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1600"
          y2="0"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.28" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="0.58" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="0.84" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <mask id="auth-field-mask">
          <rect
            x="-200"
            y="-200"
            width="2000"
            height="1200"
            fill="url(#auth-field-fade)"
          />
        </mask>

        {/* Lit surface behind everything, so the yellow is not a flat fill */}
        <radialGradient
          id="auth-field-gloss"
          gradientUnits="userSpaceOnUse"
          cx="1240"
          cy="150"
          r="1300"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#c98600" stopOpacity="0.14" />
        </radialGradient>
      </defs>

      <rect
        x="-200"
        y="-200"
        width="2000"
        height="1200"
        fill="url(#auth-field-gloss)"
      />

      <g mask="url(#auth-field-mask)" fill="none" strokeLinecap="round">
        {FLOW_LINES.map((o) => (
          <path
            key={o}
            d={flowCurve(o)}
            stroke={o < -40 ? "url(#auth-sheen-pale)" : "url(#auth-sheen-amber)"}
            strokeOpacity={lineOpacity(o)}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
