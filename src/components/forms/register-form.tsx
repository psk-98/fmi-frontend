"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerFormSchema, type RegisterFormValues } from "@/lib/schemas";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", password_confirmation: "", terms: false },
  });

  async function submit(values: RegisterFormValues) {
    form.clearErrors("root");
    try {
      const response = await fetch("/api/session/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as { message?: string; errors?: Record<string, string[]> };

      if (!response.ok) {
        for (const [field, messages] of Object.entries(payload.errors ?? {})) {
          if (field === "name" || field === "email" || field === "password") {
            form.setError(field, { message: messages[0] });
          }
        }
        form.setError("root", { message: payload.message ?? "Unable to create the account." });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      form.setError("root", { message: "The application is currently unavailable." });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5" noValidate>
      <Field label="Artist handle / name" htmlFor="register-name" hint="Public identifier" error={form.formState.errors.name?.message}>
        <div className="relative">
          <UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-700 dark:text-sky-300" />
          <Input id="register-name" autoComplete="name" placeholder="e.g. Naledi or Studio 09" className="pl-11" {...form.register("name")} />
        </div>
      </Field>
      <Field label="Curator electronic mail" htmlFor="register-email" hint="Login key" error={form.formState.errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-700 dark:text-sky-300" />
          <Input id="register-email" type="email" autoComplete="email" placeholder="archivist@example.org" className="pl-11" {...form.register("email")} />
        </div>
      </Field>
      <Field label="Access key / password" htmlFor="register-password" hint="Min. 10 chars" error={form.formState.errors.password?.message}>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-700 dark:text-sky-300" />
          <Input id="register-password" type="password" autoComplete="new-password" placeholder="••••••••••" className="pl-11" {...form.register("password")} />
        </div>
      </Field>
      <Field label="Confirm access key" htmlFor="register-password-confirmation" hint="Re-enter exactly" error={form.formState.errors.password_confirmation?.message}>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
          <Input id="register-password-confirmation" type="password" autoComplete="new-password" placeholder="••••••••••" className="pl-11" {...form.register("password_confirmation")} />
        </div>
      </Field>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-xs leading-5 text-slate-600 dark:text-slate-300">
        <input type="checkbox" className="mt-0.5 size-4 accent-sky-400" {...form.register("terms")} />
        <span>I accept the <strong className="text-sky-700 dark:text-sky-300">Curation Guidelines</strong> and respectful gallery standards.</span>
      </label>
      {form.formState.errors.terms?.message ? <p className="text-xs text-rose-700 dark:text-rose-300">{form.formState.errors.terms.message}</p> : null}
      {form.formState.errors.root?.message ? <p className="rounded-xl bg-rose-100 dark:bg-rose-950/60 px-4 py-3 text-xs font-bold text-rose-950 dark:text-rose-200">{form.formState.errors.root.message}</p> : null}

      <Button type="submit" size="lg" className="mt-2 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : null}
        Create account <ArrowRight />
      </Button>
    </form>
  );
}
