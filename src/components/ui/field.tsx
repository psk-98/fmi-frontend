import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint ? (
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#6f8290]">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-xs font-medium text-[#ba1a1a]">{error}</p>
      ) : null}
    </div>
  );
}
