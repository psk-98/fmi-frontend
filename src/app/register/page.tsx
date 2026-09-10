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
          <p className="technical-label flex items-center gap-2 text-[#3f5663]"><span className="size-2 rounded-full bg-[#1f9d64]" /> Auth / register protocol</p>
          <Badge variant="neutral"><ShieldCheck className="size-3" /> Secure session</Badge>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#eaf5ff] p-1.5 text-sm font-bold">
          <Link href="/login" className="rounded-lg px-4 py-3 text-center text-[#3f5663] hover:bg-white">Sign in</Link>
          <span className="rounded-lg bg-[#30afff] px-4 py-3 text-center text-[#07141d]">Create account</span>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display-type text-4xl sm:text-5xl">Create account</h1>
            <Badge variant="neutral">Entry</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#557080]">Join FMI to curate, archive, and search precision visual collections.</p>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {[Sparkles, Box, ShieldCheck].map((Icon, index) => (
            <div key={index} className="system-grid grid h-24 place-items-center rounded-2xl border border-[#d7e8ef] bg-gradient-to-br from-white to-[#d7ebfa] text-[#006397]">
              <Icon className="size-6" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[#d7e8ef] bg-white/75 p-5 shadow-[0_20px_60px_-44px_rgba(11,38,54,.35)] sm:p-8">
          <RegisterForm />
        </div>

        <div className="mt-6 rounded-2xl bg-[#d7ebfa] p-5 text-xs leading-6 text-[#3f5663]">
          <div className="flex flex-wrap items-center justify-between gap-4 font-bold text-[#091e29]"><span className="flex items-center gap-2"><Box className="size-4 shrink-0 text-[#006875]" /> Curated vault integrity</span><Badge>active</Badge></div>
          <p className="mt-3">Your account begins private. You choose which approved galleries and frames become discoverable.</p>
        </div>
      </div>
    </section>
  );
}
