"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SuccessCheckAnimation({ label }: { label: string }) {
  return (
    <DotLottieReact
      src="/assets/lottie/bid-success.lottie"
      autoplay
      loop={false}
      className="size-52"
      aria-label={label}
    />
  );
}
