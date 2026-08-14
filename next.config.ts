import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Gambar lokal (logo, ikon payment, dll) dipakai apa adanya via `next/image`
    // tanpa optimizer — mencegah error "The requested resource isn't a valid
    // image" dan menghindari sharp memproses file statis pada tiap request.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "**.bulky.id" },
      { protocol: "https", hostname: "**.astadigitalagency.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",").map((origin) =>
    origin.trim(),
  ),
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});
export default withNextIntl(nextConfig);
