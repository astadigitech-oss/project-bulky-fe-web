import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(rupiah: string | number): string {
  const value =
    typeof rupiah === "string"
      ? parseFloat(rupiah.replace(/[^\d.-]/g, ""))
      : rupiah;

  if (!value || isNaN(value)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Math.ceil(value));
}
