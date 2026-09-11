export default function Loading() {
  return (
    <div className="page-shell grid min-h-[70vh] place-items-center">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
        <span className="size-2 animate-pulse rounded-full bg-sky-400" />
        Loading the visual index…
      </div>
    </div>
  );
}
