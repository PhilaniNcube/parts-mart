"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpAction, type ActionResult } from "@/features/auth/auth-actions";
import { toast } from "@/hooks/use-toast";

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_prev, fd) => signUpAction(fd),
    { ok: true },
  );

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      toast.success("Account created", "Welcome to PartsMart.");
      router.push(state.redirectTo);
    } else if (!state.ok) {
      toast.error("Couldn’t create account", state.error);
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Customers search free; vendors list parts and subscribe to alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {!state.ok && state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={role === "customer" ? "default" : "outline"}
              onClick={() => setRole("customer")}
            >
              Customer
            </Button>
            <Button
              type="button"
              variant={role === "vendor" ? "default" : "outline"}
              onClick={() => setRole("vendor")}
            >
              Vendor
            </Button>
          </div>
          <input type="hidden" name="role" value={role} />

          <div className="space-y-1.5">
            <Label htmlFor="name">{role === "vendor" ? "Contact name" : "Full name"}</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          {role === "vendor" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business name</Label>
                <Input id="businessName" name="businessName" placeholder="Acme Auto Spares" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input id="city" name="city" placeholder="e.g. Johannesburg" required={role === "vendor"} />
              </div>
            </>
          )}
          <Button type="submit" disabled={pending} className="w-full">{pending ? "Creating…" : "Create account"}</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Button asChild variant="link">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}