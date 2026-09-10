import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Images, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { expired } = await searchParams;

  return (
    <section className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-sky-200 text-sky-700 shadow-xl shadow-sky-900/10 dark:bg-slate-700 dark:text-sky-300 dark:shadow-black/25">
            <Images className="size-9" />
          </span>
          <Badge variant="neutral" className="mt-5"><span className="size-1.5 rounded-full bg-sky-700 dark:bg-sky-300" /> Gallery / auth</Badge>
          <h1 className="display-type mt-5 text-4xl sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">The digital home for precision visual archives.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-sky-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 sm:p-10">
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-sky-100 dark:bg-slate-800 p-1.5 text-sm font-bold">
            <span className="rounded-lg bg-sky-400 px-4 py-3 text-center text-slate-950">Sign in</span>
            <Link href="/register" className="rounded-lg px-4 py-3 text-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900">Create account</Link>
          </div>
          {expired === "1" ? (
            <p className="mb-6 rounded-xl bg-amber-100 dark:bg-amber-950/60 px-4 py-3 text-xs font-bold text-amber-900 dark:text-amber-200">
              Your session expired. Sign in again to continue.
            </p>
          ) : null}
          <LoginForm />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sky-100 dark:bg-slate-800 p-4 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> Secure HTTP-only session</span>
          <Badge>live</Badge>
        </div>
        <p className="mt-7 text-center text-xs text-slate-500 dark:text-slate-400">New to FMI? <Link href="/register" className="font-bold text-sky-700 dark:text-sky-300">Create an account</Link></p>
      </div>
    </section>
  );
}
