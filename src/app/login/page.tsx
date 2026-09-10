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
          <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#d7ebfa] text-[#006397] shadow-[0_18px_40px_-28px_rgba(0,99,151,.45)]">
            <Images className="size-9" />
          </span>
          <Badge variant="neutral" className="mt-5"><span className="size-1.5 rounded-full bg-[#006397]" /> Gallery / auth</Badge>
          <h1 className="display-type mt-5 text-4xl sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-sm text-[#557080]">The digital home for precision visual archives.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[#d7e8ef] bg-white p-6 shadow-[0_20px_70px_-42px_rgba(11,38,54,.4)] sm:p-10">
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-[#eaf5ff] p-1.5 text-sm font-bold">
            <span className="rounded-lg bg-[#30afff] px-4 py-3 text-center text-[#07141d]">Sign in</span>
            <Link href="/register" className="rounded-lg px-4 py-3 text-center text-[#3f5663] hover:bg-white">Create account</Link>
          </div>
          {expired === "1" ? (
            <p className="mb-6 rounded-xl bg-[#fff2d8] px-4 py-3 text-xs font-bold text-[#704d00]">
              Your session expired. Sign in again to continue.
            </p>
          ) : null}
          <LoginForm />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eaf5ff] p-4 text-xs text-[#3f5663]">
          <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#1f9d64]" /> Secure HTTP-only session</span>
          <Badge>live</Badge>
        </div>
        <p className="mt-7 text-center text-xs text-[#6f8290]">New to FMI? <Link href="/register" className="font-bold text-[#006397]">Create an account</Link></p>
      </div>
    </section>
  );
}
