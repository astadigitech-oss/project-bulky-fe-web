"use client";

import Link from "next/link";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Asset URLs (Figma MCP — ganti dengan path /public setelah download, berlaku 7 hari)
// ---------------------------------------------------------------------------
const IMG_HERO   = "https://www.figma.com/api/mcp/asset/e5184f71-0e86-4be2-8446-8cb250d14df4";
const IMG_MASCOT = "https://www.figma.com/api/mcp/asset/57d2a10f-82c3-423d-90b3-0b6099d11f93";
const IMG_LOGO   = "https://www.figma.com/api/mcp/asset/d43d95b5-8576-4e07-938a-16a7bc935d01";
const IMG_LOOPER = "https://www.figma.com/api/mcp/asset/712275b6-d75f-4abe-a060-0e794d9f6f9e";
const IMG_CLOSE  = "https://www.figma.com/api/mcp/asset/9d6e7334-603a-4b08-b5fb-78345bc5bb0b";
const IMG_GOOGLE = "https://www.figma.com/api/mcp/asset/0a4cf763-d67c-49bc-9298-fcd543a44cfe";

// ---------------------------------------------------------------------------
// Sub-component: Divider "Atau"
// ---------------------------------------------------------------------------
function OrDivider() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 border-t border-[#727272]/40" />
      <span className="text-xs text-[#727272] font-roboto">Atau</span>
      <div className="flex-1 border-t border-[#727272]/40" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Apple Icon (inline SVG — tidak ada di Figma asset)
// ---------------------------------------------------------------------------
function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 814 1000"
      className="w-[20px] h-[20px] shrink-0"
      fill="currentColor"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.2-112.3C197 414.5 157.2 319 157.2 229.2c0-117.5 76.5-179.8 150.6-179.8 77.1 0 138.4 50.2 185.6 50.2 45.3 0 116.2-54.3 205.3-54.3zm-53.1-208.7C770.1 96 820.3 137.2 820.3 214c0 75.2-50.2 117.5-111.4 156.4-58.6 37.5-122.7 56.4-164.7 56.4-5.1 0-12.2-.6-12.2-7.7 0-6.4 50.2-113.4 111.4-178.7 30.8-33.9 86.9-84.7 151.6-108.2z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main RegisterPage
// ---------------------------------------------------------------------------
export default function RegisterPage() {
  const [phone, setPhone]     = useState("");
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Harap setujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: panggil POST /api/auth/register ke backend Go Fiber
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ telepon: phone }),
      // });
      console.log("Register:", { phone });
    } finally {
      setLoading(false);
    }
  }

  return (
    /**
     * Full-page yellow background — konsisten dengan LoginPage
     */
    <div className="relative min-h-screen w-full bg-[#ffcf02] overflow-hidden flex items-center justify-center">

      {/* ── Looper pattern kiri ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG_LOOPER}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-[243px] -top-[134px] w-[1147px] h-auto select-none"
      />

      {/* ── Looper pattern kanan ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG_LOOPER}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-463px] -top-[260px] w-[1147px] h-auto select-none"
      />

      {/* ── Mascot background (blob kuning di balik hero) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG_MASCOT}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-39px] bottom-0 w-[967px] h-auto select-none object-cover"
      />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-[1366px] px-[146px]">

        {/* ── Hero image kiri ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG_HERO}
          alt="Staff Bulky di depan kontainer pengiriman"
          className="w-[542px] h-[542px] object-cover select-none"
        />

        {/* ── Card form register ── */}
        <div className="relative bg-white rounded-[20px] w-[365px] flex flex-col items-center px-[26px] pt-[36px] pb-[32px]">

          {/* Close button */}
          <Link
            href="/"
            className="absolute top-[25px] right-[22px]"
            aria-label="Tutup"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_CLOSE} alt="Tutup" className="w-[22px] h-[22px]" />
          </Link>

          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG_LOGO}
            alt="Bulky"
            className="h-[42px] w-auto object-contain mb-[18px]"
          />

          {/* Judul */}
          <h1 className="text-[32px] font-bold text-[#222] leading-[1.1] font-roboto w-full mb-[6px]">
            Daftar Sekarang
          </h1>

          {/* Sudah punya akun? */}
          <div className="flex items-center gap-1 w-full mb-[24px]">
            <span className="text-[14px] font-normal text-black font-roboto">
              Sudah Punya Akun?
            </span>
            <Link
              href="/masuk"
              className="text-[14px] font-normal text-[#f90] hover:underline font-roboto"
            >
              Masuk
            </Link>
          </div>

          {/* ── OAuth Buttons ── */}
          <div className="flex flex-col gap-[10px] w-full mb-[16px]">

            {/* Google */}
            <button
              type="button"
              onClick={() => console.log("Google OAuth")}
              className="flex items-center justify-center gap-[8px] w-full h-[39px] rounded border border-[#727272]/60 bg-white text-[14px] font-bold text-black hover:bg-gray-50 active:bg-gray-100 transition-colors font-roboto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG_GOOGLE}
                alt="Google"
                className="w-[22px] h-[22px] object-contain"
              />
              <span>Google</span>
            </button>

            {/* Apple — tambahan request */}
            <button
              type="button"
              onClick={() => console.log("Apple OAuth")}
              className="flex items-center justify-center gap-[8px] w-full h-[39px] rounded border border-[#727272]/60 bg-white text-[14px] font-bold text-black hover:bg-gray-50 active:bg-gray-100 transition-colors font-roboto"
            >
              <AppleIcon />
              <span>Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full mb-[16px]">
            <OrDivider />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-0">

            {/* Nomor Telepon */}
            <div className="flex flex-col gap-[6px] mb-[16px]">
              <label
                htmlFor="phone"
                className="text-[14px] font-bold text-[#727272] font-roboto"
              >
                Nomor Telepon
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nomor Handphone"
                required
                className="h-[39px] rounded border border-[#f90] px-[12px] text-[16px] font-light text-[#727272] placeholder:text-[#727272] focus:outline-none focus:ring-1 focus:ring-[#f90] font-roboto"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-[12px] mb-[10px] font-roboto">{error}</p>
            )}

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={loading}
              className="h-[39px] w-full rounded bg-[#ffcf02] text-[14px] font-bold text-black hover:bg-[#f5c800] active:bg-[#e8bb00] transition-colors disabled:opacity-60 font-roboto mb-[16px]"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            {/* Checkbox Terms & Conditions */}
            <label className="flex items-start gap-[8px] cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-[3px] shrink-0 accent-[#f90]"
              />
              <p className="text-[12px] font-normal text-black text-center leading-[20px] font-roboto">
                Dengan Mendaftar, Saya menyetujui{" "}
                <Link
                  href="/syarat-ketentuan"
                  className="text-[#f90] hover:underline"
                >
                  Syarat &amp; Ketentuan
                </Link>{" "}
                Serta{" "}
                <Link
                  href="/kebijakan-privasi"
                  className="text-[#f90] hover:underline"
                >
                  Kebijakan Privasi
                </Link>
              </p>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
