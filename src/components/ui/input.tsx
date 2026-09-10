import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-13 min-w-0 w-full rounded-xl border border-transparent bg-[#eaf5ff] px-4 py-2 text-sm text-[#091e29] outline-none transition placeholder:text-[#7b8e9b] focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20 disabled:cursor-not-allowed disabled:opacity-50 file:mr-2 file:max-w-[45%] file:truncate file:rounded-lg file:border-0 file:bg-[#d1e5f5] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#004b73] sm:file:mr-4 sm:file:max-w-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
