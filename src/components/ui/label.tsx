import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-[11px] font-bold uppercase leading-none tracking-[0.11em] text-[#20333e]",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
