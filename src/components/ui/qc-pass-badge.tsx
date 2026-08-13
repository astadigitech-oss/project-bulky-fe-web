import { cn } from "@/lib/utils";
import Image from "next/image";

type QcPassBadgeProps = {
  className?: string;
  alt?: string;
};

/**
 * Stiker "QC PASS" di pojok kiri atas frame gambar produk.
 * Ditempatkan di dalam container yang memiliki `position: relative`.
 */
export const QcPassBadge = ({
  className,
  alt = "QC PASS",
}: QcPassBadgeProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-2 top-2 z-20 size-12",
        className,
      )}
    >
      <Image
        src="/assets/images/passed_qc_sticker.png"
        alt={alt}
        fill
        className="object-contain drop-shadow-sm"
        sizes="48px"
      />
    </div>
  );
};
