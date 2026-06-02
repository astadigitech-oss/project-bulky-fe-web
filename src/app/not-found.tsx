"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

const copy = {
  en: {
    badge: "404",
    heading: "Page Not Found",
    body: "Oops! The page you're looking for doesn't exist or has been moved.",
    cta: "Back to Home",
  },
  id: {
    badge: "404",
    heading: "Halaman Tidak Ditemukan",
    body: "Ups! Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
    cta: "Kembali ke Beranda",
  },
};

export default function GlobalNotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "id";
  const t = copy[locale];
  const homeHref = `/${locale}`;

  return (
    <html lang={locale}>
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "stretch",
            overflow: "hidden",
            backgroundColor: "#ffcf02",
          }}
        >
          {/* Content — left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "60px 60px 60px 120px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                marginBottom: 16,
                borderRadius: 9999,
                backgroundColor: "#000",
                padding: "6px 20px",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffcf02",
              }}
            >
              {t.badge}
            </span>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#000",
                margin: 0,
              }}
            >
              {t.heading}
            </h1>
            <p
              style={{
                marginTop: 16,
                maxWidth: 420,
                fontSize: 18,
                color: "rgba(0,0,0,0.65)",
              }}
            >
              {t.body}
            </p>
            <Link
              href={homeHref}
              style={{
                marginTop: 32,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                backgroundColor: "#000",
                padding: "16px 40px",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {t.cta}
            </Link>
          </div>

          {/* Image — right column */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              src="/assets/images/contact-us/hero-right.svg"
              alt=""
              aria-hidden
              unoptimized
              width={480}
              height={600}
              style={{ width: "100%", height: "auto", objectFit: "contain", objectPosition: "bottom", maxHeight: "90vh" }}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
