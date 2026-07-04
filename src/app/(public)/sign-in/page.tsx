import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = { title: "Sign in · PartsMart" };

export default function SignInPage() {
  return (
    <div className="container mx-auto flex max-w-md items-center justify-center px-4 py-16">
      <SignInForm />
    </div>
  );
}