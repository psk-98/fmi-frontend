import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileImage,
  Images,
  Ruler,
  ScanFace,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import type { GalleryImage } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

type ImageGallery = {
  uid: string;
  name: string;
  description?: string | null;
  visibility: "public" | "private";
};

function formatFileSize(bytes?: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageDetail({
  image,
  gallery,
  backHref,
  sharePath,
}: {
  image: GalleryImage;
  gallery: ImageGallery;
  backHref: string;
  sharePath: string;
}) {
  const title = image.celebrity_name || image.original_name || "Untitled frame";

  return (
    <>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-300 hover:text-slate-950 dark:hover:text-slate-50"
      >
        <ArrowLeft className="size-4" /> Back to {gallery.name}
      </Link>

      <div className="mt-7 overflow-hidden rounded-3xl border border-sky-200 bg-white p-3 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 sm:p-5">
        <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,.65fr)] xl:items-start">
          <div className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-slate-950 sm:min-h-[34rem] xl:min-h-[44rem]">
            <div
              role="img"
              aria-label={title}
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
            />
          </div>

          <aside className="min-w-0 px-2 pb-3 pt-1 sm:px-3 xl:sticky xl:top-24">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={image.processing_status === "processed" ? "default" : image.processing_status === "failed" ? "danger" : "warning"}>
                {image.processing_status}
              </Badge>
              <Badge variant={gallery.visibility === "public" ? "primary" : "dark"}>
                {gallery.visibility}
              </Badge>
            </div>

            <p className="technical-label mt-7 text-sky-700 dark:text-sky-300">Individual gallery frame</p>
            <h1 className="editorial-type mt-3 break-words text-3xl font-semibold text-slate-950 dark:text-slate-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              {image.description || gallery.description || "A frame from this visual collection."}
            </p>

            <ShareButton path={sharePath} label={title} className="mt-6 w-full sm:w-auto" />

            <dl className="mt-8 grid gap-3 border-t border-sky-100 dark:border-slate-800 pt-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div className="rounded-xl bg-sky-100 dark:bg-slate-800 p-4">
                <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"><ScanFace className="size-4 text-sky-700 dark:text-sky-300" /> Faces</dt>
                <dd className="mt-2 text-lg font-black text-slate-950 dark:text-slate-50">{image.face_count ?? 0}</dd>
              </div>
              <div className="rounded-xl bg-sky-100 dark:bg-slate-800 p-4">
                <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"><Ruler className="size-4 text-sky-700 dark:text-sky-300" /> Dimensions</dt>
                <dd className="mt-2 text-lg font-black text-slate-950 dark:text-slate-50">{image.width ?? "—"} × {image.height ?? "—"}</dd>
              </div>
              <div className="rounded-xl bg-sky-100 dark:bg-slate-800 p-4">
                <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"><FileImage className="size-4 text-sky-700 dark:text-sky-300" /> File</dt>
                <dd className="mt-2 truncate text-sm font-black text-slate-950 dark:text-slate-50">{formatFileSize(image.file_size)}</dd>
              </div>
              <div className="rounded-xl bg-sky-100 dark:bg-slate-800 p-4">
                <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400"><CalendarDays className="size-4 text-sky-700 dark:text-sky-300" /> Added</dt>
                <dd className="mt-2 text-sm font-black text-slate-950 dark:text-slate-50">{formatDate(image.created_at)}</dd>
              </div>
            </dl>

            <Link
              href={backHref}
              className="mt-6 flex min-w-0 items-center gap-3 rounded-xl border border-sky-200 dark:border-slate-700 p-4 transition hover:border-sky-400 dark:hover:border-sky-300 hover:bg-sky-100 dark:hover:bg-slate-800"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-400 text-slate-950"><Images className="size-4" /></span>
              <span className="min-w-0"><span className="block truncate text-sm font-black text-slate-950 dark:text-slate-50">{gallery.name}</span><span className="text-[10px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Open gallery</span></span>
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
