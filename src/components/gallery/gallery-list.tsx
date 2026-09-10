"use client";

import Link from "next/link";
import { ArrowUpDown, FolderSearch, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Gallery } from "@/lib/schemas";

type GallerySort = "date-desc" | "date-asc" | "name-asc" | "name-desc";

function createdAt(gallery: Gallery) {
  const timestamp = Date.parse(gallery.created_at ?? "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function GalleryList({ galleries }: { galleries: Gallery[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<GallerySort>("date-desc");

  const visibleGalleries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return galleries
      .filter((gallery) =>
        normalizedQuery
          ? gallery.name.toLocaleLowerCase().includes(normalizedQuery)
          : true,
      )
      .toSorted((left, right) => {
        if (sort === "name-asc") return left.name.localeCompare(right.name);
        if (sort === "name-desc") return right.name.localeCompare(left.name);
        if (sort === "date-asc") return createdAt(left) - createdAt(right);
        return createdAt(right) - createdAt(left);
      });
  }, [galleries, query, sort]);

  return (
    <>
      <div className="flex flex-col justify-between gap-6 border-b border-[#d7e8ef] pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="technical-label text-[#006397]">Protected library / gallery list</p>
          <h1 className="display-type mt-3 text-4xl sm:text-6xl">Your galleries.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f8290]">
            Find a gallery by name, change the order, or open a collection to append and process images.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard?create=1"><Plus /> New gallery</Link>
        </Button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="relative min-w-0">
          <span className="sr-only">Search galleries by name</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006397]" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search galleries by name"
            className="pr-11 pl-11"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[#6f8290] hover:bg-white hover:text-[#091e29]"
              aria-label="Clear gallery search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </label>
        <label className="relative min-w-0">
          <span className="sr-only">Sort galleries</span>
          <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#006397]" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as GallerySort)}
            className="h-13 w-full min-w-0 appearance-none rounded-xl border border-transparent bg-[#eaf5ff] pr-10 pl-11 text-sm font-bold text-[#20333e] outline-none focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20 sm:w-52"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="neutral">{visibleGalleries.length} shown</Badge>
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#6f8290]">
          Gallery-name search · visual search is separate
        </p>
      </div>

      {visibleGalleries.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleGalleries.map((gallery) => (
            <GalleryCard key={gallery.uid} gallery={gallery} href={`/galleries/${gallery.uid}`} />
          ))}
        </div>
      ) : (
        <div className="system-grid mt-6 grid min-h-72 place-items-center rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/70 p-8 text-center">
          <div>
            <FolderSearch className="mx-auto size-9 text-[#006397]" />
            <h2 className="mt-4 text-lg font-black">
              {galleries.length ? "No gallery matches that name" : "No galleries yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#6f8290]">
              {galleries.length
                ? "Try a shorter name or clear the search field."
                : "Create your first gallery, then append images from its protected workspace."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
