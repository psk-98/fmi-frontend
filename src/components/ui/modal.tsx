"use client";

import { X } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "default",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "default" | "wide";
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#07141d]/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative my-auto w-full overflow-hidden rounded-3xl border border-[#d7e8ef] bg-white shadow-[0_30px_100px_-35px_rgba(0,0,0,.75)] outline-none",
          size === "wide" ? "max-w-6xl" : "max-w-lg",
        )}
      >
        <div className="flex items-start justify-between gap-5 border-b border-[#eaf5ff] px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <h2 id={titleId} className="editorial-type break-words text-2xl font-semibold text-[#091e29]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1.5 text-xs leading-5 text-[#6f8290]">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-2 shrink-0"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X />
          </Button>
        </div>

        {children ? <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto p-5 sm:p-7">{children}</div> : null}

        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-[#eaf5ff] bg-[#f8fcff] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  pending = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={pending ? () => undefined : onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? "Deleting…" : confirmLabel}
          </Button>
        </>
      }
    />
  );
}
