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
      <header className="sticky top-0 z-50 border-b border-[#d7e8ef]/90 bg-[#f7fcff]/92 backdrop-blur-2xl">
        <div className="page-shell flex h-16 items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="FMI home">
            <span className="size-2.5 rounded-full bg-[#30afff] shadow-[0_0_0_4px_rgba(48,175,255,.08)]" />
            <span className="text-xl font-black tracking-[-0.08em]">fmi</span>
            <span className="hidden text-[10px] uppercase tracking-[0.15em] text-[#6f8290] sm:block">
              face / media / index
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-bold text-[#6f8290] transition hover:bg-[#eaf5ff] hover:text-[#091e29]",
                  isActive(pathname, link.href) && "bg-[#eaf5ff] text-[#006397]",
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
                    "rounded-lg px-4 py-2 text-xs font-bold text-[#6f8290] transition hover:bg-[#eaf5ff] hover:text-[#091e29]",
                    isActive(pathname, "/dashboard") && "bg-[#eaf5ff] text-[#006397]",
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/galleries"
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold text-[#6f8290] transition hover:bg-[#eaf5ff] hover:text-[#091e29]",
                    isActive(pathname, "/galleries") && "bg-[#eaf5ff] text-[#006397]",
                  )}
                >
                  Galleries
                </Link>
                <Link
                  href="/search"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-[#6f8290] transition hover:bg-[#eaf5ff] hover:text-[#091e29]",
                    isActive(pathname, "/search") && "bg-[#eaf5ff] text-[#006397]",
                  )}
                >
                  <ScanSearch className="size-3.5" /> Visual search
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d7e8ef] bg-[#f7fcff]/95 px-3 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl md:hidden"
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
                  "flex min-w-0 flex-1 flex-col items-center gap-1 text-[9px] text-[#3f5663]",
                  isActive(pathname, link.href) && "text-[#006397]",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full",
                    center && "-mt-7 size-12 bg-[#30afff] text-[#07141d] shadow-[0_8px_24px_-8px_rgba(0,99,151,.65)]",
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
