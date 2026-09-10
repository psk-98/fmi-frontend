import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-14 hidden border-t border-[#d7e8ef] py-8 md:block">
      <div className="page-shell flex items-center justify-between gap-6 text-[11px] text-[#6f8290]">
        <Link href="/" className="flex items-center gap-2 font-black text-[#091e29]">
          <span className="size-2 rounded-full bg-[#30afff]" /> fmi
        </Link>
        <p>Precision visual indexing for curated image libraries.</p>
        <div className="flex gap-5 font-bold">
          <Link href="/explore" className="hover:text-[#006397]">Discover</Link>
          <Link href="/login" className="hover:text-[#006397]">Workspace</Link>
        </div>
      </div>
    </footer>
  );
}
