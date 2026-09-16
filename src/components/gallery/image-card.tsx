"use client";

import { motion } from "motion/react";
import { Eye, ScanFace, Sparkles } from "lucide-react";
import { type ReactNode, useState } from "react";

import { ImagePreviewModal } from "@/components/gallery/image-preview-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import type { GalleryImage } from "@/lib/schemas";
import { formatSimilarity } from "@/lib/utils";

function statusVariant(status: GalleryImage["processing_status"]) {
  if (status === "processed") return "default" as const;
  if (status === "failed") return "danger" as const;
  return "warning" as const;
}

export function ImageCard({
  image,
  actions,
  href,
  sharePath,
  index = 0,
}: {
  image: GalleryImage;
  actions?: ReactNode;
  href?: string;
  sharePath?: string;
  index?: number;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.045, 0.35), duration: 0.35 }}
        layout
        className="group overflow-hidden rounded-2xl border border-sky-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-sky-100 dark:bg-slate-800">
          <div
            role="img"
            aria-label={
              image.celebrity_name || image.original_name || "Gallery image"
            }
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${JSON.stringify(image.url).slice(1, -1)})`,
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <Badge variant={statusVariant(image.processing_status)}>
              <span className="size-1.5 rounded-full bg-current opacity-70" />
              {image.processing_status}
            </Badge>
            {typeof image.similarity === "number" ? (
              <Badge variant="cyan">
                <Sparkles className="size-3" />{" "}
                {formatSimilarity(image.similarity)} match
              </Badge>
            ) : null}
          </div>
          {href || sharePath || actions ? (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              {href ? (
                <Button
                  type="button"
                  variant="dark"
                  size="icon"
                  onClick={() => setPreviewOpen(true)}
                  aria-label="View image"
                  title="View image"
                >
                  <Eye />
                </Button>
              ) : null}
              {sharePath ? (
                <ShareButton
                  path={sharePath}
                  label={image.original_name || "gallery image"}
                  iconOnly
                />
              ) : null}
              {actions}
            </div>
          ) : null}
        </div>
        <div className="px-2 pb-2 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black tracking-[-0.03em] text-slate-950 dark:text-slate-50">
                {image.celebrity_name ||
                  image.original_name ||
                  "UNTITLED_FRAME"}
              </h3>
              <p className="mt-1 line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400">
                {image.description ||
                  image.tags.join(" · ") ||
                  `${image.width ?? "—"}×${image.height ?? "—"} · VISUAL INDEX`}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-sky-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300">
              <ScanFace className="size-3.5" /> {image.face_count ?? 0}
            </span>
          </div>
        </div>
      </motion.article>
      {href ? (
        <ImagePreviewModal
          image={image}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          sharePath={sharePath ?? href}
        />
      ) : null}
    </>
  );
}
