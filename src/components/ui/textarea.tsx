import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full resize-y rounded-xl border border-transparent bg-[#eaf5ff] px-4 py-3 text-sm text-[#091e29] outline-none transition placeholder:text-[#7b8e9b] focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
