import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em]",
  {
    variants: {
      variant: {
        default: "bg-[#d8ffc5] text-[#163123]",
        neutral: "bg-[#eaf5ff] text-[#3f5663]",
        dark: "bg-[#20333e] text-[#e4f3ff]",
        warning: "bg-[#fff0cf] text-[#8a5400]",
        danger: "bg-[#ffdad6] text-[#93000a]",
        outline: "border border-[#cde5ef] bg-white/80 text-[#557080]",
        primary: "bg-[#30afff] text-[#07141d]",
        cyan: "bg-[#92eeff] text-[#004f59]",
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
