"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { signInAction, type ActionResult } from "@/features/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Mail, Lock } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_prev, fd) => signInAction(fd),
    { ok: true },
  );

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      toast.success("Signed in", "Welcome back to PartsMart.");
      router.push(state.redirectTo);
    } else if (!state.ok) {
      toast.error("Couldn’t sign in", state.error);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl shadow-muted/50 border border-border animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Sign in to PartsMart</h1>
        <p className="text-muted-foreground">Enter your email and password</p>
      </header>

      <form action={formAction} className="space-y-6">
        {!state.ok && state.error && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">{state.error}</p>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground font-medium">Email Address</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              autoComplete="email" 
              placeholder="name@company.co.za" 
              className="pl-10 h-12 rounded-xl text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-muted-foreground font-medium">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline transition-all font-medium">Forgot password?</Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password" 
              placeholder="••••••••" 
              className="pl-10 h-12 rounded-xl text-base"
            />
          </div>
        </div>

        <Button type="submit" disabled={pending} className="w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 gap-2 group">
          {pending ? "Signing in..." : (
            <>
              Sign in
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary font-bold hover:underline underline-offset-4 transition-all">Sign up</Link>
      </p>
    </div>
  );
}