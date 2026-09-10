import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryStudio } from "@/components/gallery/gallery-studio";
import { getOwnedGallery, requireCurrentUser } from "@/lib/server-api";

type PageProps = { params: Promise<{ uid: string }> };

export const metadata: Metadata = { title: "Gallery studio" };

export default async function GalleryStudioPage({ params }: PageProps) {
  const user = await requireCurrentUser();
  const { uid } = await params;
  const gallery = await getOwnedGallery(uid);
  if (!gallery) notFound();

  return (
    <section className="page-shell py-10 sm:py-16">
      <GalleryStudio initialGallery={gallery} user={user} />
    </section>
  );
}
