"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginFormSchema, type LoginFormValues } from "@/lib/schemas";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function submit(values: LoginFormValues) {
    form.clearErrors("root");

    try {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        for (const [field, messages] of Object.entries(payload.errors ?? {})) {
          if (field === "email" || field === "password") form.setError(field, { message: messages[0] });
        }
        form.setError("root", { message: payload.message ?? "Unable to sign in." });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      form.setError("root", { message: "The application is currently unavailable." });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6" noValidate>
      <Field label="Identifier" htmlFor="email" hint="Email" error={form.formState.errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-700 dark:text-sky-300" />
          <Input id="email" type="email" autoComplete="email" placeholder="curator@fmi.gallery" className="pl-11" {...form.register("email")} />
        </div>
      </Field>
      <Field label="Access key" htmlFor="password" hint="Secure" error={form.formState.errors.password?.message}>
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-700 dark:text-sky-300" />
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••••" className="pl-11" {...form.register("password")} />
        </div>
      </Field>

      {form.formState.errors.root?.message ? (
        <p className="rounded-xl bg-rose-100 dark:bg-rose-950/60 px-4 py-3 text-xs font-bold text-rose-950 dark:text-rose-200">{form.formState.errors.root.message}</p>
      ) : null}

      <Button type="submit" size="lg" className="mt-1 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : null}
        Sign in <ArrowRight />
      </Button>

      <button
        type="button"
        className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 transition hover:text-sky-700 dark:hover:text-sky-300"
        onClick={() => {
          form.setValue("email", "naledi@fmi.test", { shouldValidate: true });
          form.setValue("password", "password", { shouldValidate: true });
        }}
      >
        Use seeded photographer account
      </button>
    </form>
  );
}
