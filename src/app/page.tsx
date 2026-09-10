import Link from "next/link";
import { ArrowRight, Database, ScanFace, ShieldCheck, Sparkles } from "lucide-react";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { FaceCanvas } from "@/components/marketing/face-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicGalleries } from "@/lib/server-api";

export default async function HomePage() {
  const galleries = await getPublicGalleries();

  return (
    <>
      <section className="page-shell grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-18">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="cyan">
              <Sparkles className="size-3" /> Neural index online
            </Badge>
            <span className="technical-label text-slate-500 dark:text-slate-400">protocol / v2.4</span>
          </div>
          <h1 className="display-type mt-7 max-w-3xl text-[clamp(2.8rem,13vw,6.7rem)] leading-[.92] text-slate-950 dark:text-slate-50">
            Find any face.
            <span className="block text-sky-700 dark:text-sky-300">Across every frame.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Upload a frame, detect every person, and search your visual archive with a precise multi-face index.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">Start indexing <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/explore">Discover public work</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> Private by default
            </span>
            <span className="flex items-center gap-2">
              <Database className="size-4 text-sky-700 dark:text-sky-300" /> Vector similarity
            </span>
          </div>
        </div>
        <FaceCanvas />
      </section>

      <section id="how-it-works" className="border-y border-sky-200 dark:border-slate-700 bg-sky-100/65 dark:bg-slate-800/65 py-20">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="technical-label text-sky-700 dark:text-sky-300">Index protocol / 03 stages</p>
              <h2 className="display-type mt-4 max-w-xl text-4xl leading-[1.02] sm:text-5xl">
                A visual memory that understands the whole picture.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Ingest", "Add portraits, events, or full group photographs."],
                ["02", "Detect", "Map every visible face into its own searchable vector."],
                ["03", "Discover", "Rank close faces across every gallery you can access."],
              ].map(([number, title, copy]) => (
                <div key={number} className="rounded-2xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                  <span className="rounded-full bg-sky-200 dark:bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300">{number}</span>
                  <h3 className="mt-10 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="technical-label text-sky-700 dark:text-sky-300">Public index / live</p>
            <h2 className="display-type mt-3 text-4xl sm:text-5xl">Recently opened galleries.</h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/explore">View all <ArrowRight /></Link>
          </Button>
        </div>

        {galleries.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleries.slice(0, 3).map((gallery) => (
              <GalleryCard key={gallery.uid} gallery={gallery} href={`/explore/galleries/${gallery.uid}`} />
            ))}
          </div>
        ) : (
          <div className="system-grid mt-10 overflow-hidden rounded-3xl border border-sky-300 dark:border-slate-600 bg-sky-100 dark:bg-slate-800 p-10 sm:p-14">
            <ScanFace className="size-10 text-sky-700 dark:text-sky-300" />
            <h3 className="display-type mt-10 max-w-xl text-3xl">The public index is ready for its first collection.</h3>
            <p className="mt-3 max-w-lg text-xs leading-6 text-slate-600 dark:text-slate-300">
              Create a public gallery and publish approved frames here.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
