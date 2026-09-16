import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-14 hidden border-t border-sky-200 dark:border-slate-700 py-8 md:block">
      <div className="page-shell flex items-center justify-between gap-6 text-[11px] text-slate-500 dark:text-slate-400">
        <Link href="/" className="flex items-center gap-2 font-black text-slate-950 dark:text-slate-50">
          <span className="size-2 rounded-full bg-sky-400" /> fmi
        </Link>
        <p>Precision visual indexing for curated image libraries.</p>
        <div className="flex gap-5 font-bold">
          <Link href="/explore" className="hover:text-sky-700 dark:hover:text-sky-300">Discover</Link>
          <Link href="/login" className="hover:text-sky-700 dark:hover:text-sky-300">Workspace</Link>
        </div>
      </div>
    </footer>
  );
}
