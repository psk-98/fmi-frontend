import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eye, Images, UserRound } from "lucide-react";

import { ImageCard } from "@/components/gallery/image-card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { getPublicGallery } from "@/lib/server-api";

type PageProps = { params: Promise<{ uid: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uid } = await params;
  const gallery = await getPublicGallery(uid);
  return { title: gallery?.name ?? "Gallery" };
}

export default async function PublicGalleryPage({ params }: PageProps) {
  const { uid } = await params;
  const gallery = await getPublicGallery(uid);
  if (!gallery) notFound();

  const count = gallery.images_count ?? gallery.images.length;

  return (
    <section className="page-shell py-10 sm:py-16">
      <div className="rounded-3xl border border-[#d7e8ef] bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge><span className="size-1.5 rounded-full bg-[#1f9d64]" /> Public gallery</Badge>
          <Badge variant="neutral">{count} artworks</Badge>
          <Badge variant="dark">v2.4</Badge>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="editorial-type break-words text-4xl font-semibold sm:text-6xl">{gallery.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#557080]">{gallery.description}</p>
          </div>
          <div>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6f8290]">
              <span className="flex items-center gap-2"><Images className="size-4 text-[#30afff]" /> {count} frames</span>
              {gallery.owner ? <span className="flex items-center gap-2"><UserRound className="size-4 text-[#30afff]" /> {gallery.owner.name}</span> : null}
              <span className="flex items-center gap-2"><Eye className="size-4 text-[#30afff]" /> live index</span>
            </div>
            <ShareButton path={`/explore/galleries/${gallery.uid}`} label={gallery.name} className="mt-5 w-full sm:w-auto" />
          </div>
        </div>
      </div>

      {gallery.images.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.images.map((image, index) => (
            <ImageCard
              key={image.uid}
              image={image}
              index={index}
              href={`/explore/galleries/${gallery.uid}/images/${image.uid}`}
              sharePath={`/explore/galleries/${gallery.uid}/images/${image.uid}`}
            />
          ))}
        </div>
      ) : (
        <div className="system-grid mt-8 rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/60 p-8 text-center text-xs text-[#6f8290] sm:p-16">
          This gallery has no published frames yet.
        </div>
      )}
    </section>
  );
}
