import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
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
  async redirects() {
    return [
      {
        source: "/video",
        destination: "https://bulky.id/en/bulky-live",
        permanent: true,
      },
      {
        source: "/how-to-shop",
        destination: "https://bulky.id/en/how-to-buy",
        permanent: true,
      },
      {
        source: "/kebijakan-privasi",
        destination: "https://bulky.id/id/privacy-policy",
        permanent: true,
      },
      {
        source: "/about-payment",
        destination: "https://bulky.id/id/payment-information",
        permanent: true,
      },
      {
        source: "/en/terms-conditions",
        destination: "/en/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/id/terms-conditions",
        destination: "/id/syarat-dan-ketentuan",
        permanent: true,
      },
    ];
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
