import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, CalendarDays, Grid2X2, Images, MapPin, ScanSearch } from "lucide-react";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StorageUsage } from "@/components/ui/storage-usage";
import { getMyGalleries, requireCurrentUser } from "@/lib/server-api";
import { formatDate, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireCurrentUser();
  const galleries = await getMyGalleries();
  const frameCount = galleries.reduce(
    (total, gallery) => total + (gallery.images_count ?? gallery.images.length),
    0,
  );

  return (
    <section className="pb-10">
      <div className="system-grid h-40 border-b border-sky-200 dark:border-slate-700 bg-gradient-to-r from-cyan-200/55 dark:from-cyan-400/25 via-sky-100 dark:via-slate-800 to-lime-200/65 dark:to-lime-400/20 sm:h-52" />
      <div className="page-shell -mt-14">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="relative grid size-24 place-items-center rounded-2xl border-4 border-sky-50 dark:border-slate-950 bg-slate-800 text-2xl font-black text-white shadow-lg">
              {initials(user.name)}
              <span className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-sky-50 dark:border-slate-950 bg-emerald-500 dark:bg-emerald-400" />
            </div>
            <h1 className="editorial-type mt-4 break-words text-4xl font-semibold">{user.name}</h1>
            <p className="mt-1 flex min-w-0 items-start gap-2 break-all text-xs font-bold text-sky-700 dark:text-sky-300"><AtSign className="mt-0.5 size-3.5 shrink-0" /> {user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link href="/search"><ScanSearch /> Search faces</Link></Button>
            <Button asChild><Link href="/dashboard?create=1">New gallery</Link></Button>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Visual curator and archive owner. Building searchable collections through precise multi-face indexing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge><span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Active curator</Badge>
          <Badge variant="neutral"><MapPin className="size-3" /> FMI network</Badge>
          <Badge variant="neutral"><CalendarDays className="size-3" /> Joined {formatDate(user.created_at)}</Badge>
        </div>

        <StorageUsage
          className="mt-6"
          usedBytes={user.storage_used_bytes}
          quotaBytes={user.storage_quota_bytes}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Galleries", galleries.length, Grid2X2],
            ["Indexed frames", frameCount, Images],
            ["Public sets", galleries.filter((gallery) => gallery.visibility === "public").length, ScanSearch],
          ].map(([label, value, Icon]) => {
            const IconComponent = Icon as typeof Grid2X2;
            return (
              <div key={String(label)} className="rounded-2xl bg-sky-100 dark:bg-slate-800 p-5">
                <IconComponent className="size-5 text-sky-700 dark:text-sky-300" />
                <p className="mt-5 text-3xl font-black">{String(value).padStart(2, "0")}</p>
                <p className="technical-label mt-1 text-slate-500 dark:text-slate-400">{String(label)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
          <div><p className="technical-label text-sky-700 dark:text-sky-300">Creator profile / collections</p><h2 className="display-type mt-2 text-3xl">Curated galleries</h2></div>
          <Badge variant="neutral">{galleries.length} sets</Badge>
        </div>

        {galleries.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => <GalleryCard key={gallery.uid} gallery={gallery} href={`/galleries/${gallery.uid}`} />)}
          </div>
        ) : (
          <div className="system-grid mt-6 rounded-3xl border border-dashed border-sky-300 dark:border-slate-600 bg-sky-100 dark:bg-slate-800 p-8 text-center text-xs text-slate-500 dark:text-slate-400 sm:p-16">No curated galleries yet.</div>
        )}
      </div>
    </section>
  );
}
