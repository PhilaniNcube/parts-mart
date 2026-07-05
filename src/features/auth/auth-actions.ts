"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type ActionResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string };

const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "vendor"]),
  businessName: z.string().optional(),
  city: z.string().optional(),
}).refine((data) => {
  if (data.role === "vendor" && !data.city) {
    return false;
  }
  return true;
}, {
  message: "City is required for vendors",
  path: ["city"],
});

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const parsed = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    businessName: formData.get("businessName") || undefined,
    city: formData.get("city") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, parsed.data.email)).limit(1);
  if (existing.length) return { ok: false, error: "An account with that email already exists." };

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role,
        businessName: parsed.data.businessName ?? null,
        city: parsed.data.city ?? null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign up failed.";
    return { ok: false, error: message };
  }
  return { ok: true, redirectTo: "/account" };
}

export async function signInAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Email and password are required." };

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch {
    return { ok: false, error: "Invalid email or password." };
  }
  return { ok: true, redirectTo: "/account" };
}

export async function signOutAction(): Promise<ActionResult> {
  await auth.api.signOut();
  return { ok: true, redirectTo: "/" };
}