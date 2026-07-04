import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = { title: "Sign up · PartsMart" };

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex max-w-md items-center justify-center px-4 py-16">
      <SignUpForm />
    </div>
  );
}