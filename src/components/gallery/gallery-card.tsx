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
        className="group block h-full overflow-hidden rounded-2xl border border-[#d7e8ef] bg-white p-2 shadow-[0_18px_50px_-38px_rgba(11,38,54,.48)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#d7ebfa]">
          {cover ? (
            <div
              role="img"
              aria-label={cover.celebrity_name || cover.original_name || gallery.name}
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${JSON.stringify(cover.url).slice(1, -1)})` }}
            />
          ) : (
            <div className="system-grid absolute inset-0 grid place-items-center bg-gradient-to-br from-[#eaf5ff] via-[#92eeff]/35 to-[#d8ffc5]/70">
              <Images className="size-10 text-[#006397]" />
            </div>
          )}
          <div className="absolute left-0 top-0 p-3">
            <Badge variant={gallery.visibility === "public" ? "dark" : "neutral"}>
              <span className={`size-1.5 rounded-full ${gallery.visibility === "public" ? "bg-[#d8ffc5]" : "bg-[#6f8290]"}`} />
              {gallery.visibility === "private" ? <LockKeyhole className="size-3" /> : null}
              {gallery.visibility} / {frameCount.toString().padStart(2, "0")}
            </Badge>
          </div>
        </div>

        <div className="px-2 pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="editorial-type truncate text-xl font-semibold text-[#091e29]">
                {gallery.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6f8290]">
                {gallery.description || "A precision visual collection."}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf5ff] text-[#006397] transition group-hover:bg-[#30afff] group-hover:text-[#07141d]">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#eaf5ff] pt-3 text-[9px] uppercase tracking-[0.08em] text-[#7b8e9b]">
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
        className="absolute right-5 top-5 z-20 size-9 bg-[#20333e]/90 backdrop-blur"
      />
    </motion.article>
  );
}
