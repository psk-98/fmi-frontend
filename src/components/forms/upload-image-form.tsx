"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Trash2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ApiError, apiRequest } from "@/lib/api";
import {
  imageCollectionSchema,
  uploadImageSchema,
  type GalleryImage,
  type UploadImageValues,
} from "@/lib/schemas";
import { cn, formatFileSize } from "@/lib/utils";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function UploadImageForm({
  galleryUid,
  storageRemainingBytes,
  onUploaded,
}: {
  galleryUid: string;
  storageRemainingBytes: number;
  onUploaded: (images: GalleryImage[]) => void;
}) {
  const [selected, setSelected] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const form = useForm<UploadImageValues>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: { images: [] },
  });
  const selectedBytes = selected.reduce((total, file) => total + file.size, 0);
  const exceedsStorage = selectedBytes > storageRemainingBytes;
  const storageIsFull = storageRemainingBytes <= 0;

  async function submit(values: UploadImageValues) {
    form.clearErrors("root");

    if (values.images.reduce((total, file) => total + file.size, 0) > storageRemainingBytes) {
      form.setError("images", {
        message: "These images exceed your available storage. Remove some images or free up space.",
      });
      return;
    }

    const body = new FormData();
    Array.from(values.images).forEach((file) => body.append("images[]", file));

    try {
      const payload = await apiRequest<unknown>(`galleries/${galleryUid}/images`, {
        method: "POST",
        body,
      });
      const parsed = imageCollectionSchema.parse(payload);
      onUploaded(parsed.data);
      form.reset({ images: [] });
      setSelected([]);
    } catch (error) {
      form.setError("root", {
        message: error instanceof ApiError
          ? (error.fields.images?.[0] ?? error.message)
          : "Upload failed.",
      });
    }
  }

  function clearFiles() {
    form.reset({ images: [] });
    setSelected([]);
  }

  function selectFiles(files: File[]) {
    form.clearErrors();

    if (!files.length) return;

    if (storageIsFull) {
      form.setError("images", {
        message: "Your storage is full. Delete images or a gallery before uploading more.",
      });
      return;
    }

    if (files.some((file) => !allowedImageTypes.has(file.type))) {
      form.setError("images", { message: "Drop JPG, PNG, or WebP images." });
      return;
    }

    const images = [...selected];

    files.forEach((file) => {
      const duplicate = images.some(
        (image) =>
          image.name === file.name &&
          image.size === file.size &&
          image.lastModified === file.lastModified,
      );

      if (!duplicate) images.push(file);
    });

    if (images.length > 5) {
      form.setError("images", { message: "Choose no more than 5 images at once." });
      return;
    }

    setSelected(images);
    form.setValue("images", images, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function removeFile(index: number) {
    const images = selected.filter((_, selectedIndex) => selectedIndex !== index);

    setSelected(images);
    form.setValue("images", images, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: images.length > 0,
    });

    if (!images.length) form.clearErrors("images");
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid min-w-0 gap-5" noValidate>
      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="gallery-images" className="technical-label text-slate-800 dark:text-slate-200">Batch ingest / dropzone</label>
          <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Max 5 files</span>
        </div>
        <input
          id="gallery-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          name="images"
          disabled={storageIsFull}
          onChange={(event) => {
            selectFiles(Array.from(event.target.files ?? []));
            event.currentTarget.value = "";
          }}
        />
        <label
          htmlFor="gallery-images"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            selectFiles(Array.from(event.dataTransfer.files));
          }}
          aria-disabled={storageIsFull}
          className={cn(
            "system-grid grid min-h-44 cursor-pointer place-items-center rounded-2xl border border-dashed border-sky-300 dark:border-slate-600 bg-sky-100 dark:bg-slate-800 px-4 py-8 text-center transition sm:min-h-56 sm:px-5 sm:py-10",
            storageIsFull
              ? "cursor-not-allowed opacity-65"
              : isDragging
              ? "scale-[1.01] border-sky-400 bg-sky-200 ring-4 ring-sky-400/15 dark:border-sky-300 dark:bg-slate-700 dark:ring-sky-300/15"
              : "hover:border-sky-400 dark:hover:border-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700",
          )}
        >
          <span className="pointer-events-none">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-sky-200 dark:bg-slate-700 text-sky-700 dark:text-sky-300">
              <UploadCloud className="size-7" />
            </span>
            <strong className="mt-5 block text-sm">
              {storageIsFull
                ? "Storage full"
                : isDragging
                  ? "Release to append images"
                  : "Drag and drop JPG, PNG or WebP"}
            </strong>
            <span className="mt-2 block text-[10px] leading-5 text-slate-500 dark:text-slate-400">
              {storageIsFull
                ? "Delete images or a gallery to upload again"
                : "Up to 10 MB per image · multi-face extraction enabled"}
            </span>
            {!storageIsFull ? <span className="mt-4 inline-flex rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-sky-700 dark:text-sky-300">Browse files</span> : null}
          </span>
        </label>
        {exceedsStorage ? (
          <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
            These images need {formatFileSize(selectedBytes)}, but only {formatFileSize(storageRemainingBytes)} is available.
          </p>
        ) : form.formState.errors.images?.message ? (
          <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">{form.formState.errors.images.message}</p>
        ) : null}
      </div>

      {selected.length ? (
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="technical-label text-slate-800 dark:text-slate-200">Staged for ingestion</p>
            <button type="button" onClick={clearFiles} className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300"><X className="size-3" /> Clear</button>
          </div>
          <div className="mt-3 grid min-w-0 gap-2">
            {selected.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}`} className="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300"><ImagePlus className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="block max-w-full truncate text-xs font-bold" title={file.name}>{file.name}</p>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{formatFileSize(file.size)} · ready</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-rose-300 dark:hover:bg-rose-950/60 dark:focus-visible:ring-sky-300"
                  aria-label={`Remove ${file.name}`}
                  title="Remove image"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {form.formState.errors.root?.message ? (
        <p className="rounded-xl bg-rose-100 dark:bg-rose-950/60 p-3 text-xs font-bold text-rose-950 dark:text-rose-200">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={!selected.length || exceedsStorage || form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <UploadCloud />}
        {selected.length
          ? `Append ${selected.length} ${selected.length === 1 ? "image" : "images"}`
          : "Choose images to append"}
      </Button>
    </form>
  );
}
