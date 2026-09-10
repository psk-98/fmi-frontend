import Link from "next/link";
import { ArrowLeft, ScanFace } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="page-shell grid min-h-[72vh] place-items-center py-16 text-center">
      <div className="max-w-lg">
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-[#d1e5f5] text-[#006397]">
          <ScanFace className="size-8" />
        </span>
        <p className="technical-label text-[#006397]">
          404 / no match
        </p>
        <h1 className="display-type mt-3 text-5xl">
          This frame is out of view.
        </h1>
        <p className="mt-4 text-[#6f8290]">
          The gallery or page may be private, moved, or no longer available.
        </p>
        <Button asChild className="mt-8">
          <Link href="/explore">
            <ArrowLeft /> Back to explore
          </Link>
        </Button>
      </div>
    </section>
  );
}
