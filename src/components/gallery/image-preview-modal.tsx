"use client";

import { CalendarDays, FileImage, Ruler, ScanFace } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ShareButton } from "@/components/ui/share-button";
import type { GalleryImage } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

function formatFileSize(bytes?: number | null) {
  if (!bytes) return "Unknown";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImagePreviewModal({
  image,
  open,
  onClose,
  sharePath,
}: {
  image: GalleryImage;
  open: boolean;
  onClose: () => void;
  sharePath?: string;
}) {
  const title = image.celebrity_name || image.original_name || "Untitled frame";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Gallery image preview"
      size="wide"
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(17rem,.6fr)]">
        <div className="relative min-h-[19rem] overflow-hidden rounded-2xl bg-[#07141d] sm:min-h-[32rem] lg:min-h-[38rem]">
          <div
            role="img"
            aria-label={title}
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                image.processing_status === "processed"
                  ? "default"
                  : image.processing_status === "failed"
                    ? "danger"
                    : "warning"
              }
            >
              {image.processing_status}
            </Badge>
            <Badge variant="neutral">
              <ScanFace className="size-3" /> {image.face_count ?? 0} faces
            </Badge>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#6f8290]">
            {image.description || "No description has been added to this image."}
          </p>

          {sharePath ? (
            <ShareButton path={sharePath} label={title} className="mt-5 w-full sm:w-auto" />
          ) : null}

          <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl bg-[#eaf5ff] p-4">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f8290]"><Ruler className="size-4 text-[#006397]" /> Dimensions</dt>
              <dd className="mt-2 font-black text-[#091e29]">{image.width ?? "—"} × {image.height ?? "—"}</dd>
            </div>
            <div className="rounded-xl bg-[#eaf5ff] p-4">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f8290]"><FileImage className="size-4 text-[#006397]" /> File size</dt>
              <dd className="mt-2 font-black text-[#091e29]">{formatFileSize(image.file_size)}</dd>
            </div>
            <div className="rounded-xl bg-[#eaf5ff] p-4">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f8290]"><CalendarDays className="size-4 text-[#006397]" /> Added</dt>
              <dd className="mt-2 font-black text-[#091e29]">{formatDate(image.created_at)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Modal>
  );
}
