export function StepIndicator({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2">
      <div className="flex gap-1.5" role="presentation">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? "bg-[#f90]" : "bg-[#f0f0f0]"
            }`}
          />
        ))}
      </div>
      <span className="text-[12px] font-medium text-[#9a9a9a]">{label}</span>
    </div>
  );
}
