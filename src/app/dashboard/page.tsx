import type { Metadata } from "next";

import { DashboardOverview } from "@/components/gallery/dashboard-overview";
import { getMyGalleries, requireCurrentUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Workspace" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const user = await requireCurrentUser();
  const galleries = await getMyGalleries();
  const { create } = await searchParams;

  return (
    <section className="page-shell py-12 sm:py-16">
      <DashboardOverview
        initialGalleries={galleries}
        user={user}
        startCreating={create === "1"}
      />
    </section>
  );
}
