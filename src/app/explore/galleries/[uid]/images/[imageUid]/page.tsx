import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImageDetail } from "@/components/gallery/image-detail";
import { getPublicImage } from "@/lib/server-api";

type PageProps = { params: Promise<{ uid: string; imageUid: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { imageUid } = await params;
  const image = await getPublicImage(imageUid);
  return { title: image?.celebrity_name || image?.original_name || "Gallery image" };
}

export default async function PublicGalleryImagePage({ params }: PageProps) {
  const { uid, imageUid } = await params;
  const image = await getPublicImage(imageUid);

  if (!image?.gallery || image.gallery.uid !== uid) notFound();

  return (
    <section className="page-shell py-10 sm:py-16">
      <ImageDetail
        image={image}
        gallery={image.gallery}
        backHref={`/explore/galleries/${uid}`}
        sharePath={`/explore/galleries/${uid}/images/${imageUid}`}
      />
    </section>
  );
}
