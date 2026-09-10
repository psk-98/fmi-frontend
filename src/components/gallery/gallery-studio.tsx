"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Globe2,
  LockKeyhole,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UploadImageForm } from "@/components/forms/upload-image-form";
import { ImageCard } from "@/components/gallery/image-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { ConfirmModal } from "@/components/ui/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, apiRequest } from "@/lib/api";
import { galleryResponseSchema, type Gallery } from "@/lib/schemas";

type ImageSort = "date-desc" | "date-asc" | "faces-desc" | "faces-asc";

function imageCreatedAt(value?: string | null) {
  const timestamp = Date.parse(value ?? "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function GalleryStudio({ initialGallery }: { initialGallery: Gallery }) {
  const [gallery, setGallery] = useState(initialGallery);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reprocessing, setReprocessing] = useState(false);
  const [reprocessingImageUid, setReprocessingImageUid] = useState<
    string | null
  >(null);
  const [imageSort, setImageSort] = useState<ImageSort>("date-desc");
  const [pendingDeleteUid, setPendingDeleteUid] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const hasProcessingImages = useMemo(
    () =>
      gallery.images.some(
        (image) =>
          image.processing_status === "pending" ||
          image.processing_status === "processing",
      ),
    [gallery.images],
  );
  const unprocessedImagesCount = useMemo(
    () =>
      gallery.images.filter(
        (image) =>
          image.processing_status === "pending" ||
          image.processing_status === "failed",
      ).length,
    [gallery.images],
  );
  const visibleImages = useMemo(
    () =>
      gallery.images.toSorted((left, right) => {
        if (imageSort === "faces-desc") {
          return (right.face_count ?? 0) - (left.face_count ?? 0);
        }
        if (imageSort === "faces-asc") {
          return (left.face_count ?? 0) - (right.face_count ?? 0);
        }
        if (imageSort === "date-asc") {
          return imageCreatedAt(left.created_at) - imageCreatedAt(right.created_at);
        }
        return imageCreatedAt(right.created_at) - imageCreatedAt(left.created_at);
      }),
    [gallery.images, imageSort],
  );
  const pendingDeleteImage = gallery.images.find(
    (image) => image.uid === pendingDeleteUid,
  );

  const refresh = useCallback(async () => {
    try {
      const payload = await apiRequest<unknown>(`me/galleries/${gallery.uid}`);
      setGallery(galleryResponseSchema.parse(payload).data);
    } catch {
      setMessage("Could not refresh processing status.");
    }
  }, [gallery.uid]);

  useEffect(() => {
    if (!hasProcessingImages) return;
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [hasProcessingImages, refresh]);

  async function toggleVisibility() {
    setSaving(true);
    setMessage(null);
    const visibility = gallery.visibility === "public" ? "private" : "public";

    try {
      const payload = await apiRequest<unknown>(`galleries/${gallery.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      const updated = galleryResponseSchema.parse(payload).data;
      setGallery((current) => ({ ...current, visibility: updated.visibility }));
      setMessage(`Gallery is now ${visibility}.`);
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Could not update visibility.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage() {
    if (!pendingDeleteUid) return;

    setDeleting(true);
    setMessage(null);

    try {
      await apiRequest(`images/${pendingDeleteUid}`, { method: "DELETE" });
      setGallery((current) => ({
        ...current,
        images: current.images.filter((image) => image.uid !== pendingDeleteUid),
        images_count: Math.max(
          0,
          (current.images_count ?? current.images.length) - 1,
        ),
      }));
      setPendingDeleteUid(null);
      setMessage("The image was deleted.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Could not delete the image.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function reprocessUnprocessedImages() {
    setReprocessing(true);
    setMessage(null);

    try {
      await apiRequest(`galleries/${gallery.uid}/images/reprocess`, {
        method: "POST",
      });
      setGallery((current) => ({
        ...current,
        images: current.images.map((image) =>
          image.processing_status === "pending" ||
          image.processing_status === "failed"
            ? {
                ...image,
                processing_status: "pending" as const,
                processed_at: null,
              }
            : image,
        ),
      }));
      setMessage(`${unprocessedImagesCount} images were sent for reprocessing.`);
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Could not queue the unprocessed images.",
      );
    } finally {
      setReprocessing(false);
    }
  }

  async function reprocessImage(uid: string) {
    setReprocessingImageUid(uid);
    setMessage(null);

    try {
      await apiRequest(`images/${uid}/reprocess`, { method: "POST" });
      setGallery((current) => ({
        ...current,
        images: current.images.map((image) =>
          image.uid === uid
            ? {
                ...image,
                processing_status: "pending" as const,
                processed_at: null,
              }
            : image,
        ),
      }));
      setMessage("The image was sent for reprocessing.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Could not reprocess the image.",
      );
    } finally {
      setReprocessingImageUid(null);
    }
  }

  return (
    <>
      <Link
        href="/galleries"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#006397] hover:text-[#091e29]"
      >
        <ArrowLeft className="size-4" /> Back to galleries
      </Link>
      <div className="mt-7 grid items-end gap-8 rounded-3xl border border-[#d7e8ef] bg-white p-6 lg:grid-cols-[1fr_auto] sm:p-9">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={gallery.visibility === "public" ? "default" : "dark"}
            >
              {gallery.visibility === "public" ? (
                <Globe2 className="size-3" />
              ) : (
                <LockKeyhole className="size-3" />
              )}
              {gallery.visibility}
            </Badge>
            {hasProcessingImages ? (
              <Badge variant="warning">
                <RefreshCcw className="size-3 animate-spin" /> Processing
              </Badge>
            ) : null}
          </div>
          <h1 className="editorial-type mt-4 break-words text-4xl font-semibold sm:text-6xl">{gallery.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f8290]">
            {gallery.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShareButton
            path={
              gallery.visibility === "public"
                ? `/explore/galleries/${gallery.uid}`
                : `/galleries/${gallery.uid}`
            }
            label={gallery.name}
          />
          {unprocessedImagesCount ? (
            <Button
              variant="outline"
              onClick={reprocessUnprocessedImages}
              disabled={reprocessing}
            >
              <RefreshCcw className={reprocessing ? "animate-spin" : ""} />
              Reprocess {unprocessedImagesCount}
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href={`/search?gallery=${gallery.uid}`}>
              <Search /> Search
            </Link>
          </Button>
          <Button variant="outline" onClick={refresh}>
            <RefreshCcw /> Refresh
          </Button>
          <Button onClick={toggleVisibility} disabled={saving}>
            {gallery.visibility === "public" ? <LockKeyhole /> : <Globe2 />}{" "}
            Make {gallery.visibility === "public" ? "private" : "public"}
          </Button>
        </div>
      </div>

      {message ? (
        <p className="mt-5 rounded-xl border border-[#d7e8ef] bg-white px-4 py-3 text-xs font-bold text-[#3f5663]">
          {message}
        </p>
      ) : null}

      <div className="mt-7 grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <Card className="min-w-0 overflow-hidden lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5 text-[#006397]" /> Append artworks
            </CardTitle>
            <CardDescription>
              Every detected face receives its own searchable vector.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <UploadImageForm
              galleryUid={gallery.uid}
              onUploaded={(images) =>
                setGallery((current) => ({
                  ...current,
                  images: [...images, ...current.images],
                  images_count:
                    (current.images_count ?? current.images.length) + images.length,
                }))
              }
            />
          </CardContent>
        </Card>

        <div className="min-w-0">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="technical-label text-[#006397]">Gallery contents / synchronized</p><h2 className="display-type mt-1 text-2xl">Frames</h2></div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-[#6f8290]">
                {gallery.images.length} visible
              </span>
              <label className="relative min-w-0">
                <span className="sr-only">Sort gallery images</span>
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#006397]" />
                <select
                  value={imageSort}
                  onChange={(event) => setImageSort(event.target.value as ImageSort)}
                  className="h-10 w-full appearance-none rounded-xl border border-[#cde5ef] bg-white pl-9 pr-8 text-xs font-bold text-[#20333e] outline-none focus:border-[#30afff] focus:ring-2 focus:ring-[#30afff]/20 sm:w-44"
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="faces-desc">Most faces</option>
                  <option value="faces-asc">Least faces</option>
                </select>
              </label>
            </div>
          </div>
          {gallery.images.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleImages.map((image, index) => (
                <ImageCard
                  key={image.uid}
                  image={image}
                  index={index}
                  href={`/galleries/${gallery.uid}/images/${image.uid}`}
                  sharePath={`/galleries/${gallery.uid}/images/${image.uid}`}
                  actions={
                    <>
                      {image.processing_status === "pending" ||
                      image.processing_status === "failed" ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => reprocessImage(image.uid)}
                          disabled={
                            reprocessingImageUid === image.uid || reprocessing
                          }
                          aria-label="Reprocess image"
                          title="Reprocess image"
                        >
                          <RefreshCcw
                            className={
                              reprocessingImageUid === image.uid
                                ? "animate-spin"
                                : ""
                            }
                          />
                        </Button>
                      ) : null}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setPendingDeleteUid(image.uid)}
                        aria-label="Delete image"
                        title="Delete image"
                      >
                        <Trash2 />
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="system-grid mt-5 rounded-3xl border border-dashed border-[#cde5ef] bg-[#eaf5ff]/65 p-8 text-center text-xs text-[#6f8290] sm:p-16">
              Upload the first frame to start this visual index.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={pendingDeleteUid !== null}
        onClose={() => setPendingDeleteUid(null)}
        onConfirm={deleteImage}
        title="Delete this image?"
        description={`This permanently removes ${pendingDeleteImage?.original_name || "this image"} from the gallery. This action cannot be undone.`}
        confirmLabel="Delete image"
        pending={deleting}
      />
    </>
  );
}
