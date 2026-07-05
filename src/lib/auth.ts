import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { env } from "@/lib/env";
import { user, session, account, verification } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
    usePlural: false,
    camelCase: true,
    transaction: false,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string" as const,
        required: true,
        defaultValue: "customer",
        input: true,
      },
      status: {
        type: "string" as const,
        required: true,
        defaultValue: "active",
        input: false,
      },
      businessName: {
        type: "string" as const,
        required: false,
        input: true,
      },
      city: {
        type: "string" as const,
        required: false,
        input: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type Session = typeof auth.$Infer.Session;