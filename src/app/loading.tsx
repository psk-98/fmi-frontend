export default function Loading() {
  return (
    <div className="page-shell grid min-h-[70vh] place-items-center">
      <div className="flex items-center gap-3 text-sm font-semibold text-[#6f8290]">
        <span className="size-2 animate-pulse rounded-full bg-[#30afff]" />
        Loading the visual index…
      </div>
    </div>
  );
}
