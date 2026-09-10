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
      <div className="flex flex-col justify-between gap-8 rounded-3xl border border-[#d7e8ef] bg-white p-6 sm:flex-row sm:items-end sm:p-9">
        <div>
          <Badge variant="neutral"><span className="size-1.5 rounded-full bg-[#1f9d64]" /> {user.role} workspace / live</Badge>
          <h1 className="display-type mt-5 text-4xl sm:text-6xl">Good to see you, {user.name.split(" ")[0]}.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f8290]">Your visual library, processing queue, and face search in one precise workspace.</p>
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
            <Card key={stat.label} className="bg-[#eaf5ff]/70 shadow-none">
              <CardContent className="flex items-end justify-between p-5">
                <div>
                  <p className="technical-label text-[#6f8290]">{stat.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.07em]">{stat.value}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-white text-[#006397]"><Icon className="size-5" /></span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {creating ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="mt-6 border-[#92ccff] bg-[#eaf5ff]">
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <p className="technical-label text-[#006397]">01 / Gallery essentials</p>
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
          <p className="technical-label text-[#006397]">Your library / synchronized</p>
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
        <button type="button" onClick={() => setCreating(true)} className="system-grid mt-6 grid w-full place-items-center rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/70 px-6 py-20 text-center transition hover:border-[#30afff] hover:bg-[#def0ff]">
          <Plus className="size-9 text-[#006397]" />
          <span className="mt-4 text-lg font-black">Create your first gallery</span>
          <span className="mt-1 text-xs text-[#6f8290]">Then upload up to five frames at a time for processing.</span>
        </button>
      )}
    </>
  );
}
