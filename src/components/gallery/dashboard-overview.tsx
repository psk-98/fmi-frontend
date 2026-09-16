"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, FolderOpen, Images, Plus, ScanSearch, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CreateGalleryForm } from "@/components/forms/create-gallery-form";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageUsage } from "@/components/ui/storage-usage";
import type { Gallery, User } from "@/lib/schemas";

export function DashboardOverview({
  initialGalleries,
  user,
  startCreating = false,
}: {
  initialGalleries: Gallery[];
  user: User;
  startCreating?: boolean;
}) {
  const [galleries, setGalleries] = useState(initialGalleries);
  const [creating, setCreating] = useState(startCreating);
  const frameCount = useMemo(
    () => galleries.reduce((total, gallery) => total + (gallery.images_count ?? gallery.images.length), 0),
    [galleries],
  );
  const stats = [
    { label: "Collections", value: galleries.length, icon: FolderOpen },
    { label: "Indexed frames", value: frameCount, icon: Images },
    { label: "Public galleries", value: galleries.filter((gallery) => gallery.visibility === "public").length, icon: ScanSearch },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-8 rounded-3xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:flex-row sm:items-end sm:p-9">
        <div>
          <Badge variant="neutral"><span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> {user.role} workspace / live</Badge>
          <h1 className="display-type mt-5 text-4xl sm:text-6xl">Good to see you, {user.name.split(" ")[0]}.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Your visual library, processing queue, and face search in one precise workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link href="/search"><ScanSearch /> Search a face</Link></Button>
          <Button onClick={() => setCreating(true)}><Plus /> New gallery</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-sky-100/70 dark:bg-slate-800/70 shadow-none">
              <CardContent className="flex items-end justify-between p-5">
                <div>
                  <p className="technical-label text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.07em]">{stat.value}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300"><Icon className="size-5" /></span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <StorageUsage
        className="mt-4"
        usedBytes={user.storage_used_bytes}
        quotaBytes={user.storage_quota_bytes}
      />

      <AnimatePresence>
        {creating ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="mt-6 border-sky-300 dark:border-sky-600 bg-sky-100 dark:bg-slate-800">
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <p className="technical-label text-sky-700 dark:text-sky-300">01 / Gallery essentials</p>
                  <CardTitle className="mt-2">Create a gallery</CardTitle>
                  <CardDescription>Start private; publish whenever the collection is ready.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setCreating(false)} aria-label="Close form"><X /></Button>
              </CardHeader>
              <CardContent>
                <CreateGalleryForm
                  onCreated={(gallery) => {
                    setGalleries((current) => [gallery, ...current]);
                    setCreating(false);
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="technical-label text-sky-700 dark:text-sky-300">Your library / synchronized</p>
          <h2 className="display-type mt-2 text-3xl sm:text-4xl">Recent galleries</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{galleries.length} total</Badge>
          <Button asChild variant="ghost" size="sm"><Link href="/galleries">View all <ArrowRight /></Link></Button>
        </div>
      </div>

      {galleries.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleries.slice(0, 6).map((gallery) => <GalleryCard key={gallery.uid} gallery={gallery} href={`/galleries/${gallery.uid}`} />)}
        </div>
      ) : (
        <button type="button" onClick={() => setCreating(true)} className="system-grid mt-6 grid w-full place-items-center rounded-3xl border border-dashed border-sky-300 dark:border-slate-600 bg-sky-100/70 dark:bg-slate-800/70 px-6 py-20 text-center transition hover:border-sky-400 dark:hover:border-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700">
          <Plus className="size-9 text-sky-700 dark:text-sky-300" />
          <span className="mt-4 text-lg font-black">Create your first gallery</span>
          <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Then upload up to five frames at a time for processing.</span>
        </button>
      )}
    </>
  );
}
