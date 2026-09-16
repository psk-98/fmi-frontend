import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-bold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sky-400 dark:focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50 dark:focus-visible:ring-offset-slate-950 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-sky-400 text-slate-950 shadow-lg shadow-sky-900/20 hover:-translate-y-0.5 hover:bg-sky-500 dark:hover:bg-sky-300",
        dark: "bg-slate-900 dark:bg-lime-200 text-white dark:text-slate-950 hover:-translate-y-0.5 hover:bg-slate-700 dark:hover:bg-lime-300",
        outline:
          "border border-sky-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 hover:border-sky-400 dark:hover:border-sky-300 hover:bg-sky-100 dark:hover:bg-slate-800",
        ghost: "text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50",
        destructive: "bg-rose-500 text-white hover:bg-rose-600 dark:hover:bg-rose-400",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const classes = cn(buttonVariants({ variant, size, className }));
  const Component = (asChild ? Slot : "button") as React.ElementType;

  return <Component className={classes} {...props} />;
}

export { Button, buttonVariants };
