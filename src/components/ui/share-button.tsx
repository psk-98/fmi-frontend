"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShareButtonProps = {
  path: string;
  label: string;
  iconOnly?: boolean;
  className?: string;
  variant?: "default" | "dark" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

export function ShareButton({
  path,
  label,
  iconOnly = false,
  className,
  variant = "outline",
  size = iconOnly ? "icon" : "default",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function share() {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ title: label, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const accessibleLabel = copied ? "Link copied" : `Share ${label}`;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={share}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {copied ? <Check /> : <Share2 />}
      {iconOnly ? <span className="sr-only">{accessibleLabel}</span> : copied ? "Link copied" : "Share"}
    </Button>
  );
}
