import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, ShieldCheck, Sparkles } from "lucide-react";

import { RegisterForm } from "@/components/forms/register-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/server-api";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <section className="page-shell py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="technical-label flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="size-2 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Auth / register protocol</p>
          <Badge variant="neutral"><ShieldCheck className="size-3" /> Secure session</Badge>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-xl bg-sky-100 dark:bg-slate-800 p-1.5 text-sm font-bold">
          <Link href="/login" className="rounded-lg px-4 py-3 text-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900">Sign in</Link>
          <span className="rounded-lg bg-sky-400 px-4 py-3 text-center text-slate-950">Create account</span>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display-type text-4xl sm:text-5xl">Create account</h1>
            <Badge variant="neutral">Entry</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Join FMI to curate, archive, and search precision visual collections.</p>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {[Sparkles, Box, ShieldCheck].map((Icon, index) => (
            <div key={index} className="system-grid grid h-24 place-items-center rounded-2xl border border-sky-200 dark:border-slate-700 bg-gradient-to-br from-white dark:from-slate-900 to-sky-200 dark:to-slate-700 text-sky-700 dark:text-sky-300">
              <Icon className="size-6" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-sky-200 bg-white/75 p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-black/30 sm:p-8">
          <RegisterForm />
        </div>

        <div className="mt-6 rounded-2xl bg-sky-200 dark:bg-slate-700 p-5 text-xs leading-6 text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-4 font-bold text-slate-950 dark:text-slate-50"><span className="flex items-center gap-2"><Box className="size-4 shrink-0 text-teal-700 dark:text-teal-300" /> Curated vault integrity</span><Badge>active</Badge></div>
          <p className="mt-3">Your account begins private. You choose which approved galleries and frames become discoverable.</p>
        </div>
      </div>
    </section>
  );
}
