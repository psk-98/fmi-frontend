"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  FolderPlus,
  ImageUp,
  LoaderCircle,
  ScanFace,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ImageCard } from "@/components/gallery/image-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, apiRequest } from "@/lib/api";
import {
  imageCollectionSchema,
  searchImageSchema,
  type Gallery,
  type GalleryImage,
  type SearchImageValues,
} from "@/lib/schemas";

export function SearchWorkspace({
  galleries,
  initialGalleryUid,
}: {
  galleries: Gallery[];
  initialGalleryUid?: string;
}) {
  const [results, setResults] = useState<GalleryImage[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm<SearchImageValues>({
    resolver: zodResolver(searchImageSchema),
    defaultValues: {
      gallery_uid:
        galleries.find((gallery) => gallery.uid === initialGalleryUid)?.uid ??
        galleries[0]?.uid ??
        "",
      limit: 20,
    },
  });
  const selectedGalleryUid = useWatch({
    control: form.control,
    name: "gallery_uid",
  });
  const selectedGallery = galleries.find(
    (gallery) => gallery.uid === selectedGalleryUid,
  );
  const {
    name: fileFieldName,
    ref: fileFieldRef,
    onBlur: fileFieldOnBlur,
    onChange: fileFieldOnChange,
  } = form.register("image");

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function submit(values: SearchImageValues) {
    const file = values.image[0];
    if (!file) return;
    form.clearErrors("root");

    const body = new FormData();
    body.set("image", file);
    body.set("limit", String(values.limit));

    try {
      const payload = await apiRequest<unknown>(
        `galleries/${values.gallery_uid}/images/search`,
        {
          method: "POST",
          body,
        },
      );
      setResults(imageCollectionSchema.parse(payload).data);
      setHasSearched(true);
    } catch (error) {
      setResults([]);
      setHasSearched(true);
      form.setError("root", {
        message: error instanceof ApiError ? error.message : "Search failed.",
      });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[24rem_1fr]">
      <div>
        <div className="lg:sticky lg:top-24">
          <Badge>
            <Sparkles className="size-3" /> Vector search
          </Badge>
          <h1 className="display-type mt-5 text-4xl leading-[.95] sm:text-6xl">
            Search faces inside one gallery.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6f8290]">
            Choose the collection first, then drop in a face or group photo.
            Results never spill into a different gallery.
          </p>

          <form
            onSubmit={form.handleSubmit(submit)}
            className="mt-8 grid gap-4"
            noValidate
          >
            <Field
              label="Gallery scope"
              htmlFor="search-gallery"
              hint="Required"
              error={form.formState.errors.gallery_uid?.message}
            >
              <select
                id="search-gallery"
                className="h-13 w-full min-w-0 rounded-xl border border-transparent bg-[#eaf5ff] px-4 text-sm font-bold text-[#091e29] outline-none focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20"
                {...form.register("gallery_uid", {
                  onChange: () => {
                    setResults([]);
                    setHasSearched(false);
                  },
                })}
              >
                {galleries.length ? null : <option value="">No galleries available</option>}
                {galleries.map((gallery) => (
                  <option key={gallery.uid} value={gallery.uid}>{gallery.name}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Search image"
              htmlFor="search-image"
              hint="One or more faces"
              error={form.formState.errors.image?.message}
            >
              <Input
                id="search-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                name={fileFieldName}
                ref={fileFieldRef}
                onBlur={fileFieldOnBlur}
                onChange={(event) => {
                  fileFieldOnChange(event);
                  const file = event.target.files?.[0];
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </Field>
            {preview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#07141d]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${JSON.stringify(preview).slice(1, -1)})`,
                  }}
                />
                <div className="absolute inset-5 rounded-2xl border border-[#92eeff]/70">
                  <span className="absolute -left-px -top-px size-4 border-l-2 border-t-2 border-[#92eeff]" />
                  <span className="absolute -bottom-px -right-px size-4 border-b-2 border-r-2 border-[#92eeff]" />
                </div>
              </motion.div>
            ) : (
              <div className="system-grid grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-[#cde5ef] bg-[#eaf5ff] text-center">
                <div>
                  <ImageUp className="mx-auto size-8 text-[#006397]" />
                  <p className="mt-3 text-xs font-semibold text-[#6f8290]">
                    Preview appears here
                  </p>
                </div>
              </div>
            )}
            <Field
              label="Maximum matches"
              htmlFor="search-limit"
              error={form.formState.errors.limit?.message}
            >
              <Input
                id="search-limit"
                type="number"
                min={1}
                max={50}
                {...form.register("limit", { valueAsNumber: true })}
              />
            </Field>
            {form.formState.errors.root?.message ? (
              <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting || !galleries.length}
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Search />
              )}
              Search selected gallery
            </Button>
            {!galleries.length ? (
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard?create=1"><FolderPlus /> Create a gallery first</Link>
              </Button>
            ) : null}
          </form>
        </div>
      </div>

      <div className="min-h-[34rem] border-t border-[#d7e8ef] pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="technical-label text-[#006397]">
              Face matches / {selectedGallery?.name ?? "choose gallery"}
            </p>
            <h2 className="display-type mt-2 text-4xl">Closest frames</h2>
          </div>
          {hasSearched ? (
            <span className="text-xs font-semibold text-[#6f8290]">
              {results.length} results
            </span>
          ) : null}
        </div>

        <AnimatePresence mode="popLayout">
          {results.length ? (
            <motion.div
              layout
              className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {results.map((image, index) => (
                <ImageCard
                  key={image.uid}
                  image={image}
                  index={index}
                  href={selectedGalleryUid ? `/galleries/${selectedGalleryUid}/images/${image.uid}` : undefined}
                  sharePath={selectedGalleryUid ? `/galleries/${selectedGalleryUid}/images/${image.uid}` : undefined}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={hasSearched ? "empty" : "start"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="system-grid mt-7 grid min-h-[28rem] place-items-center rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/65 p-8 text-center"
            >
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#d1e5f5] text-[#006397]">
                  <ScanFace className="size-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold">
                  {hasSearched
                    ? "No close faces found"
                    : "Your results will build here"}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6f8290]">
                  {hasSearched
                    ? "Try a brighter, front-facing image or expand the number of results."
                    : "We will rank matches by the strongest face-to-face cosine similarity."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
