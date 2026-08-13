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
        "pointer-events-none absolute -left-1 -top-4 z-20 size-28",
        className,
      )}
    >
      <Image
        src="/assets/images/qc-2.png"
        alt={alt}
        fill
        className="object-contain drop-shadow-sm"
        sizes="112px"
      />
    </div>
  );
};
