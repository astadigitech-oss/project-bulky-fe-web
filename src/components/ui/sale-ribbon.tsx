import { cn } from "@/lib/utils";

type SaleRibbonProps = {
  label?: string;
  className?: string;
};

/**
 * Ribbon "SALE" bergaya folded flag di pojok kanan atas kartu produk.
 * Ditempatkan di dalam container yang memiliki `position: relative`.
 */
export const SaleRibbon = ({ label = "SALE", className }: SaleRibbonProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-0 top-0 z-20 h-16 w-16 overflow-hidden",
        className,
      )}
    >
      <span className="absolute right-[-34px] top-[14px] w-[120px] rotate-45 bg-red-600 py-1 text-center text-[10px] font-bold tracking-wide text-white shadow-sm">
        {label}
      </span>
    </div>
  );
};
