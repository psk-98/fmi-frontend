"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ImagePlus, LoaderCircle, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ApiError, apiRequest } from "@/lib/api";
import {
  imageCollectionSchema,
  uploadImageSchema,
  type GalleryImage,
  type UploadImageValues,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function fileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadImageForm({
  galleryUid,
  onUploaded,
}: {
  galleryUid: string;
  onUploaded: (images: GalleryImage[]) => void;
}) {
  const [selected, setSelected] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UploadImageValues>({ resolver: zodResolver(uploadImageSchema) });
  const {
    name: imagesFieldName,
    ref: imagesFieldRef,
    onBlur: imagesFieldOnBlur,
    onChange: imagesFieldOnChange,
  } = form.register("images");

  async function submit(values: UploadImageValues) {
    form.clearErrors("root");
    const body = new FormData();
    Array.from(values.images).forEach((file) => body.append("images[]", file));

    try {
      const payload = await apiRequest<unknown>(`galleries/${galleryUid}/images`, {
        method: "POST",
        body,
      });
      const parsed = imageCollectionSchema.parse(payload);
      onUploaded(parsed.data);
      form.reset();
      setSelected([]);
    } catch (error) {
      form.setError("root", {
        message: error instanceof ApiError ? error.message : "Upload failed.",
      });
    }
  }

  function clearFiles() {
    form.resetField("images");
    if (inputRef.current) inputRef.current.value = "";
    setSelected([]);
  }

  function selectFiles(files: File[]) {
    const images = files.filter((file) => allowedImageTypes.has(file.type));

    if (!images.length) {
      form.setError("images", { message: "Drop JPG, PNG, or WebP images." });
      return;
    }

    if (images.length > 5) {
      form.setError("images", { message: "Choose no more than 5 images at once." });
      return;
    }

    const transfer = new DataTransfer();
    images.forEach((file) => transfer.items.add(file));
    if (inputRef.current) inputRef.current.files = transfer.files;
    form.setValue("images", transfer.files, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setSelected(images);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5" noValidate>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="gallery-images" className="technical-label text-[#20333e]">Batch ingest / dropzone</label>
          <span className="text-[10px] uppercase text-[#6f8290]">Max 5 files</span>
        </div>
        <input
          id="gallery-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          name={imagesFieldName}
          ref={(element) => {
            imagesFieldRef(element);
            inputRef.current = element;
          }}
          onBlur={imagesFieldOnBlur}
          onChange={(event) => {
            imagesFieldOnChange(event);
            selectFiles(Array.from(event.target.files ?? []));
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
          className={cn(
            "system-grid grid min-h-44 cursor-pointer place-items-center rounded-2xl border border-dashed border-[#cde5ef] bg-[#eaf5ff] px-4 py-8 text-center transition sm:min-h-56 sm:px-5 sm:py-10",
            isDragging
              ? "scale-[1.01] border-[#30afff] bg-[#d7ebfa] shadow-[0_0_0_4px_rgba(48,175,255,.12)]"
              : "hover:border-[#30afff] hover:bg-[#def0ff]",
          )}
        >
          <span className="pointer-events-none">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#d1e5f5] text-[#006397]">
              <UploadCloud className="size-7" />
            </span>
            <strong className="mt-5 block text-sm">
              {isDragging ? "Release to append images" : "Drag and drop JPG, PNG or WebP"}
            </strong>
            <span className="mt-2 block text-[10px] leading-5 text-[#6f8290]">Up to 10 MB per image · multi-face extraction enabled</span>
            <span className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#006397]">Browse files</span>
          </span>
        </label>
        {form.formState.errors.images?.message ? <p className="mt-2 text-xs text-[#ba1a1a]">{form.formState.errors.images.message}</p> : null}
      </div>

      {selected.length ? (
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="technical-label text-[#20333e]">Staged for ingestion</p>
            <button type="button" onClick={clearFiles} className="flex items-center gap-1 text-[10px] font-bold text-[#ba1a1a]"><X className="size-3" /> Clear</button>
          </div>
          <div className="mt-3 grid gap-2">
            {selected.map((file) => (
              <div key={`${file.name}-${file.lastModified}`} className="flex items-center gap-3 rounded-xl border border-[#d7e8ef] bg-white p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eaf5ff] text-[#006397]"><ImagePlus className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{file.name}</p>
                  <p className="mt-1 text-[10px] text-[#6f8290]">{fileSize(file.size)} · ready</p>
                </div>
                <CheckCircle2 className="size-5 shrink-0 text-[#1f9d64]" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {form.formState.errors.root?.message ? (
        <p className="rounded-xl bg-[#ffdad6] p-3 text-xs font-bold text-[#93000a]">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <UploadCloud />}
        Append {selected.length || ""} {selected.length === 1 ? "image" : "images"}
      </Button>
    </form>
  );
}
