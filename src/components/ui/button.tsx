import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-bold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#30afff] focus-visible:ring-offset-2 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#30afff] text-[#07141d] shadow-[0_10px_24px_-14px_rgba(0,99,151,.75)] hover:-translate-y-0.5 hover:bg-[#20a7fb]",
        dark: "bg-[#0b1f2a] text-white hover:-translate-y-0.5 hover:bg-[#173746]",
        outline:
          "border border-[#cde5ef] bg-white text-[#091e29] hover:border-[#30afff] hover:bg-[#eaf5ff]",
        ghost: "text-[#3f5663] hover:bg-[#eaf5ff] hover:text-[#091e29]",
        destructive: "bg-[#d9535f] text-white hover:bg-[#c94350]",
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
