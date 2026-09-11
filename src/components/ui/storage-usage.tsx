import { HardDrive } from "lucide-react";

import { cn, formatFileSize } from "@/lib/utils";

export function StorageUsage({
  usedBytes,
  quotaBytes,
  className,
  compact = false,
}: {
  usedBytes: number;
  quotaBytes: number;
  className?: string;
  compact?: boolean;
}) {
  const safeQuota = Math.max(0, quotaBytes);
  const safeUsed = Math.max(0, usedBytes);
  const remainingBytes = Math.max(0, safeQuota - safeUsed);
  const percentage = safeQuota > 0
    ? Math.min(100, (safeUsed / safeQuota) * 100)
    : 100;
  const barPercentage = safeUsed > 0 ? Math.max(1, percentage) : 0;
  const percentageLabel = percentage > 0 && percentage < 1
    ? "<1%"
    : `${Math.round(percentage)}%`;
  const isFull = remainingBytes === 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-950/50",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300">
            <HardDrive className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="technical-label text-slate-800 dark:text-slate-200">Storage</p>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(safeUsed)} of {formatFileSize(safeQuota)} used
            </p>
          </div>
        </div>
        <span className={cn("text-sm font-black", isFull ? "text-rose-700 dark:text-rose-300" : "text-sky-700 dark:text-sky-300")}>{percentageLabel}</span>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-sky-200 dark:bg-slate-700"
        role="progressbar"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percentage.toFixed(2))}
      >
        <div
          className={cn("h-full rounded-full transition-[width]", isFull ? "bg-rose-500" : "bg-sky-400")}
          style={{ width: `${barPercentage}%` }}
        />
      </div>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
        {isFull
          ? "Storage full · delete images or a gallery to upload again"
          : `${formatFileSize(remainingBytes)} available`}
      </p>
    </div>
  );
}
