"use client";

import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createVendorAction } from "@/features/admin/admin-actions";
import { toast } from "@/hooks/use-toast";

const initialState = { ok: false as const, error: "" };

const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function generateSecurePassword(length = 16): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => CHARSET[n % CHARSET.length]).join("");
}

export function CreateVendorSheet() {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState | { ok: true }, formData: FormData) => {
      const res = await createVendorAction(formData);
      return res as typeof initialState | { ok: true };
    },
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success("Vendor created", "The vendor can now sign in with their credentials.");
      closeRef.current?.click();
      router.refresh();
    }
  }, [state, router]);

  const handleGenerate = useCallback(() => {
    const pw = generateSecurePassword();
    setPassword(pw);
    setShowPassword(true);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-11 px-6 rounded-xl font-bold gap-2 shadow-sm">
          <UserPlus className="h-5 w-5" />
          Add Vendor
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle className="text-xl font-bold">Add Vendor</SheetTitle>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            Create a vendor account. The vendor will be able to sign in immediately using the email and password you
            provide.
          </SheetDescription>
        </SheetHeader>

        {/* Form */}
        <form action={formAction} className="flex-1 flex flex-col">
          <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
            {/* Contact name */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor-name" className="text-sm font-semibold">
                Contact name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendor-name"
                name="name"
                placeholder="e.g. John Dlamini"
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Business name */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor-business" className="text-sm font-semibold">
                Business name <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="vendor-business"
                name="businessName"
                placeholder="e.g. Joburg Auto Parts"
                className="h-10 rounded-lg"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor-city" className="text-sm font-semibold">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendor-city"
                name="city"
                placeholder="e.g. Johannesburg"
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor-email" className="text-sm font-semibold">
                Email address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendor-email"
                name="email"
                type="email"
                placeholder="vendor@example.com"
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="vendor-password" className="text-sm font-semibold">
                  Temporary password <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="h-7 px-2.5 rounded-lg text-xs font-semibold gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                >
                  <RefreshCw className="h-3 w-3" />
                  Generate
                </Button>
              </div>

              {/* Input row with icon buttons */}
              <div className="relative flex items-center">
                <Input
                  id="vendor-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg pr-20 font-mono"
                />
                <div className="absolute right-1 flex items-center gap-0.5">
                  {/* Copy button — only shown when there's a value */}
                  {password && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      title={copied ? "Copied!" : "Copy password"}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Click <span className="font-semibold">Generate</span> for a secure 16-character password, then copy and
                share it with the vendor.
              </p>
            </div>

            {/* Inline error */}
            {!state.ok && state.error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}
          </div>

          {/* Footer */}
          <SheetFooter className="px-6 py-4 border-t border-border gap-2 flex-row justify-end">
            <SheetClose asChild>
              <Button ref={closeRef} type="button" variant="outline" className="rounded-xl" disabled={pending}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" className="rounded-xl font-bold gap-2" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {pending ? "Creating…" : "Create Vendor"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

