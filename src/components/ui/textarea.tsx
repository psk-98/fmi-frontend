import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full resize-y rounded-xl border border-transparent bg-sky-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-950 dark:text-slate-50 outline-none transition placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-sky-400 dark:focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20 dark:focus:ring-sky-300/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
