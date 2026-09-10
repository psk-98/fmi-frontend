"use client";

import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme, type ThemePreference } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Laptop;
}> = [
  { value: "system", label: "System theme", icon: Laptop },
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center rounded-full border border-sky-200 bg-sky-100 p-1 shadow-inner shadow-white/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-white/5"
      role="group"
      aria-label="Color theme"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "grid size-7 place-items-center rounded-full text-slate-500 dark:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:focus-visible:ring-sky-300 focus-visible:ring-offset-1 focus-visible:ring-offset-sky-50 dark:focus-visible:ring-offset-slate-950",
              active && "bg-sky-400 text-slate-950 shadow-sm",
              !active && "hover:bg-white dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-slate-50",
            )}
            aria-label={label}
            aria-pressed={active}
            title={label}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
