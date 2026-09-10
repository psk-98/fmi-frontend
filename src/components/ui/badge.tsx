import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em]",
  {
    variants: {
      variant: {
        default: "bg-lime-200 text-lime-950",
        neutral: "bg-sky-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
        dark: "bg-slate-800 dark:bg-slate-700 text-sky-50",
        warning: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
        danger: "bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200",
        outline: "border border-sky-300 dark:border-slate-600 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300",
        primary: "bg-sky-400 text-slate-950",
        cyan: "bg-cyan-200 dark:bg-cyan-300 text-cyan-950",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
