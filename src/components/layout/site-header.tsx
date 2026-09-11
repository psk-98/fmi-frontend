"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleUserRound,
  Compass,
  Grid2X2,
  Images,
  LayoutDashboard,
  LogOut,
  Plus,
  ScanSearch,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { User } from "@/lib/schemas";
import { cn, initials } from "@/lib/utils";

const publicLinks = [
  { href: "/explore", label: "Discover" },
  { href: "/#how-it-works", label: "Protocol" },
];

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/, 1)[0];
  return path === "/" ? pathname === path : pathname.startsWith(path);
}

export function SiteHeader({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/session/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const mobileLinks = user
    ? [
      { href: "/dashboard", label: "Home", icon: LayoutDashboard },
      { href: "/galleries", label: "Gallery", icon: Grid2X2 },
      { href: "/dashboard?create=1", label: "New", icon: Plus },
      { href: "/search", label: "Search", icon: ScanSearch },
      { href: "/profile", label: "Profile", icon: CircleUserRound },
      ]
    : [
        { href: "/", label: "Home", icon: Compass },
        { href: "/explore", label: "Discover", icon: Images },
        { href: "/login", label: "Sign in", icon: CircleUserRound },
      ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sky-200/90 dark:border-slate-700/90 bg-sky-50/92 dark:bg-slate-950/92 backdrop-blur-2xl">
        <div className="page-shell flex h-16 items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="FMI home">
            <span className="size-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/10" />
            <span className="text-xl font-black tracking-[-0.08em]">fmi</span>
            <span className="hidden text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 sm:block">
              face / media / index
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 transition hover:bg-sky-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50",
                  isActive(pathname, link.href) && "bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 transition hover:bg-sky-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50",
                    isActive(pathname, "/dashboard") && "bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300",
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/galleries"
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 transition hover:bg-sky-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50",
                    isActive(pathname, "/galleries") && "bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300",
                  )}
                >
                  Galleries
                </Link>
                <Link
                  href="/search"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 transition hover:bg-sky-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50",
                    isActive(pathname, "/search") && "bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300",
                  )}
                >
                  <ScanSearch className="size-3.5" /> Visual search
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" aria-label="Search">
              <Link href={user ? "/search" : "/explore"}>
                <Search />
              </Link>
            </Button>
            {user ? (
              <>
                <Button asChild variant="dark" size="icon" aria-label="Open profile">
                  <Link href="/profile">
                    <span className="text-[10px] font-black">{initials(user.name)}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:inline-flex"
                  onClick={logout}
                  disabled={loggingOut}
                  aria-label="Log out"
                >
                  <LogOut />
                </Button>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-sky-200 dark:border-slate-700 bg-sky-50/95 dark:bg-slate-950/95 px-3 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-md items-end">
          {mobileLinks.map((link, index) => {
            const Icon = link.icon;
            const center = user ? index === 2 : index === 1;
            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                aria-label={user && center ? "Add a gallery" : link.label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 text-[9px] text-slate-600 dark:text-slate-300",
                  isActive(pathname, link.href) && "text-sky-700 dark:text-sky-300",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full",
                    center && "-mt-7 size-12 bg-sky-400 text-slate-950 shadow-lg shadow-sky-900/30",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>{center && user ? "New" : link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
