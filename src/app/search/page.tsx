import type { Metadata } from "next";

import { SearchWorkspace } from "@/components/gallery/search-workspace";
import { getMyGalleries, requireCurrentUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Search faces" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ gallery?: string }>;
}) {
  await requireCurrentUser();
  const galleries = await getMyGalleries();
  const { gallery } = await searchParams;

  return (
    <section className="page-shell py-12 sm:py-16">
      <SearchWorkspace galleries={galleries} initialGalleryUid={gallery} />
    </section>
  );
}
