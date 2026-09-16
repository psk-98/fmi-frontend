import type { Metadata } from "next";

import { GalleryList } from "@/components/gallery/gallery-list";
import { getMyGalleries, requireCurrentUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Your galleries" };

export default async function GalleriesPage() {
  await requireCurrentUser();
  const galleries = await getMyGalleries();

  return (
    <section className="page-shell py-10 sm:py-16">
      <GalleryList galleries={galleries} />
    </section>
  );
}
