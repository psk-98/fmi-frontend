import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImageDetail } from "@/components/gallery/image-detail";
import { getOwnedImage, requireCurrentUser } from "@/lib/server-api";

type PageProps = { params: Promise<{ uid: string; imageUid: string }> };

export const metadata: Metadata = { title: "Gallery image" };

export default async function OwnedGalleryImagePage({ params }: PageProps) {
  await requireCurrentUser();
  const { uid, imageUid } = await params;
  const image = await getOwnedImage(imageUid);

  if (!image?.gallery || image.gallery.uid !== uid) notFound();

  return (
    <section className="page-shell py-10 sm:py-16">
      <ImageDetail
        image={image}
        gallery={image.gallery}
        backHref={`/galleries/${uid}`}
        sharePath={`/galleries/${uid}/images/${imageUid}`}
      />
    </section>
  );
}
