import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { TOKEN_COOKIE } from "@/lib/auth";
import { loginResponseSchema, registerFormSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const input = registerFormSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json(
      { message: "Check the highlighted fields.", errors: input.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const baseUrl = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/v1";

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/register`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ name: input.data.name, email: input.data.email, password: input.data.password }),
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json(payload, { status: response.status });

    const registration = loginResponseSchema.safeParse(payload);
    if (!registration.success) {
      return NextResponse.json({ message: "The API returned an invalid registration response." }, { status: 502 });
    }

    (await cookies()).set(TOKEN_COOKIE, registration.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ user: registration.data.user }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "The Laravel API is unavailable." }, { status: 502 });
  }
}
