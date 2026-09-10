import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Images, SlidersHorizontal, Sparkles } from "lucide-react";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicGalleries } from "@/lib/server-api";

export const metadata: Metadata = { title: "Discover" };

export default async function ExplorePage() {
  const galleries = await getPublicGalleries();

  return (
    <section className="page-shell py-10 sm:py-16">
      <div className="border-b border-[#d7e8ef] pb-10">
        <p className="technical-label flex items-center gap-2 text-[#006397]">
          <span className="size-1.5 rounded-full bg-[#1f9d64]" /> Gallery / discover
        </p>
        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="display-type text-4xl sm:text-6xl">Discover visual work.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f8290]">
              Curated public galleries, indexed faces, and approved visual studies from the FMI community.
            </p>
          </div>
          <Badge variant="neutral">{galleries.length.toString().padStart(2, "0")} live galleries</Badge>
        </div>

        <div className="scrollbar-none mt-8 flex gap-2 overflow-x-auto pb-1">
          <Badge variant="primary"><Sparkles className="size-3" /> Featured</Badge>
          <Badge variant="neutral">Portraits</Badge>
          <Badge variant="neutral">Collections</Badge>
          <Badge variant="neutral">Public index</Badge>
          <Badge variant="outline"><SlidersHorizontal className="size-3" /> Newest</Badge>
        </div>
      </div>

      {galleries.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <GalleryCard key={gallery.uid} gallery={gallery} href={`/explore/galleries/${gallery.uid}`} />
          ))}
        </div>
      ) : (
        <div className="system-grid mt-10 grid place-items-center rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/70 px-6 py-24 text-center">
          <Images className="size-10 text-[#30afff]" />
          <h2 className="mt-5 text-xl font-black">No public galleries yet</h2>
          <p className="mt-2 max-w-md text-xs leading-6 text-[#6f8290]">Approved public collections will appear here automatically.</p>
          <Button asChild className="mt-6"><Link href="/register">Create the first <ArrowRight /></Link></Button>
        </div>
      )}
    </section>
  );
}
