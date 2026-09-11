import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-13 min-w-0 w-full rounded-xl border border-transparent bg-sky-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-950 dark:text-slate-50 outline-none transition placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-sky-400 dark:focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20 dark:focus:ring-sky-300/20 disabled:cursor-not-allowed disabled:opacity-50 file:mr-2 file:max-w-[45%] file:truncate file:rounded-lg file:border-0 file:bg-sky-200 dark:file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-sky-800 dark:file:text-sky-200 sm:file:mr-4 sm:file:max-w-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
