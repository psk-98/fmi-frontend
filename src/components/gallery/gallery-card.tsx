"use client";

import Link from "next/link";
import { ArrowUpRight, Images, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import type { Gallery } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function GalleryCard({ gallery, href }: { gallery: Gallery; href: string }) {
  const cover = gallery.images[0];
  const frameCount = gallery.images_count ?? gallery.images.length;

  return (
    <motion.article
      layout
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="relative h-full"
    >
      <Link
        href={href}
        className="group block h-full overflow-hidden rounded-2xl border border-sky-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-sky-200 dark:bg-slate-700">
          {cover ? (
            <div
              role="img"
              aria-label={cover.celebrity_name || cover.original_name || gallery.name}
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${JSON.stringify(cover.url).slice(1, -1)})` }}
            />
          ) : (
            <div className="system-grid absolute inset-0 grid place-items-center bg-gradient-to-br from-sky-100 dark:from-slate-800 via-cyan-200/35 dark:via-cyan-400/15 to-lime-200/70 dark:to-lime-400/20">
              <Images className="size-10 text-sky-700 dark:text-sky-300" />
            </div>
          )}
          <div className="absolute left-0 top-0 p-3">
            <Badge variant={gallery.visibility === "public" ? "dark" : "neutral"}>
              <span className={`size-1.5 rounded-full ${gallery.visibility === "public" ? "bg-lime-200" : "bg-slate-500 dark:bg-slate-400"}`} />
              {gallery.visibility === "private" ? <LockKeyhole className="size-3" /> : null}
              {gallery.visibility} / {frameCount.toString().padStart(2, "0")}
            </Badge>
          </div>
        </div>

        <div className="px-2 pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="editorial-type truncate text-xl font-semibold text-slate-950 dark:text-slate-50">
                {gallery.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {gallery.description || "A precision visual collection."}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 transition group-hover:bg-sky-400 group-hover:text-slate-950">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-sky-100 dark:border-slate-800 pt-3 text-[9px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            <span>{frameCount} indexed frames</span>
            <span>{formatDate(gallery.created_at)}</span>
          </div>
        </div>
      </Link>
      <ShareButton
        path={href}
        label={gallery.name}
        iconOnly
        variant="dark"
        className="absolute right-5 top-5 z-20 size-9 bg-slate-800/90 dark:bg-slate-800/90 backdrop-blur"
      />
    </motion.article>
  );
}
